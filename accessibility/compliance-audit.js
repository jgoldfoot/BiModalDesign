#!/usr/bin/env node

/**
 * BiModal Design Compliance Audit Tool
 * Comprehensive testing of all BiModal Design requirements
 * 
 * Usage:
 *   npx @bimodal-design/compliance-audit https://example.com
 *   bmd-audit --config audit.json --output report.html
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const { URL } = require('url');

class BiModalDesignComplianceAuditor {
    constructor(options = {}) {
        this.options = {
            timeout: 30000,
            userAgent: 'BiModalDesign-Compliance-Auditor/1.0',
            viewport: { width: 1200, height: 800 },
            includeScreenshots: false,
            ...options
        };
        
        this.requirements = {
            FR1: { weight: 30, name: 'Initial Payload Accessibility' },
            FR2: { weight: 20, name: 'Semantic HTML Structure' },
            FR3: { weight: 15, name: 'ARIA Implementation' },
            FR4: { weight: 10, name: 'Agent-Friendly Navigation' },
            FR5: { weight: 10, name: 'Form Accessibility' },
            FR6: { weight: 10, name: 'Content Discovery' },
            FR7: { weight: 5, name: 'Performance Optimization' }
        };
    }

    async auditPage(url, config = {}) {
        const browser = await puppeteer.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        try {
            const page = await browser.newPage();
            await page.setUserAgent(this.options.userAgent);
            await page.setViewport(this.options.viewport);
            
            const result = {
                url,
                timestamp: new Date().toISOString(),
                requirements: {},
                overallScore: 0,
                passed: false,
                recommendations: [],
                errors: []
            };

            // Load page
            await page.goto(url, { waitUntil: 'networkidle0', timeout: this.options.timeout });
            
            // Run all requirement tests
            result.requirements.FR1 = await this.testFR1(page);
            result.requirements.FR2 = await this.testFR2(page);
            result.requirements.FR3 = await this.testFR3(page);
            result.requirements.FR4 = await this.testFR4(page);
            result.requirements.FR5 = await this.testFR5(page);
            result.requirements.FR6 = await this.testFR6(page);
            result.requirements.FR7 = await this.testFR7(page);
            
            // Calculate overall score
            result.overallScore = this.calculateOverallScore(result.requirements);
            result.passed = result.overallScore >= 70;
            
            // Generate recommendations
            result.recommendations = this.generateRecommendations(result.requirements);
            
            // Capture screenshot if requested
            if (this.options.includeScreenshots) {
                result.screenshot = await page.screenshot({ encoding: 'base64', fullPage: true });
            }
            
            return result;
            
        } catch (error) {
            return {
                url,
                timestamp: new Date().toISOString(),
                error: error.message,
                passed: false,
                overallScore: 0
            };
        } finally {
            await browser.close();
        }
    }

    // FR-1: Initial Payload Accessibility
    async testFR1(page) {
        const result = {
            requirement: 'FR1',
            name: 'Initial Payload Accessibility',
            passed: false,
            score: 0,
            details: [],
            issues: []
        };

        try {
            // Disable JavaScript and reload
            await page.setJavaScriptEnabled(false);
            await page.reload({ waitUntil: 'networkidle0' });
            
            // Test content accessibility without JS
            const content = await page.content();
            const textContent = await page.evaluate(() => document.body.textContent.trim());
            
            // Check for meaningful content
            if (textContent.length < 100) {
                result.issues.push('Page contains less than 100 characters of text content without JavaScript');
            } else {
                result.details.push(`Found ${textContent.length} characters of text content`);
            }
            
            // Check for semantic structure
            const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', els => els.length);
            if (headings === 0) {
                result.issues.push('No heading elements found');
            } else {
                result.details.push(`Found ${headings} heading elements`);
            }
            
            // Check for navigation
            const navElements = await page.$$eval('nav, [role="navigation"]', els => els.length);
            if (navElements === 0) {
                result.issues.push('No navigation elements found');
            } else {
                result.details.push(`Found ${navElements} navigation elements`);
            }
            
            // Check for main content area
            const mainElements = await page.$$eval('main, [role="main"]', els => els.length);
            if (mainElements === 0) {
                result.issues.push('No main content area identified');
            } else {
                result.details.push(`Found ${mainElements} main content areas`);
            }
            
            // Re-enable JavaScript for other tests
            await page.setJavaScriptEnabled(true);
            
            // Calculate score (0-100)
            const totalChecks = 4;
            const passedChecks = totalChecks - result.issues.length;
            result.score = Math.round((passedChecks / totalChecks) * 100);
            result.passed = result.score >= 70;
            
        } catch (error) {
            result.issues.push(`FR-1 test error: ${error.message}`);
        }
        
        return result;
    }

    // FR-2: Semantic HTML Structure
    async testFR2(page) {
        const result = {
            requirement: 'FR2',
            name: 'Semantic HTML Structure',
            passed: false,
            score: 0,
            details: [],
            issues: []
        };

        try {
            // Check for document outline
            const headingStructure = await page.evaluate(() => {
                const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
                return headings.map(h => ({
                    level: parseInt(h.tagName.charAt(1)),
                    text: h.textContent.trim()
                }));
            });
            
            if (headingStructure.length === 0) {
                result.issues.push('No heading structure found');
            } else {
                result.details.push(`Document outline with ${headingStructure.length} headings`);
                
                // Check for proper heading hierarchy
                let prevLevel = 0;
                let hierarchyValid = true;
                for (const heading of headingStructure) {
                    if (prevLevel > 0 && heading.level > prevLevel + 1) {
                        hierarchyValid = false;
                        break;
                    }
                    prevLevel = heading.level;
                }
                
                if (!hierarchyValid) {
                    result.issues.push('Heading hierarchy has gaps (e.g., h1 directly to h3)');
                } else {
                    result.details.push('Proper heading hierarchy maintained');
                }
            }
            
            // Check for semantic landmarks
            const landmarks = await page.evaluate(() => {
                const elements = document.querySelectorAll('header, nav, main, article, section, aside, footer, [role]');
                return Array.from(elements).map(el => el.tagName.toLowerCase() || el.getAttribute('role'));
            });
            
            const requiredLandmarks = ['header', 'nav', 'main', 'footer'];
            const missingLandmarks = requiredLandmarks.filter(landmark => 
                !landmarks.some(l => l.includes(landmark))
            );
            
            if (missingLandmarks.length > 0) {
                result.issues.push(`Missing landmarks: ${missingLandmarks.join(', ')}`);
            } else {
                result.details.push('All required landmarks present');
            }
            
            // Check for proper list usage
            const lists = await page.$$eval('ul, ol, dl', els => els.length);
            if (lists > 0) {
                result.details.push(`Found ${lists} list elements`);
            }
            
            // Calculate score
            const totalChecks = 3;
            const passedChecks = totalChecks - result.issues.length;
            result.score = Math.round((passedChecks / totalChecks) * 100);
            result.passed = result.score >= 70;
            
        } catch (error) {
            result.issues.push(`FR-2 test error: ${error.message}`);
        }
        
        return result;
    }

    // FR-3: ARIA Implementation
    async testFR3(page) {
        const result = {
            requirement: 'FR3',
            name: 'ARIA Implementation',
            passed: false,
            score: 0,
            details: [],
            issues: []
        };

        try {
            // Check for ARIA labels
            const ariaLabels = await page.$$eval('[aria-label], [aria-labelledby]', els => els.length);
            if (ariaLabels > 0) {
                result.details.push(`Found ${ariaLabels} elements with ARIA labels`);
            }
            
            // Check for ARIA roles
            const ariaRoles = await page.$$eval('[role]', els => 
                Array.from(new Set(els.map(el => el.getAttribute('role'))))
            );
            if (ariaRoles.length > 0) {
                result.details.push(`ARIA roles used: ${ariaRoles.join(', ')}`);
            }
            
            // Check for ARIA states and properties
            const ariaStates = await page.evaluate(() => {
                const elements = document.querySelectorAll('*');
                const states = new Set();
                elements.forEach(el => {
                    Array.from(el.attributes).forEach(attr => {
                        if (attr.name.startsWith('aria-') && attr.name !== 'aria-label' && attr.name !== 'aria-labelledby') {
                            states.add(attr.name);
                        }
                    });
                });
                return Array.from(states);
            });
            
            if (ariaStates.length > 0) {
                result.details.push(`ARIA states/properties: ${ariaStates.join(', ')}`);
            }
            
            // Check for images without alt text
            const imagesWithoutAlt = await page.$$eval('img:not([alt])', els => els.length);
            if (imagesWithoutAlt > 0) {
                result.issues.push(`${imagesWithoutAlt} images missing alt attributes`);
            }
            
            // Check for interactive elements without accessible names
            const interactiveWithoutNames = await page.evaluate(() => {
                const interactive = document.querySelectorAll('button, a, input, select, textarea');
                let count = 0;
                interactive.forEach(el => {
                    const hasAccessibleName = el.getAttribute('aria-label') || 
                                            el.getAttribute('aria-labelledby') ||
                                            el.textContent.trim() ||
                                            el.getAttribute('title') ||
                                            (el.tagName === 'INPUT' && el.getAttribute('placeholder'));
                    if (!hasAccessibleName) count++;
                });
                return count;
            });
            
            if (interactiveWithoutNames > 0) {
                result.issues.push(`${interactiveWithoutNames} interactive elements lack accessible names`);
            }
            
            // Calculate score
            const hasBasicAria = ariaLabels > 0 || ariaRoles.length > 0;
            const hasNoImageIssues = imagesWithoutAlt === 0;
            const hasNoInteractiveIssues = interactiveWithoutNames === 0;
            
            let score = 0;
            if (hasBasicAria) score += 40;
            if (hasNoImageIssues) score += 30;
            if (hasNoInteractiveIssues) score += 30;
            
            result.score = score;
            result.passed = result.score >= 70;
            
        } catch (error) {
            result.issues.push(`FR-3 test error: ${error.message}`);
        }
        
        return result;
    }

    // FR-4: Agent-Friendly Navigation
    async testFR4(page) {
        const result = {
            requirement: 'FR4',
            name: 'Agent-Friendly Navigation',
            passed: false,
            score: 0,
            details: [],
            issues: []
        };

        try {
            // Check for breadcrumbs
            const breadcrumbs = await page.$$eval('[aria-label*="breadcrumb"], .breadcrumb, nav ol, nav ul', els => els.length);
            if (breadcrumbs > 0) {
                result.details.push('Breadcrumb navigation found');
            } else {
                result.issues.push('No breadcrumb navigation detected');
            }
            
            // Check for skip links
            const skipLinks = await page.$$eval('a[href^="#"]:first-child, .skip-link', els => els.length);
            if (skipLinks > 0) {
                result.details.push('Skip links found');
            } else {
                result.issues.push('No skip links found');
            }
            
            // Check for table of contents or page outline
            const toc = await page.$$eval('.toc, .table-of-contents, [aria-label*="contents"]', els => els.length);
            if (toc > 0) {
                result.details.push('Table of contents or page outline found');
            }
            
            // Check for search functionality
            const searchElements = await page.$$eval('input[type="search"], [role="search"], .search', els => els.length);
            if (searchElements > 0) {
                result.details.push('Search functionality detected');
            }
            
            // Check for logical tab order
            const focusableElements = await page.evaluate(() => {
                const elements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
                return Array.from(elements).map(el => ({
                    tag: el.tagName,
                    tabIndex: el.tabIndex,
                    hasTabIndex: el.hasAttribute('tabindex')
                }));
            });
            
            const negativeTabIndex = focusableElements.filter(el => el.tabIndex < 0).length;
            if (negativeTabIndex > 0) {
                result.issues.push(`${negativeTabIndex} elements with negative tabindex may break navigation`);
            }
            
            // Calculate score
            const totalChecks = 3; // breadcrumbs, skip links, negative tabindex
            const passedChecks = totalChecks - result.issues.length;
            result.score = Math.round((passedChecks / totalChecks) * 100);
            result.passed = result.score >= 70;
            
        } catch (error) {
            result.issues.push(`FR-4 test error: ${error.message}`);
        }
        
        return result;
    }

    // FR-5: Form Accessibility
    async testFR5(page) {
        const result = {
            requirement: 'FR5',
            name: 'Form Accessibility',
            passed: false,
            score: 0,
            details: [],
            issues: []
        };

        try {
            const forms = await page.$$eval('form', els => els.length);
            
            if (forms === 0) {
                result.details.push('No forms found on page');
                result.score = 100; // N/A scenario passes
                result.passed = true;
                return result;
            }
            
            result.details.push(`Found ${forms} form(s)`);
            
            // Check for form labels
            const formControls = await page.evaluate(() => {
                const controls = document.querySelectorAll('input, select, textarea');
                let totalControls = 0;
                let labeledControls = 0;
                
                controls.forEach(control => {
                    if (control.type === 'hidden' || control.type === 'submit' || control.type === 'button') {
                        return; // Skip these types
                    }
                    
                    totalControls++;
                    
                    const hasLabel = control.labels && control.labels.length > 0;
                    const hasAriaLabel = control.getAttribute('aria-label');
                    const hasAriaLabelledby = control.getAttribute('aria-labelledby');
                    const hasTitle = control.getAttribute('title');
                    
                    if (hasLabel || hasAriaLabel || hasAriaLabelledby || hasTitle) {
                        labeledControls++;
                    }
                });
                
                return { totalControls, labeledControls };
            });
            
            if (formControls.totalControls > 0) {
                const labelPercentage = (formControls.labeledControls / formControls.totalControls) * 100;
                result.details.push(`${formControls.labeledControls}/${formControls.totalControls} form controls have labels (${Math.round(labelPercentage)}%)`);
                
                if (labelPercentage < 100) {
                    result.issues.push(`${formControls.totalControls - formControls.labeledControls} form controls missing labels`);
                }
            }
            
            // Check for fieldsets and legends
            const fieldsets = await page.$$eval('fieldset', els => els.length);
            const legends = await page.$$eval('legend', els => els.length);
            
            if (fieldsets > 0) {
                result.details.push(`Found ${fieldsets} fieldset(s) with ${legends} legend(s)`);
                if (fieldsets !== legends) {
                    result.issues.push('Some fieldsets missing legends');
                }
            }
            
            // Check for error handling
            const errorElements = await page.$$eval('[aria-invalid], .error, .invalid, [role="alert"]', els => els.length);
            if (errorElements > 0) {
                result.details.push('Error handling elements found');
            }
            
            // Calculate score
            let score = 0;
            if (formControls.totalControls > 0) {
                score += (formControls.labeledControls / formControls.totalControls) * 80;
            } else {
                score += 80;
            }
            
            if (fieldsets === 0 || fieldsets === legends) {
                score += 20;
            }
            
            result.score = Math.round(score);
            result.passed = result.score >= 70;
            
        } catch (error) {
            result.issues.push(`FR-5 test error: ${error.message}`);
        }
        
        return result;
    }

    // FR-6: Content Discovery
    async testFR6(page) {
        const result = {
            requirement: 'FR6',
            name: 'Content Discovery',
            passed: false,
            score: 0,
            details: [],
            issues: []
        };

        try {
            // Check for meta description
            const metaDescription = await page.$eval('meta[name="description"]', el => el.content).catch(() => null);
            if (metaDescription) {
                result.details.push(`Meta description: ${metaDescription.substring(0, 100)}...`);
            } else {
                result.issues.push('Missing meta description');
            }
            
            // Check for page title
            const title = await page.title();
            if (title && title.trim()) {
                result.details.push(`Page title: ${title}`);
            } else {
                result.issues.push('Missing or empty page title');
            }
            
            // Check for structured data
            const structuredData = await page.evaluate(() => {
                const jsonLd = document.querySelectorAll('script[type="application/ld+json"]');
                const microdata = document.querySelectorAll('[itemscope]');
                return {
                    jsonLd: jsonLd.length,
                    microdata: microdata.length
                };
            });
            
            if (structuredData.jsonLd > 0 || structuredData.microdata > 0) {
                result.details.push(`Structured data found: ${structuredData.jsonLd} JSON-LD, ${structuredData.microdata} microdata`);
            } else {
                result.issues.push('No structured data detected');
            }
            
            // Check for content sections
            const contentSections = await page.$$eval('article, section, .content, .post, .entry', els => els.length);
            if (contentSections > 0) {
                result.details.push(`Found ${contentSections} content sections`);
            } else {
                result.issues.push('No clear content sections identified');
            }
            
            // Check for links with meaningful text
            const links = await page.evaluate(() => {
                const allLinks = document.querySelectorAll('a[href]');
                let totalLinks = 0;
                let meaningfulLinks = 0;
                
                allLinks.forEach(link => {
                    totalLinks++;
                    const text = link.textContent.trim().toLowerCase();
                    const meaninglessTexts = ['click here', 'read more', 'learn more', 'here', 'more'];
                    
                    if (text.length > 4 && !meaninglessTexts.includes(text)) {
                        meaningfulLinks++;
                    }
                });
                
                return { totalLinks, meaningfulLinks };
            });
            
            if (links.totalLinks > 0) {
                const meaningfulPercentage = (links.meaningfulLinks / links.totalLinks) * 100;
                result.details.push(`${links.meaningfulLinks}/${links.totalLinks} links have meaningful text (${Math.round(meaningfulPercentage)}%)`);
                
                if (meaningfulPercentage < 80) {
                    result.issues.push('Some links have non-descriptive text');
                }
            }
            
            // Calculate score
            const totalChecks = 5;
            const passedChecks = totalChecks - result.issues.length;
            result.score = Math.round((passedChecks / totalChecks) * 100);
            result.passed = result.score >= 70;
            
        } catch (error) {
            result.issues.push(`FR-6 test error: ${error.message}`);
        }
        
        return result;
    }

    // FR-7: Performance Optimization
    async testFR7(page) {
        const result = {
            requirement: 'FR7',
            name: 'Performance Optimization',
            passed: false,
            score: 0,
            details: [],
            issues: []
        };

        try {
            // Measure page load performance
            const metrics = await page.evaluate(() => {
                const perf = performance.getEntriesByType('navigation')[0];
                return {
                    domContentLoaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart,
                    loadComplete: perf.loadEventEnd - perf.loadEventStart,
                    totalLoadTime: perf.loadEventEnd - perf.fetchStart
                };
            });
            
            result.details.push(`DOM Content Loaded: ${Math.round(metrics.domContentLoaded)}ms`);
            result.details.push(`Total Load Time: ${Math.round(metrics.totalLoadTime)}ms`);
            
            // Check for large images
            const images = await page.evaluate(() => {
                const imgs = document.querySelectorAll('img');
                let largeImages = 0;
                let totalImages = imgs.length;
                
                imgs.forEach(img => {
                    if (img.naturalWidth > 2000 || img.naturalHeight > 2000) {
                        largeImages++;
                    }
                });
                
                return { totalImages, largeImages };
            });
            
            if (images.largeImages > 0) {
                result.issues.push(`${images.largeImages} potentially oversized images detected`);
            } else if (images.totalImages > 0) {
                result.details.push('Image sizes appear optimized');
            }
            
            // Check for excessive DOM size
            const domSize = await page.evaluate(() => document.querySelectorAll('*').length);
            result.details.push(`DOM elements: ${domSize}`);
            
            if (domSize > 1500) {
                result.issues.push('Large DOM size may impact performance');
            }
            
            // Check for render-blocking resources
            const resources = await page.evaluate(() => {
                const links = document.querySelectorAll('link[rel="stylesheet"]');
                const scripts = document.querySelectorAll('script[src]');
                return {
                    stylesheets: links.length,
                    externalScripts: scripts.length
                };
            });
            
            result.details.push(`External resources: ${resources.stylesheets} CSS, ${resources.externalScripts} JS`);
            
            // Calculate score based on performance metrics
            let score = 100;
            
            if (metrics.totalLoadTime > 3000) score -= 30;
            else if (metrics.totalLoadTime > 2000) score -= 15;
            
            if (domSize > 1500) score -= 20;
            if (images.largeImages > 0) score -= 25;
            if (resources.stylesheets > 3) score -= 10;
            if (resources.externalScripts > 5) score -= 15;
            
            result.score = Math.max(0, score);
            result.passed = result.score >= 70;
            
        } catch (error) {
            result.issues.push(`FR-7 test error: ${error.message}`);
        }
        
        return result;
    }

    calculateOverallScore(requirements) {
        let totalScore = 0;
        let totalWeight = 0;
        
        Object.entries(requirements).forEach(([key, result]) => {
            const weight = this.requirements[key]?.weight || 0;
            totalScore += result.score * weight;
            totalWeight += weight;
        });
        
        return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
    }

    generateRecommendations(requirements) {
        const recommendations = [];
        
        Object.values(requirements).forEach(req => {
            if (!req.passed && req.issues) {
                req.issues.forEach(issue => {
                    recommendations.push({
                        requirement: req.requirement,
                        priority: req.requirement === 'FR1' ? 'high' : 'medium',
                        issue: issue,
                        category: req.name
                    });
                });
            }
        });
        
        return recommendations.sort((a, b) => {
            if (a.priority === 'high' && b.priority !== 'high') return -1;
            if (b.priority === 'high' && a.priority !== 'high') return 1;
            return 0;
        });
    }

    async generateReport(results, format = 'json') {
        switch (format) {
            case 'html':
                return this.generateHTMLReport(results);
            case 'markdown':
                return this.generateMarkdownReport(results);
            case 'csv':
                return this.generateCSVReport(results);
            default:
                return JSON.stringify(results, null, 2);
        }
    }

    generateHTMLReport(results) {
        const isArray = Array.isArray(results);
        const pages = isArray ? results : [results];
        
        const getScoreColor = (score) => {
            if (score >= 90) return '#22c55e';
            if (score >= 70) return '#eab308';
            return '#ef4444';
        };
        
        const getStatusBadge = (passed) => {
            return passed 
                ? '<span style="background: #22c55e; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">PASS</span>'
                : '<span style="background: #ef4444; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">FAIL</span>';
        };

        let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BiModal Design Compliance Audit Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: white; padding: 24px; border-radius: 8px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .page-result { background: white; padding: 24px; border-radius: 8px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .score-circle { display: inline-flex; align-items: center; justify-content: center; width: 80px; height: 80px; border-radius: 50%; color: white; font-weight: bold; font-size: 18px; }
        .requirements-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin: 24px 0; }
        .requirement { border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; }
        .requirement-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .requirement-name { font-weight: 600; }
        .requirement-score { font-weight: bold; }
        .details { color: #64748b; font-size: 14px; margin: 8px 0; }
        .issues { color: #dc2626; font-size: 14px; }
        .recommendations { margin-top: 24px; }
        .recommendation { background: #fef3c7; padding: 12px; border-radius: 6px; margin-bottom: 8px; border-left: 4px solid #f59e0b; }
        .high-priority { background: #fee2e2; border-left-color: #dc2626; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>BiModal Design Compliance Audit Report</h1>
            <p>Generated on ${new Date().toISOString()}</p>
        </div>`;

        pages.forEach(result => {
            html += `
        <div class="page-result">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <div>
                    <h2 style="margin: 0;">${result.url}</h2>
                    <p style="color: #64748b; margin: 4px 0 0 0;">Tested on ${new Date(result.timestamp).toLocaleString()}</p>
                </div>
                <div style="text-align: center;">
                    <div class="score-circle" style="background-color: ${getScoreColor(result.overallScore)};">
                        ${result.overallScore}%
                    </div>
                    <div style="margin-top: 8px;">${getStatusBadge(result.passed)}</div>
                </div>
            </div>`;

            if (result.error) {
                html += `<div style="background: #fee2e2; color: #dc2626; padding: 16px; border-radius: 6px;">
                    <strong>Error:</strong> ${result.error}
                </div>`;
            } else {
                html += `<div class="requirements-grid">`;
                
                Object.entries(result.requirements).forEach(([key, req]) => {
                    html += `
                    <div class="requirement">
                        <div class="requirement-header">
                            <span class="requirement-name">${req.name}</span>
                            <div>
                                ${getStatusBadge(req.passed)}
                                <span class="requirement-score" style="color: ${getScoreColor(req.score)}; margin-left: 8px;">${req.score}%</span>
                            </div>
                        </div>`;
                    
                    if (req.details && req.details.length > 0) {
                        html += `<div class="details">
                            ${req.details.map(detail => `• ${detail}`).join('<br>')}
                        </div>`;
                    }
                    
                    if (req.issues && req.issues.length > 0) {
                        html += `<div class="issues">
                            <strong>Issues:</strong><br>
                            ${req.issues.map(issue => `• ${issue}`).join('<br>')}
                        </div>`;
                    }
                    
                    html += `</div>`;
                });
                
                html += `</div>`;
                
                if (result.recommendations && result.recommendations.length > 0) {
                    html += `
                    <div class="recommendations">
                        <h3>Recommendations</h3>`;
                    
                    result.recommendations.forEach(rec => {
                        html += `
                        <div class="recommendation ${rec.priority === 'high' ? 'high-priority' : ''}">
                            <strong>${rec.category}:</strong> ${rec.issue}
                        </div>`;
                    });
                    
                    html += `</div>`;
                }
            }
            
            html += `</div>`;
        });

        html += `
    </div>
</body>
</html>`;
        
        return html;
    }

    generateMarkdownReport(results) {
        const isArray = Array.isArray(results);
        const pages = isArray ? results : [results];
        
        let markdown = `# BiModal Design Compliance Audit Report\n\n`;
        markdown += `Generated on ${new Date().toISOString()}\n\n`;
        
        pages.forEach(result => {
            markdown += `## ${result.url}\n\n`;
            markdown += `**Overall Score:** ${result.overallScore}% ${result.passed ? '✅ PASS' : '❌ FAIL'}\n`;
            markdown += `**Tested:** ${new Date(result.timestamp).toLocaleString()}\n\n`;
            
            if (result.error) {
                markdown += `**Error:** ${result.error}\n\n`;
                return;
            }
            
            markdown += `### Requirements Assessment\n\n`;
            
            Object.entries(result.requirements).forEach(([key, req]) => {
                markdown += `#### ${req.name} (${key})\n`;
                markdown += `**Score:** ${req.score}% ${req.passed ? '✅' : '❌'}\n\n`;
                
                if (req.details && req.details.length > 0) {
                    markdown += `**Details:**\n`;
                    req.details.forEach(detail => markdown += `- ${detail}\n`);
                    markdown += `\n`;
                }
                
                if (req.issues && req.issues.length > 0) {
                    markdown += `**Issues:**\n`;
                    req.issues.forEach(issue => markdown += `- ⚠️ ${issue}\n`);
                    markdown += `\n`;
                }
            });
            
            if (result.recommendations && result.recommendations.length > 0) {
                markdown += `### Recommendations\n\n`;
                result.recommendations.forEach(rec => {
                    const priority = rec.priority === 'high' ? '🔴 High' : '🟡 Medium';
                    markdown += `**${priority} Priority - ${rec.category}:** ${rec.issue}\n\n`;
                });
            }
            
            markdown += `---\n\n`;
        });
        
        return markdown;
    }

    generateCSVReport(results) {
        const isArray = Array.isArray(results);
        const pages = isArray ? results : [results];
        
        let csv = 'URL,Overall Score,Passed,FR1 Score,FR2 Score,FR3 Score,FR4 Score,FR5 Score,FR6 Score,FR7 Score,Total Issues,Timestamp\n';
        
        pages.forEach(result => {
            if (result.error) {
                csv += `"${result.url}",0,false,0,0,0,0,0,0,0,1,"${result.timestamp}"\n`;
            } else {
                const totalIssues = Object.values(result.requirements)
                    .reduce((total, req) => total + (req.issues ? req.issues.length : 0), 0);
                
                csv += `"${result.url}",${result.overallScore},${result.passed}`;
                ['FR1', 'FR2', 'FR3', 'FR4', 'FR5', 'FR6', 'FR7'].forEach(key => {
                    csv += `,${result.requirements[key]?.score || 0}`;
                });
                csv += `,${totalIssues},"${result.timestamp}"\n`;
            }
        });
        
        return csv;
    }
}

// CLI Implementation
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        console.log(`
BiModal Design Compliance Audit Tool

Usage:
  bmd-audit <url> [options]
  bmd-audit --config <config.json>

Options:
  --output, -o      Output file path
  --format, -f      Output format (json, html, markdown, csv) [default: json]
  --timeout, -t     Timeout in milliseconds [default: 30000]
  --screenshots     Include screenshots in report
  --config, -c      Path to configuration file
  --batch, -b       Batch process multiple URLs from file
  --help, -h        Show this help message

Examples:
  bmd-audit https://example.com
  bmd-audit https://example.com --format html --output report.html
  bmd-audit --config audit-config.json
  bmd-audit --batch urls.txt --format csv --output results.csv

Configuration File Format:
{
  "urls": ["https://example.com", "https://test.com"],
  "options": {
    "timeout": 30000,
    "includeScreenshots": false
  }
}

Batch File Format:
https://example.com
https://test.com
https://another-site.com
        `);
        process.exit(0);
    }

    try {
        const auditor = new BiModalDesignComplianceAuditor();
        
        // Parse command line arguments
        const options = {
            url: null,
            output: null,
            format: 'json',
            timeout: 30000,
            screenshots: false,
            config: null,
            batch: null
        };
        
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            
            if (arg.startsWith('http')) {
                options.url = arg;
            } else if (arg === '--output' || arg === '-o') {
                options.output = args[++i];
            } else if (arg === '--format' || arg === '-f') {
                options.format = args[++i];
            } else if (arg === '--timeout' || arg === '-t') {
                options.timeout = parseInt(args[++i]);
            } else if (arg === '--screenshots') {
                options.screenshots = true;
            } else if (arg === '--config' || arg === '-c') {
                options.config = args[++i];
            } else if (arg === '--batch' || arg === '-b') {
                options.batch = args[++i];
            }
        }
        
        let results;
        
        if (options.config) {
            // Load configuration file
            const configData = JSON.parse(await fs.readFile(options.config, 'utf8'));
            const configuredAuditor = new BiModalDesignComplianceAuditor(configData.options || {});
            
            results = [];
            for (const url of configData.urls) {
                console.log(`Auditing: ${url}`);
                const result = await configuredAuditor.auditPage(url);
                results.push(result);
                console.log(`  Score: ${result.overallScore}% ${result.passed ? '✅' : '❌'}`);
            }
        } else if (options.batch) {
            // Batch process URLs from file
            const urlsData = await fs.readFile(options.batch, 'utf8');
            const urls = urlsData.split('\n').filter(url => url.trim() && url.startsWith('http'));
            
            results = [];
            for (const url of urls) {
                console.log(`Auditing: ${url}`);
                const result = await auditor.auditPage(url.trim());
                results.push(result);
                console.log(`  Score: ${result.overallScore}% ${result.passed ? '✅' : '❌'}`);
            }
        } else if (options.url) {
            // Single URL audit
            console.log(`Auditing: ${options.url}`);
            results = await auditor.auditPage(options.url);
            console.log(`Score: ${results.overallScore}% ${results.passed ? '✅' : '❌'}`);
        } else {
            console.error('Error: Please provide a URL, config file, or batch file');
            process.exit(1);
        }
        
        // Generate report
        const report = await auditor.generateReport(results, options.format);
        
        if (options.output) {
            await fs.writeFile(options.output, report);
            console.log(`Report saved to: ${options.output}`);
        } else {
            console.log(report);
        }
        
        // Exit with appropriate code for CI/CD
        const hasFailures = Array.isArray(results) 
            ? results.some(r => !r.passed)
            : !results.passed;
            
        process.exit(hasFailures ? 1 : 0);
        
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

// Export for use as module
module.exports = BiModalDesignComplianceAuditor;

// Run CLI if called directly
if (require.main === module) {
    main();
}
