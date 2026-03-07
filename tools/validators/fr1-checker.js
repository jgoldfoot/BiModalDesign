#!/usr/bin/env node

const https = require('https');
const http = require('http');
const { URL } = require('url');
const { JSDOM } = require('jsdom');

/**
 * FR-1 Checker - Test Initial Payload Accessibility
 * 
 * Tests whether a page provides meaningful content without JavaScript execution.
 * This is the foundational requirement (FR-1) for BiModal Design compliance.
 */

class FR1Checker {
  constructor(options = {}) {
    this.options = {
      timeout: options.timeout || 10000,
      userAgent: options.userAgent || 'BiModal Design-FR1-Checker/1.0 (+https://github.com/jgoldfoot/BiModalDesign)',
      verbose: options.verbose || false,
      ...options
    };
  }

  /**
   * Check FR-1 compliance for a single URL
   * @param {string} url - URL to check
   * @returns {Promise<Object>} Compliance result
   */
  async checkURL(url) {
    const startTime = Date.now();
    
    try {
      const html = await this.fetchHTML(url);
      const analysis = await this.analyzeHTML(html, url);
      
      return {
        url,
        timestamp: new Date().toISOString(),
        loadTime: Date.now() - startTime,
        ...analysis
      };
    } catch (error) {
      return {
        url,
        timestamp: new Date().toISOString(),
        loadTime: Date.now() - startTime,
        passed: false,
        score: 0,
        error: error.message,
        issues: [`Failed to load page: ${error.message}`]
      };
    }
  }

  /**
   * Fetch HTML content without executing JavaScript
   * @param {string} url - URL to fetch
   * @returns {Promise<string>} HTML content
   */
  async fetchHTML(url) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const client = urlObj.protocol === 'https:' ? https : http;
      
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        headers: {
          'User-Agent': this.options.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'close'
        },
        timeout: this.options.timeout
      };

      const req = client.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }

  /**
   * Analyze HTML content for FR-1 compliance
   * @param {string} html - HTML content
   * @param {string} url - Original URL
   * @returns {Object} Analysis result
   */
  async analyzeHTML(html, url) {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    const analysis = {
      passed: false,
      score: 0,
      issues: [],
      warnings: [],
      recommendations: [],
      details: {}
    };

    // Test 1: Basic HTML structure
    this.checkBasicStructure(document, analysis);
    
    // Test 2: Semantic content
    this.checkSemanticContent(document, analysis);
    
    // Test 3: Navigation accessibility
    this.checkNavigation(document, analysis);
    
    // Test 4: Form accessibility
    this.checkForms(document, analysis);
    
    // Test 5: Content meaningfulness
    this.checkContentMeaning(document, analysis);
    
    // Test 6: Agent-specific features
    this.checkAgentFeatures(document, analysis);
    
    // Calculate overall score
    this.calculateScore(analysis);
    
    // Determine pass/fail
    analysis.passed = analysis.score >= 0.7; // 70% threshold
    
    if (this.options.verbose) {
      console.log(`\nFR-1 Analysis for ${url}:`);
      console.log(`Score: ${(analysis.score * 100).toFixed(1)}%`);
      console.log(`Status: ${analysis.passed ? 'PASS' : 'FAIL'}`);
      
      if (analysis.issues.length > 0) {
        console.log('\nIssues:');
        analysis.issues.forEach(issue => console.log(`  ❌ ${issue}`));
      }
      
      if (analysis.warnings.length > 0) {
        console.log('\nWarnings:');
        analysis.warnings.forEach(warning => console.log(`  ⚠️ ${warning}`));
      }
    }
    
    return analysis;
  }

  /**
   * Check basic HTML structure
   */
  checkBasicStructure(document, analysis) {
    const details = analysis.details.structure = {};
    
    // Check for DOCTYPE
    details.hasDoctype = document.doctype !== null;
    if (!details.hasDoctype) {
      analysis.issues.push('Missing DOCTYPE declaration');
    }
    
    // Check for lang attribute
    details.hasLang = document.documentElement.hasAttribute('lang');
    if (!details.hasLang) {
      analysis.issues.push('Missing lang attribute on html element');
    }
    
    // Check for title
    const titleElement = document.querySelector('title');
    details.hasTitle = titleElement && titleElement.textContent.trim().length > 0;
    if (!details.hasTitle) {
      analysis.issues.push('Missing or empty page title');
    }
    
    // Check for meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    details.hasMetaDescription = metaDesc && metaDesc.getAttribute('content').trim().length > 0;
    if (!details.hasMetaDescription) {
      analysis.warnings.push('Missing meta description');
    }
    
    // Check for viewport meta
    const viewport = document.querySelector('meta[name="viewport"]');
    details.hasViewport = viewport !== null;
    if (!details.hasViewport) {
      analysis.warnings.push('Missing viewport meta tag');
    }
  }

  /**
   * Check semantic content structure
   */
  checkSemanticContent(document, analysis) {
    const details = analysis.details.semantic = {};
    
    // Check for semantic HTML5 elements
    const semanticElements = ['main', 'header', 'nav', 'article', 'section', 'aside', 'footer'];
    details.semanticElements = {};
    
    semanticElements.forEach(element => {
      const found = document.querySelectorAll(element);
      details.semanticElements[element] = found.length;
    });
    
    const semanticCount = Object.values(details.semanticElements).reduce((sum, count) => sum + count, 0);
    details.semanticScore = Math.min(1, semanticCount / 4); // Expect at least 4 semantic elements
    
    if (semanticCount < 2) {
      analysis.issues.push('Insufficient semantic HTML structure (found ' + semanticCount + ' elements)');
    } else if (semanticCount < 4) {
      analysis.warnings.push('Limited semantic HTML structure (found ' + semanticCount + ' elements)');
    }
    
    // Check heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    details.headingCount = headings.length;
    
    if (details.headingCount === 0) {
      analysis.issues.push('No headings found - content structure unclear');
    } else {
      // Check for h1
      const h1Count = document.querySelectorAll('h1').length;
      if (h1Count === 0) {
        analysis.issues.push('No h1 heading found');
      } else if (h1Count > 1) {
        analysis.warnings.push('Multiple h1 headings found (' + h1Count + ')');
      }
    }
  }

  /**
   * Check navigation accessibility
   */
  checkNavigation(document, analysis) {
    const details = analysis.details.navigation = {};
    
    // Check for nav elements
    const navElements = document.querySelectorAll('nav');
    details.navCount = navElements.length;
    
    if (details.navCount === 0) {
      analysis.issues.push('No navigation elements found');
      return;
    }
    
    // Check nav accessibility
    let accessibleNavs = 0;
    navElements.forEach(nav => {
      const hasRole = nav.hasAttribute('role');
      const hasAriaLabel = nav.hasAttribute('aria-label') || nav.hasAttribute('aria-labelledby');
      
      if (hasRole || hasAriaLabel) {
        accessibleNavs++;
      }
    });
    
    details.accessibleNavs = accessibleNavs;
    if (accessibleNavs === 0) {
      analysis.warnings.push('Navigation elements lack accessibility attributes');
    }
    
    // Check for navigation links
    const navLinks = document.querySelectorAll('nav a');
    details.navLinkCount = navLinks.length;
    
    if (details.navLinkCount === 0) {
      analysis.issues.push('No navigation links found');
    } else if (details.navLinkCount < 3) {
      analysis.warnings.push('Very few navigation links (' + details.navLinkCount + ')');
    }
  }

  /**
   * Check form accessibility
   */
  checkForms(document, analysis) {
    const details = analysis.details.forms = {};
    
    const forms = document.querySelectorAll('form');
    details.formCount = forms.length;
    
    if (details.formCount === 0) {
      // No forms is not necessarily a problem
      return;
    }
    
    let accessibleForms = 0;
    let totalFields = 0;
    let labeledFields = 0;
    
    forms.forEach(form => {
      const fieldsets = form.querySelectorAll('fieldset');
      const hasFieldsets = fieldsets.length > 0;
      
      const fields = form.querySelectorAll('input, select, textarea');
      totalFields += fields.length;
      
      fields.forEach(field => {
        const id = field.getAttribute('id');
        const hasLabel = id && document.querySelector(`label[for="${id}"]`);
        const hasAriaLabel = field.hasAttribute('aria-label') || field.hasAttribute('aria-labelledby');
        
        if (hasLabel || hasAriaLabel) {
          labeledFields++;
        }
      });
      
      if (hasFieldsets && fields.length > 0) {
        accessibleForms++;
      }
    });
    
    details.accessibleForms = accessibleForms;
    details.totalFields = totalFields;
    details.labeledFields = labeledFields;
    
    if (totalFields > 0) {
      const labelRatio = labeledFields / totalFields;
      if (labelRatio < 0.8) {
        analysis.issues.push(`Many form fields lack proper labels (${labeledFields}/${totalFields} labeled)`);
      } else if (labelRatio < 1.0) {
        analysis.warnings.push(`Some form fields lack labels (${labeledFields}/${totalFields} labeled)`);
      }
    }
    
    if (accessibleForms < details.formCount) {
      analysis.warnings.push('Some forms lack fieldsets or proper structure');
    }
  }

  /**
   * Check content meaningfulness
   */
  checkContentMeaning(document, analysis) {
    const details = analysis.details.content = {};
    
    // Extract meaningful text content
    const main = document.querySelector('main') || document.body;
    const textContent = main.textContent.trim();
    
    details.textLength = textContent.length;
    details.wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;
    
    // Check for minimum content
    if (details.textLength < 100) {
      analysis.issues.push('Very little text content found (' + details.textLength + ' characters)');
    } else if (details.textLength < 300) {
      analysis.warnings.push('Limited text content (' + details.textLength + ' characters)');
    }
    
    // Check for meaningful content indicators
    const meaningfulElements = document.querySelectorAll('p, li, td, article, section');
    details.meaningfulElements = meaningfulElements.length;
    
    if (details.meaningfulElements < 3) {
      analysis.warnings.push('Limited content structure elements');
    }
    
    // Check for images with alt text
    const images = document.querySelectorAll('img');
    const imagesWithAlt = document.querySelectorAll('img[alt]');
    details.imageCount = images.length;
    details.imagesWithAlt = imagesWithAlt.length;
    
    if (images.length > 0 && imagesWithAlt.length < images.length) {
      analysis.issues.push(`Images missing alt text (${imagesWithAlt.length}/${images.length} have alt)`);
    }
  }

  /**
   * Check agent-specific features
   */
  checkAgentFeatures(document, analysis) {
    const details = analysis.details.agent = {};
    
    // Check for agent attributes
    const agentComponents = document.querySelectorAll('[data-agent-component]');
    const agentActions = document.querySelectorAll('[data-agent-action]');
    const agentContent = document.querySelectorAll('[data-agent-content]');
    
    details.agentComponents = agentComponents.length;
    details.agentActions = agentActions.length;
    details.agentContent = agentContent.length;
    
    const hasAgentFeatures = agentComponents.length > 0 || agentActions.length > 0 || agentContent.length > 0;
    
    if (!hasAgentFeatures) {
      analysis.recommendations.push('Consider adding BiModal Design attributes for better agent understanding');
    }
    
    // Check for structured data
    const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
    const microdata = document.querySelectorAll('[itemscope]');
    
    details.structuredDataScripts = structuredData.length;
    details.microdataElements = microdata.length;
    
    if (structuredData.length === 0 && microdata.length === 0) {
      analysis.recommendations.push('Add structured data (JSON-LD or microdata) for better agent understanding');
    }
    
    // Check for ARIA landmarks
    const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
    details.landmarks = landmarks.length;
    
    if (details.landmarks === 0) {
      analysis.warnings.push('No ARIA landmarks found - consider adding for better accessibility');
    }
  }

  /**
   * Calculate overall compliance score
   */
  calculateScore(analysis) {
    const weights = {
      structure: 0.2,
      semantic: 0.25,
      navigation: 0.2,
      forms: 0.1,
      content: 0.25
    };
    
    let score = 0;
    const details = analysis.details;
    
    // Structure score (0-1)
    let structureScore = 0;
    if (details.structure.hasDoctype) structureScore += 0.2;
    if (details.structure.hasLang) structureScore += 0.2;
    if (details.structure.hasTitle) structureScore += 0.3;
    if (details.structure.hasMetaDescription) structureScore += 0.15;
    if (details.structure.hasViewport) structureScore += 0.15;
    
    // Semantic score (already calculated)
    const semanticScore = details.semantic.semanticScore || 0;
    
    // Navigation score (0-1)
    let navigationScore = 0;
    if (details.navigation.navCount > 0) {
      navigationScore += 0.4;
      if (details.navigation.accessibleNavs > 0) navigationScore += 0.3;
      if (details.navigation.navLinkCount >= 3) navigationScore += 0.3;
    }
    
    // Forms score (0-1, or 1 if no forms)
    let formsScore = 1; // Default to 1 if no forms
    if (details.forms.formCount > 0) {
      formsScore = 0;
      if (details.forms.totalFields > 0) {
        formsScore = details.forms.labeledFields / details.forms.totalFields;
      }
    }
    
    // Content score (0-1)
    let contentScore = 0;
    if (details.content.textLength >= 100) contentScore += 0.4;
    if (details.content.textLength >= 300) contentScore += 0.2;
    if (details.content.meaningfulElements >= 3) contentScore += 0.2;
    if (details.content.imageCount === 0 || details.content.imagesWithAlt === details.content.imageCount) {
      contentScore += 0.2;
    }
    
    // Calculate weighted score
    score = (
      structureScore * weights.structure +
      semanticScore * weights.semantic +
      navigationScore * weights.navigation +
      formsScore * weights.forms +
      contentScore * weights.content
    );
    
    analysis.score = Math.min(1, Math.max(0, score));
    
    // Store component scores for detailed reporting
    analysis.componentScores = {
      structure: structureScore,
      semantic: semanticScore,
      navigation: navigationScore,
      forms: formsScore,
      content: contentScore
    };
  }

  /**
   * Check multiple URLs
   * @param {string[]} urls - Array of URLs to check
   * @returns {Promise<Object[]>} Array of compliance results
   */
  async checkMultiple(urls) {
    const results = [];
    
    for (const url of urls) {
      if (this.options.verbose) {
        console.log(`\nChecking: ${url}`);
      }
      
      const result = await this.checkURL(url);
      results.push(result);
      
      // Brief output for multiple URLs
      if (!this.options.verbose) {
        const status = result.passed ? '✅ PASS' : '❌ FAIL';
        const score = ((result.score || 0) * 100).toFixed(1);
        console.log(`${status} (${score}%) ${url}`);
      }
    }
    
    return results;
  }

  /**
   * Generate summary report
   * @param {Object[]} results - Array of compliance results
   * @returns {Object} Summary report
   */
  generateSummary(results) {
    const summary = {
      total: results.length,
      passed: results.filter(r => r.passed).length,
      failed: results.filter(r => !r.passed).length,
      averageScore: results.reduce((sum, r) => sum + (r.score || 0), 0) / results.length,
      totalIssues: results.reduce((sum, r) => sum + (r.issues?.length || 0), 0),
      totalWarnings: results.reduce((sum, r) => sum + (r.warnings?.length || 0), 0),
      commonIssues: this.findCommonIssues(results),
      recommendations: this.generateRecommendations(results)
    };
    
    return summary;
  }

  /**
   * Find common issues across results
   */
  findCommonIssues(results) {
    const issueCount = {};
    
    results.forEach(result => {
      if (result.issues) {
        result.issues.forEach(issue => {
          issueCount[issue] = (issueCount[issue] || 0) + 1;
        });
      }
    });
    
    return Object.entries(issueCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([issue, count]) => ({ issue, count, percentage: (count / results.length * 100).toFixed(1) }));
  }

  /**
   * Generate recommendations based on results
   */
  generateRecommendations(results) {
    const recommendations = [];
    const summary = this.generateSummary(results);
    
    if (summary.averageScore < 0.7) {
      recommendations.push({
        priority: 'high',
        title: 'Improve overall FR-1 compliance',
        description: `Average score is ${(summary.averageScore * 100).toFixed(1)}%. Focus on addressing common issues.`
      });
    }
    
    if (summary.commonIssues.length > 0) {
      const topIssue = summary.commonIssues[0];
      recommendations.push({
        priority: 'high',
        title: 'Address most common issue',
        description: `"${topIssue.issue}" affects ${topIssue.percentage}% of pages`
      });
    }
    
    if (summary.failed > 0) {
      recommendations.push({
        priority: 'medium',
        title: 'Fix failing pages',
        description: `${summary.failed} out of ${summary.total} pages are failing FR-1 compliance`
      });
    }
    
    return recommendations;
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
BiModal Design FR-1 Checker - Test Initial Payload Accessibility

Usage:
  fr1-checker <url> [options]
  fr1-checker <url1> <url2> ... [options]

Options:
  --verbose, -v          Detailed output
  --user-agent <ua>      Custom user agent string
  --timeout <ms>         Request timeout in milliseconds (default: 10000)
  --format <fmt>         Output format: text (default), json
  --output <file>        Save output to file
  --sitemap <url>        Check all URLs in sitemap
  --help, -h             Show this help

Examples:
  fr1-checker https://example.com
  fr1-checker --verbose https://example.com/page1 https://example.com/page2
  fr1-checker --format json --output report.json https://example.com
  fr1-checker --sitemap https://example.com/sitemap.xml
`);
    process.exit(0);
  }
  
  // Parse arguments
  const options = {};
  const urls = [];
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--verbose' || arg === '-v') {
      options.verbose = true;
    } else if (arg === '--user-agent') {
      options.userAgent = args[++i];
    } else if (arg === '--timeout') {
      options.timeout = parseInt(args[++i]);
    } else if (arg === '--format') {
      options.format = args[++i];
    } else if (arg === '--output') {
      options.output = args[++i];
    } else if (arg === '--sitemap') {
      options.sitemap = args[++i];
    } else if (!arg.startsWith('--')) {
      urls.push(arg);
    }
  }
  
  // Main execution
  async function main() {
    const checker = new FR1Checker(options);
    let results;
    
    try {
      if (options.sitemap) {
        // TODO: Implement sitemap parsing
        console.error('Sitemap checking not yet implemented');
        process.exit(1);
      } else {
        results = await checker.checkMultiple(urls);
      }
      
      // Generate summary
      const summary = checker.generateSummary(results);
      
      // Output results
      if (options.format === 'json') {
        const output = {
          summary,
          results,
          timestamp: new Date().toISOString(),
          options: options
        };
        
        const jsonOutput = JSON.stringify(output, null, 2);
        
        if (options.output) {
          require('fs').writeFileSync(options.output, jsonOutput);
          console.log(`Report saved to ${options.output}`);
        } else {
          console.log(jsonOutput);
        }
      } else {
        // Text output
        console.log('\n' + '='.repeat(50));
        console.log('FR-1 COMPLIANCE SUMMARY');
        console.log('='.repeat(50));
        console.log(`Total URLs: ${summary.total}`);
        console.log(`Passed: ${summary.passed} (${(summary.passed/summary.total*100).toFixed(1)}%)`);
        console.log(`Failed: ${summary.failed} (${(summary.failed/summary.total*100).toFixed(1)}%)`);
        console.log(`Average Score: ${(summary.averageScore*100).toFixed(1)}%`);
        console.log(`Total Issues: ${summary.totalIssues}`);
        console.log(`Total Warnings: ${summary.totalWarnings}`);
        
        if (summary.commonIssues.length > 0) {
          console.log('\nMost Common Issues:');
          summary.commonIssues.forEach((issue, i) => {
            console.log(`${i+1}. ${issue.issue} (${issue.percentage}% of pages)`);
          });
        }
        
        if (summary.recommendations.length > 0) {
          console.log('\nRecommendations:');
          summary.recommendations.forEach((rec, i) => {
            console.log(`${i+1}. [${rec.priority.toUpperCase()}] ${rec.title}`);
            console.log(`   ${rec.description}`);
          });
        }
      }
      
      // Exit with appropriate code
      process.exit(summary.failed > 0 ? 1 : 0);
      
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  }
  
  main();
}

module.exports = { FR1Checker, checkFR1Compliance: (url, options) => new FR1Checker(options).checkURL(url) };
