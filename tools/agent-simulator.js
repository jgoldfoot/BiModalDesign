#!/usr/bin/env node

/**
 * BiModal Design Agent Simulator Tool
 * Simulates how different AI agents interact with web pages
 * Tests real-world usability of BiModal Design implementations
 * 
 * Usage:
 *   npx @bimodal-design/agent-simulator https://example.com
 *   agent-simulator --agent-type basic --task find-contact --output report.json
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const { URL } = require('url');

class AgentSimulator {
    constructor(options = {}) {
        this.options = {
            timeout: 30000,
            viewport: { width: 1200, height: 800 },
            headless: true,
            ...options
        };
        
        // Simulate different agent capabilities
        this.agentProfiles = {
            basic: {
                name: 'Basic Web Agent',
                description: 'Simple HTTP requests, no JavaScript execution',
                capabilities: {
                    javascript: false,
                    css: false,
                    images: false,
                    cookies: false,
                    localStorage: false
                },
                userAgent: 'Mozilla/5.0 (compatible; BasicWebAgent/1.0)'
            },
            intermediate: {
                name: 'Intermediate Agent',
                description: 'Limited JavaScript, basic DOM parsing',
                capabilities: {
                    javascript: true,
                    css: false,
                    images: false,
                    cookies: false,
                    localStorage: false,
                    maxJSWaitTime: 2000
                },
                userAgent: 'Mozilla/5.0 (compatible; IntermediateAgent/1.0)'
            },
            advanced: {
                name: 'Advanced Agent',
                description: 'Full browser capabilities, extended wait times',
                capabilities: {
                    javascript: true,
                    css: true,
                    images: true,
                    cookies: true,
                    localStorage: true,
                    maxJSWaitTime: 10000
                },
                userAgent: 'Mozilla/5.0 (compatible; AdvancedAgent/1.0)'
            },
            crawler: {
                name: 'Search Crawler',
                description: 'Search engine bot behavior',
                capabilities: {
                    javascript: true,
                    css: false,
                    images: false,
                    cookies: false,
                    localStorage: false,
                    maxJSWaitTime: 5000
                },
                userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
            }
        };
        
        // Common agent tasks
        this.taskTemplates = {
            'find-contact': {
                name: 'Find Contact Information',
                description: 'Locate contact details like email, phone, address',
                selectors: [
                    'a[href^="mailto:"]',
                    'a[href^="tel:"]',
                    '[data-contact]',
                    '.contact',
                    '#contact',
                    'address',
                    '[itemtype*="ContactPoint"]'
                ],
                textPatterns: [
                    /[\w\.-]+@[\w\.-]+\.\w+/g, // Email
                    /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, // Phone
                ]
            },
            'extract-content': {
                name: 'Extract Main Content',
                description: 'Find and extract the primary content of the page',
                selectors: [
                    'main',
                    '[role="main"]',
                    'article',
                    '.content',
                    '.post',
                    '.entry-content',
                    '#content'
                ]
            },
            'navigate-site': {
                name: 'Site Navigation',
                description: 'Test navigation and site structure discovery',
                selectors: [
                    'nav',
                    '[role="navigation"]',
                    '.menu',
                    '.nav',
                    'a[href]',
                    '[data-nav]'
                ]
            },
            'form-interaction': {
                name: 'Form Interaction',
                description: 'Test form accessibility and completion',
                selectors: [
                    'form',
                    'input',
                    'textarea',
                    'select',
                    'button[type="submit"]',
                    '[role="button"]'
                ]
            },
            'data-extraction': {
                name: 'Structured Data Extraction',
                description: 'Extract structured data and metadata',
                selectors: [
                    'script[type="application/ld+json"]',
                    '[itemscope]',
                    '[data-schema]',
                    'meta[property^="og:"]',
                    'meta[name^="twitter:"]'
                ]
            }
        };
    }

    async simulateAgent(url, agentType = 'basic', tasks = ['extract-content']) {
        const profile = this.agentProfiles[agentType];
        if (!profile) {
            throw new Error(`Unknown agent type: ${agentType}. Available: ${Object.keys(this.agentProfiles).join(', ')}`);
        }

        const browser = await puppeteer.launch({
            headless: this.options.headless,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        try {
            const page = await browser.newPage();
            
            // Configure page based on agent capabilities
            await this.configurePageForAgent(page, profile);
            
            const result = {
                url,
                agentType,
                agentProfile: profile,
                timestamp: new Date().toISOString(),
                tasks: {},
                performance: {},
                accessibility: {},
                errors: []
            };

            // Navigate to page
            const startTime = Date.now();
            
            try {
                await page.goto(url, { 
                    waitUntil: profile.capabilities.javascript ? 'networkidle0' : 'domcontentloaded',
                    timeout: this.options.timeout 
                });
                
                // Wait for JavaScript if agent supports it
                if (profile.capabilities.javascript && profile.capabilities.maxJSWaitTime) {
                    await page.waitForTimeout(Math.min(profile.capabilities.maxJSWaitTime, 5000));
                }
                
            } catch (error) {
                result.errors.push(`Navigation failed: ${error.message}`);
                return result;
            }

            result.performance.navigationTime = Date.now() - startTime;

            // Run tasks
            await Promise.all(
                tasks.map(async (taskName) => {
                    result.tasks[taskName] = await this.executeTask(page, taskName, profile);
                })
            );

            // Test BiModal Design compliance
            result.accessibility = await this.testAgentAccessibility(page, profile);

            // Performance metrics
            result.performance = {
                ...result.performance,
                ...(await this.measurePerformance(page, profile))
            };

            return result;

        } catch (error) {
            return {
                url,
                agentType,
                timestamp: new Date().toISOString(),
                error: error.message,
                success: false
            };
        } finally {
            await browser.close();
        }
    }

    async configurePageForAgent(page, profile) {
        // Set user agent
        await page.setUserAgent(profile.userAgent);
        
        // Set viewport
        await page.setViewport(this.options.viewport);
        
        // Configure capabilities
        if (!profile.capabilities.javascript) {
            await page.setJavaScriptEnabled(false);
        }
        
        if (!profile.capabilities.images || !profile.capabilities.css) {
            await page.setRequestInterception(true);
            page.on('request', (req) => {
                if (req.isInterceptResolutionHandled()) return;

                if (!profile.capabilities.images && req.resourceType() === 'image') {
                    req.abort();
                } else if (!profile.capabilities.css && req.resourceType() === 'stylesheet') {
                    req.abort();
                } else {
                    req.continue();
                }
            });
        }
    }

    async executeTask(page, taskName, profile) {
        const task = this.taskTemplates[taskName];
        if (!task) {
            return { error: `Unknown task: ${taskName}` };
        }

        const result = {
            taskName,
            taskDescription: task.description,
            success: false,
            elementsFound: [],
            textMatches: [],
            details: [],
            issues: []
        };

        try {
            // Test selector-based discovery
            if (task.selectors) {
                for (const selector of task.selectors) {
                    try {
                        const elements = await page.$$(selector);
                        if (elements.length > 0) {
                            result.elementsFound.push({
                                selector,
                                count: elements.length
                            });
                            
                            // Extract text content from found elements
                            const textContent = await page.$$eval(selector, els => 
                                els.map(el => ({
                                    text: el.textContent?.trim(),
                                    href: el.href,
                                    tagName: el.tagName,
                                    attributes: Array.from(el.attributes).reduce((acc, attr) => {
                                        acc[attr.name] = attr.value;
                                        return acc;
                                    }, {})
                                }))
                            );
                            
                            result.details.push({
                                selector,
                                elements: textContent.slice(0, 5) // Limit to first 5 for brevity
                            });
                        }
                    } catch (error) {
                        result.issues.push(`Selector "${selector}" failed: ${error.message}`);
                    }
                }
            }

            // Test text pattern matching
            if (task.textPatterns) {
                const pageText = await page.evaluate(() => document.body.textContent);
                
                for (const pattern of task.textPatterns) {
                    const matches = pageText.match(pattern);
                    if (matches) {
                        result.textMatches.push({
                            pattern: pattern.toString(),
                            matches: matches.slice(0, 10) // Limit matches
                        });
                    }
                }
            }

            // Determine success
            result.success = result.elementsFound.length > 0 || result.textMatches.length > 0;

            // Add task-specific analysis
            if (taskName === 'find-contact') {
                result.contactTypes = this.analyzeContactTypes(result);
            } else if (taskName === 'extract-content') {
                result.contentQuality = await this.analyzeContentQuality(page, result);
            } else if (taskName === 'form-interaction') {
                result.formAccessibility = await this.analyzeFormAccessibility(page, result);
            }

        } catch (error) {
            result.issues.push(`Task execution failed: ${error.message}`);
        }

        return result;
    }

    async testAgentAccessibility(page, profile) {
        const result = {
            initialPayloadTest: {},
            semanticStructure: {},
            agentHints: {},
            structuredData: {},
            score: 0
        };

        try {
            // Test initial payload accessibility (FR-1)
            if (!profile.capabilities.javascript) {
                // Agent can't run JavaScript - test what's available immediately
                const content = await page.content();
                const textLength = await page.evaluate(() => document.body.textContent.trim().length);
                
                result.initialPayloadTest = {
                    htmlSize: content.length,
                    textContentLength: textLength,
                    hasContent: textLength > 100,
                    hasSemantic: content.includes('<main') || content.includes('role="main"')
                };
            } else {
                // Test progressive enhancement
                result.initialPayloadTest = {
                    hasJavaScript: true,
                    note: 'Agent can execute JavaScript - testing enhanced experience'
                };
            }

            // Test semantic structure
            const semanticElements = await page.evaluate(() => {
                return {
                    landmarks: document.querySelectorAll('main, nav, header, footer, aside, section, article').length,
                    headings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
                    lists: document.querySelectorAll('ul, ol, dl').length,
                    forms: document.querySelectorAll('form').length
                };
            });

            result.semanticStructure = semanticElements;

            // Test agent-specific hints
            const agentHints = await page.evaluate(() => {
                return {
                    dataAttributes: document.querySelectorAll('[data-agent-context], [data-agent-action], [data-component]').length,
                    ariaLabels: document.querySelectorAll('[aria-label], [aria-labelledby]').length,
                    roles: document.querySelectorAll('[role]').length
                };
            });

            result.agentHints = agentHints;

            // Test structured data
            const structuredData = await page.evaluate(() => {
                const jsonLd = document.querySelectorAll('script[type="application/ld+json"]');
                const microdata = document.querySelectorAll('[itemscope]');
                
                return {
                    jsonLdCount: jsonLd.length,
                    microdataCount: microdata.length,
                    hasStructuredData: jsonLd.length > 0 || microdata.length > 0
                };
            });

            result.structuredData = structuredData;

            // Calculate accessibility score
            let score = 0;
            if (result.initialPayloadTest.hasContent) score += 30;
            if (result.semanticStructure.landmarks > 0) score += 20;
            if (result.semanticStructure.headings > 0) score += 15;
            if (result.agentHints.dataAttributes > 0) score += 15;
            if (result.structuredData.hasStructuredData) score += 10;
            if (result.agentHints.ariaLabels > 0) score += 10;

            result.score = score;

        } catch (error) {
            result.error = error.message;
        }

        return result;
    }

    async measurePerformance(page, profile) {
        try {
            const metrics = await page.evaluate(() => {
                const perf = performance.getEntriesByType('navigation')[0];
                return {
                    domContentLoaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart,
                    loadComplete: perf.loadEventEnd - perf.loadEventStart,
                    totalLoadTime: perf.loadEventEnd - perf.fetchStart,
                    domSize: document.querySelectorAll('*').length
                };
            });

            return {
                ...metrics,
                agentFriendly: metrics.totalLoadTime < 5000 && metrics.domSize < 2000
            };
        } catch (error) {
            return { error: error.message };
        }
    }

    analyzeContactTypes(result) {
        const types = [];
        
        result.elementsFound.forEach(found => {
            if (found.selector.includes('mailto:')) types.push('email');
            if (found.selector.includes('tel:')) types.push('phone');
            if (found.selector.includes('address')) types.push('address');
        });

        result.textMatches.forEach(match => {
            if (match.pattern.includes('\\w.*@')) types.push('email');
            if (match.pattern.includes('\\d.*\\d')) types.push('phone');
        });

        return Array.from(new Set(types));
    }

    async analyzeContentQuality(page, result) {
        try {
            const quality = await page.evaluate(() => {
                const main = document.querySelector('main, [role="main"], article');
                if (!main) return { hasMainContent: false };

                const text = main.textContent.trim();
                const images = main.querySelectorAll('img').length;
                const links = main.querySelectorAll('a').length;
                const headings = main.querySelectorAll('h1, h2, h3, h4, h5, h6').length;

                return {
                    hasMainContent: true,
                    textLength: text.length,
                    imageCount: images,
                    linkCount: links,
                    headingCount: headings,
                    contentQuality: text.length > 500 && headings > 0 ? 'good' : 'basic'
                };
            });

            return quality;
        } catch (error) {
            return { error: error.message };
        }
    }

    async analyzeFormAccessibility(page, result) {
        try {
            const formAnalysis = await page.evaluate(() => {
                const forms = document.querySelectorAll('form');
                if (forms.length === 0) return { hasForms: false };

                let totalInputs = 0;
                let labeledInputs = 0;
                let requiredInputs = 0;

                forms.forEach(form => {
                    const inputs = form.querySelectorAll('input, select, textarea');
                    inputs.forEach(input => {
                        if (input.type === 'hidden' || input.type === 'submit') return;
                        
                        totalInputs++;
                        
                        if (input.hasAttribute('required') || input.hasAttribute('aria-required')) {
                            requiredInputs++;
                        }
                        
                        const hasLabel = input.labels && input.labels.length > 0;
                        const hasAriaLabel = input.hasAttribute('aria-label') || input.hasAttribute('aria-labelledby');
                        
                        if (hasLabel || hasAriaLabel) {
                            labeledInputs++;
                        }
                    });
                });

                return {
                    hasForms: true,
                    formCount: forms.length,
                    totalInputs,
                    labeledInputs,
                    requiredInputs,
                    labelPercentage: totalInputs > 0 ? Math.round((labeledInputs / totalInputs) * 100) : 0
                };
            });

            return formAnalysis;
        } catch (error) {
            return { error: error.message };
        }
    }

    async runMultiAgentTest(url, options = {}) {
        const {
            agents = ['basic', 'intermediate', 'advanced'],
            tasks = ['extract-content', 'find-contact', 'navigate-site'],
            includeComparison = true
        } = options;

        const results = {};
        
        for (const agentType of agents) {
            console.log(`Testing with ${agentType} agent...`);
            results[agentType] = await this.simulateAgent(url, agentType, tasks);
        }

        if (includeComparison) {
            results.comparison = this.compareAgentResults(results);
        }

        return results;
    }

    compareAgentResults(results) {
        const comparison = {
            taskSuccessRates: {},
            accessibilityScores: {},
            performanceComparison: {},
            recommendations: []
        };

        // Compare task success rates
        const agentTypes = Object.keys(results).filter(key => key !== 'comparison');
        
        agentTypes.forEach(agentType => {
            const result = results[agentType];
            if (result.tasks) {
                Object.keys(result.tasks).forEach(taskName => {
                    if (!comparison.taskSuccessRates[taskName]) {
                        comparison.taskSuccessRates[taskName] = {};
                    }
                    comparison.taskSuccessRates[taskName][agentType] = result.tasks[taskName].success;
                });
            }
            
            if (result.accessibility && result.accessibility.score) {
                comparison.accessibilityScores[agentType] = result.accessibility.score;
            }
            
            if (result.performance) {
                comparison.performanceComparison[agentType] = result.performance;
            }
        });

        // Generate recommendations
        const basicAgent = results.basic;
        const advancedAgent = results.advanced;

        if (basicAgent && advancedAgent) {
            if (basicAgent.accessibility?.score < 70) {
                comparison.recommendations.push('Basic agents struggling - implement FR-1 (Initial Payload Accessibility)');
            }
            
            if (advancedAgent.accessibility?.score > basicAgent.accessibility?.score + 30) {
                comparison.recommendations.push('Large gap between basic and advanced agents - consider progressive enhancement');
            }

            Object.keys(comparison.taskSuccessRates).forEach(taskName => {
                const basicSuccess = comparison.taskSuccessRates[taskName].basic;
                const advancedSuccess = comparison.taskSuccessRates[taskName].advanced;
                
                if (!basicSuccess && advancedSuccess) {
                    comparison.recommendations.push(`Task "${taskName}" only works for advanced agents - improve semantic markup`);
                }
            });
        }

        return comparison;
    }

    async generateReport(results, format = 'json') {
        switch (format) {
            case 'html':
                return this.generateHTMLReport(results);
            case 'markdown':
                return this.generateMarkdownReport(results);
            default:
                return JSON.stringify(results, null, 2);
        }
    }

    generateMarkdownReport(results) {
        let markdown = `# Agent Simulation Report\n\n`;
        markdown += `Generated on ${new Date().toISOString()}\n\n`;

        if (results.comparison) {
            // Multi-agent report
            markdown += `## Multi-Agent Test Results\n\n`;
            
            markdown += `### Task Success Rates\n\n`;
            Object.entries(results.comparison.taskSuccessRates).forEach(([task, agents]) => {
                markdown += `**${task}:**\n`;
                Object.entries(agents).forEach(([agent, success]) => {
                    markdown += `- ${agent}: ${success ? '✅' : '❌'}\n`;
                });
                markdown += '\n';
            });

            markdown += `### Accessibility Scores\n\n`;
            Object.entries(results.comparison.accessibilityScores).forEach(([agent, score]) => {
                markdown += `- **${agent}:** ${score}%\n`;
            });

            if (results.comparison.recommendations.length > 0) {
                markdown += `\n### Recommendations\n\n`;
                results.comparison.recommendations.forEach(rec => {
                    markdown += `- ${rec}\n`;
                });
            }

        } else {
            // Single agent report
            const result = Object.values(results)[0];
            markdown += `## ${result.agentProfile.name} Test Results\n\n`;
            markdown += `**URL:** ${result.url}\n`;
            markdown += `**Agent Type:** ${result.agentType}\n`;
            markdown += `**Accessibility Score:** ${result.accessibility.score}%\n\n`;

            markdown += `### Task Results\n\n`;
            Object.entries(result.tasks).forEach(([taskName, task]) => {
                markdown += `#### ${task.taskDescription}\n`;
                markdown += `**Status:** ${task.success ? '✅ Success' : '❌ Failed'}\n`;
                markdown += `**Elements Found:** ${task.elementsFound.length}\n`;
                if (task.issues.length > 0) {
                    markdown += `**Issues:** ${task.issues.join(', ')}\n`;
                }
                markdown += '\n';
            });
        }

        return markdown;
    }

    escapeHtml(unsafe) {
        if (unsafe == null) return '';
        return unsafe
            .toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    generateHTMLReport(results) {
        // HTML report implementation would go here
        // For brevity, returning a basic HTML structure
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Agent Simulation Report</title>
    <style>
        body { font-family: system-ui, sans-serif; margin: 40px; }
        .success { color: #22c55e; }
        .failed { color: #ef4444; }
        .score { font-size: 24px; font-weight: bold; }
    </style>
</head>
<body>
    <h1>Agent Simulation Report</h1>
    <pre>${this.escapeHtml(JSON.stringify(results, null, 2))}</pre>
</body>
</html>`;
    }
}

// CLI Implementation
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        console.log(`
BiModal Design Agent Simulator Tool

Usage:
  agent-simulator <url> [options]

Options:
  --agent-type, -a      Agent type (basic, intermediate, advanced, crawler) [default: basic]
  --tasks, -t           Comma-separated tasks to test [default: extract-content]
  --multi-agent, -m     Test with multiple agent types
  --output, -o          Output file path
  --format, -f          Output format (json, markdown, html) [default: json]
  --headless           Run in headless mode [default: true]
  --timeout            Timeout in milliseconds [default: 30000]
  --help, -h           Show this help message

Available Tasks:
  extract-content      Find and extract main page content
  find-contact        Locate contact information (email, phone, address)
  navigate-site       Test navigation and site structure
  form-interaction    Test form accessibility and completion
  data-extraction     Extract structured data and metadata

Available Agent Types:
  basic               Simple HTTP requests, no JavaScript
  intermediate        Limited JavaScript execution (2s timeout)
  advanced            Full browser capabilities (10s timeout)
  crawler             Search engine bot simulation

Examples:
  agent-simulator https://example.com
  agent-simulator https://example.com --agent-type advanced --tasks extract-content,find-contact
  agent-simulator https://example.com --multi-agent --format markdown --output report.md
  agent-simulator https://example.com --tasks form-interaction --format html --output report.html
        `);
        process.exit(0);
    }

    try {
        const simulator = new AgentSimulator();
        
        // Parse arguments
        const url = args.find(arg => arg.startsWith('http'));
        if (!url) {
            console.error('Error: Please provide a URL');
            process.exit(1);
        }

        const options = {
            agentType: 'basic',
            tasks: ['extract-content'],
            multiAgent: false,
            output: null,
            format: 'json',
            headless: true,
            timeout: 30000
        };

        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            
            if (arg === '--agent-type' || arg === '-a') {
                options.agentType = args[++i];
            } else if (arg === '--tasks' || arg === '-t') {
                options.tasks = args[++i].split(',');
            } else if (arg === '--multi-agent' || arg === '-m') {
                options.multiAgent = true;
            } else if (arg === '--output' || arg === '-o') {
                options.output = args[++i];
            } else if (arg === '--format' || arg === '-f') {
                options.format = args[++i];
            } else if (arg === '--headless') {
                options.headless = args[++i] !== 'false';
            } else if (arg === '--timeout') {
                options.timeout = parseInt(args[++i]);
            }
        }

        // Configure simulator
        simulator.options.headless = options.headless;
        simulator.options.timeout = options.timeout;

        // Run simulation
        let results;
        if (options.multiAgent) {
            console.log(`Running multi-agent test for: ${url}`);
            results = await simulator.runMultiAgentTest(url, { tasks: options.tasks });
        } else {
            console.log(`Running ${options.agentType} agent test for: ${url}`);
            results = await simulator.simulateAgent(url, options.agentType, options.tasks);
        }

        // Generate report
        const report = await simulator.generateReport(results, options.format);
        
        if (options.output) {
            await fs.writeFile(options.output, report);
            console.log(`Report saved to: ${options.output}`);
        } else {
            console.log(report);
        }

        // Exit with success code
        process.exit(0);

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

// Export for use as module
module.exports = AgentSimulator;

// Run CLI if called directly
if (require.main === module) {
    main();
}
