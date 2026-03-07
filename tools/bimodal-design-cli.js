#!/usr/bin/env node

/**
 * BiModal Design Unified CLI Tool
 * Central command-line interface for all BiModal Design tools and utilities
 *
 * Usage:
 *   bimodal-design <command> [options]
 *   bimodal-design audit https://example.com
 *   bimodal-design simulate --multi-agent https://example.com
 *   bimodal-design init --framework react
 */

const { spawn: _spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { URL: _URL } = require('url');

// Import our tools
const FR1Checker = require('./validators/fr1-checker');
const ComplianceAuditor = require('../accessibility/compliance-audit');
const AgentSimulator = require('./agent-simulator');

class BiModalDesignCLI {
  constructor() {
    this.version = '1.0.0';
    this.commands = {
      audit: {
        description: 'Run comprehensive BiModal Design compliance audit',
        examples: [
          'bimodal-design audit https://example.com',
          'bimodal-design audit --batch urls.txt --format html',
        ],
      },
      check: {
        description: 'Quick FR-1 accessibility check',
        examples: [
          'bimodal-design check https://example.com',
          'bimodal-design check --output report.json',
        ],
      },
      simulate: {
        description: 'Simulate agent interactions',
        examples: [
          'bimodal-design simulate https://example.com',
          'bimodal-design simulate --multi-agent --tasks extract-content,find-contact',
        ],
      },
      init: {
        description: 'Initialize BiModal Design in a project',
        examples: [
          'bimodal-design init',
          'bimodal-design init --framework react --template ecommerce',
        ],
      },
      validate: {
        description: 'Validate BiModal Design implementation',
        examples: [
          'bimodal-design validate',
          'bimodal-design validate --config bimodal-design.config.js',
        ],
      },
      score: {
        description: 'Generate BiModal Design compliance score',
        examples: [
          'bimodal-design score https://example.com',
          'bimodal-design score --detailed --benchmark',
        ],
      },
      doctor: {
        description: 'Diagnose common BiModal Design issues',
        examples: [
          'bimodal-design doctor https://example.com',
          'bimodal-design doctor --fix-suggestions',
        ],
      },
    };

    this.frameworks = {
      react: {
        name: 'React',
        templates: ['basic', 'ecommerce', 'documentation', 'portfolio'],
        dependencies: ['@bimodal-design/react-components', '@bimodal-design/hooks'],
      },
      vue: {
        name: 'Vue.js',
        templates: ['basic', 'ecommerce', 'documentation'],
        dependencies: ['@bimodal-design/vue-components'],
      },
      angular: {
        name: 'Angular',
        templates: ['basic', 'ecommerce'],
        dependencies: ['@bimodal-design/angular-components'],
      },
      vanilla: {
        name: 'Vanilla HTML/JS',
        templates: ['basic', 'ecommerce', 'documentation', 'portfolio'],
        dependencies: ['@bimodal-design/core'],
      },
    };
  }

  async run() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
      this.showHelp();
      return;
    }

    if (args.includes('--version') || args.includes('-v')) {
      console.log(`BiModal Design CLI v${this.version}`);
      return;
    }

    const command = args[0];
    const commandArgs = args.slice(1);

    try {
      switch (command) {
        case 'audit':
          await this.runAudit(commandArgs);
          break;
        case 'check':
          await this.runCheck(commandArgs);
          break;
        case 'simulate':
          await this.runSimulate(commandArgs);
          break;
        case 'init':
          await this.runInit(commandArgs);
          break;
        case 'validate':
          await this.runValidate(commandArgs);
          break;
        case 'score':
          await this.runScore(commandArgs);
          break;
        case 'doctor':
          await this.runDoctor(commandArgs);
          break;
        default:
          console.error(`Unknown command: ${command}`);
          console.log('Run "bimodal-design --help" for available commands');
          process.exit(1);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  }

  showHelp() {
    console.log(`
╭─────────────────────────────────────────────────────────────╮
│                       BiModal Design CLI v${this.version}                      │
│              AI-First Web Development Toolkit              │
╰─────────────────────────────────────────────────────────────╯

USAGE
  bimodal-design <command> [options]

COMMANDS
  audit       Run comprehensive BiModal Design compliance audit
  check       Quick FR-1 (Initial Payload) accessibility check  
  simulate    Simulate different AI agent interactions
  init        Initialize BiModal Design in a new or existing project
  validate    Validate current BiModal Design implementation
  score       Generate detailed compliance score and benchmarks
  doctor      Diagnose and suggest fixes for BiModal Design issues

GLOBAL OPTIONS
  --help, -h     Show help for command
  --version, -v  Show CLI version
  --verbose      Enable verbose logging
  --quiet        Suppress non-essential output

EXAMPLES
  bimodal-design audit https://example.com --format html --output report.html
  bimodal-design simulate --multi-agent https://example.com
  bimodal-design init --framework react --template ecommerce
  bimodal-design score https://example.com --benchmark --detailed

Get started:
  bimodal-design init                    # Initialize BiModal Design in current directory
  bimodal-design doctor https://ai-plus.design  # Test with reference implementation

For detailed help on a specific command:
  bimodal-design <command> --help

Documentation: https://bimodal-design.design/docs
Repository: https://github.com/jgoldfoot/BiModalDesign
        `);
  }

  async runAudit(args) {
    console.log('🔍 Running BiModal Design Compliance Audit...\n');

    const auditor = new ComplianceAuditor();
    const options = this.parseAuditOptions(args);

    let results;
    if (options.batch) {
      // Batch audit from file
      const urls = await this.loadUrlsFromFile(options.batch);
      results = [];

      for (const url of urls) {
        console.log(`Auditing: ${url}`);
        const result = await auditor.auditPage(url);
        results.push(result);
        console.log(`  Score: ${result.overallScore}% ${result.passed ? '✅' : '❌'}`);
      }
    } else if (options.url) {
      // Single URL audit
      console.log(`Auditing: ${options.url}`);
      results = await auditor.auditPage(options.url);
      console.log(`Score: ${results.overallScore}% ${results.passed ? '✅' : '❌'}`);
    } else {
      throw new Error('Please provide a URL or batch file');
    }

    await this.outputResults(results, options);
  }

  async runCheck(args) {
    console.log('⚡ Running FR-1 Quick Check...\n');

    const checker = new FR1Checker();
    const options = this.parseCheckOptions(args);

    if (!options.url) {
      throw new Error('Please provide a URL to check');
    }

    console.log(`Checking: ${options.url}`);
    const result = await checker.checkFR1(options.url);

    console.log(`\nFR-1 Compliance: ${result.passed ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Score: ${result.score}%\n`);

    if (result.issues.length > 0) {
      console.log('Issues found:');
      result.issues.forEach((issue) => console.log(`  • ${issue}`));
    }

    await this.outputResults(result, options);
  }

  async runSimulate(args) {
    console.log('🤖 Running Agent Simulation...\n');

    const simulator = new AgentSimulator();
    const options = this.parseSimulateOptions(args);

    if (!options.url) {
      throw new Error('Please provide a URL to simulate');
    }

    let results;
    if (options.multiAgent) {
      console.log(`Running multi-agent test for: ${options.url}`);
      results = await simulator.runMultiAgentTest(options.url, {
        tasks: options.tasks,
        agents: options.agents,
      });

      // Show quick summary
      if (results.comparison) {
        console.log('\n📊 Quick Summary:');
        Object.entries(results.comparison.accessibilityScores).forEach(([agent, score]) => {
          console.log(`  ${agent}: ${score}%`);
        });
      }
    } else {
      console.log(`Running ${options.agentType} agent test for: ${options.url}`);
      results = await simulator.simulateAgent(options.url, options.agentType, options.tasks);
      console.log(`Accessibility Score: ${results.accessibility.score}%`);
    }

    await this.outputResults(results, options);
  }

  async runInit(args) {
    console.log('🚀 Initializing BiModal Design Project...\n');

    const options = this.parseInitOptions(args);

    // Interactive setup if no options provided
    if (!options.framework) {
      options.framework = await this.promptFramework();
    }

    if (!options.template) {
      options.template = await this.promptTemplate(options.framework);
    }

    await this.initializeProject(options);
  }

  async runValidate(args) {
    console.log('✅ Validating BiModal Design Implementation...\n');

    const options = this.parseValidateOptions(args);

    // Look for BiModal Design config
    const configPath = options.config || (await this.findConfig());

    if (!configPath) {
      console.log('No BiModal Design configuration found. Run "bimodal-design init" first.');
      return;
    }

    const config = await this.loadConfig(configPath);
    const results = await this.validateImplementation(config);

    console.log(`\nValidation Result: ${results.passed ? '✅ VALID' : '❌ INVALID'}`);
    console.log(`Score: ${results.score}%\n`);

    if (results.issues.length > 0) {
      console.log('Issues found:');
      results.issues.forEach((issue) => console.log(`  • ${issue}`));
    }

    await this.outputResults(results, options);
  }

  async runScore(args) {
    console.log('📊 Generating BiModal Design Compliance Score...\n');

    const options = this.parseScoreOptions(args);

    if (!options.url) {
      throw new Error('Please provide a URL to score');
    }

    // Run comprehensive scoring
    const auditor = new ComplianceAuditor();
    const simulator = new AgentSimulator();

    console.log('Running compliance audit...');
    const auditResult = await auditor.auditPage(options.url);

    console.log('Running agent simulation...');
    const simResult = await simulator.runMultiAgentTest(options.url);

    const score = this.calculateComprehensiveScore(auditResult, simResult);

    console.log(`\n🎯 Overall BiModal Design Score: ${score.overall}%`);
    console.log(`   Compliance: ${score.compliance}%`);
    console.log(`   Agent Usability: ${score.usability}%`);
    console.log(`   Performance: ${score.performance}%\n`);

    if (options.benchmark) {
      await this.showBenchmarkComparison(score);
    }

    const results = { score, audit: auditResult, simulation: simResult };
    await this.outputResults(results, options);
  }

  async runDoctor(args) {
    console.log('🩺 Running BiModal Design Health Check...\n');

    const options = this.parseDoctorOptions(args);

    if (!options.url) {
      throw new Error('Please provide a URL to diagnose');
    }

    console.log(`Diagnosing: ${options.url}`);

    // Run quick diagnostics
    const issues = await this.runDiagnostics(options.url);

    console.log(`\n📋 Diagnosis Complete`);
    console.log(`Found ${issues.length} issue(s)\n`);

    if (issues.length === 0) {
      console.log('✅ No issues detected! Your site looks BiModal Design compliant.');
    } else {
      issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.type}: ${issue.description}`);
        if (options.fixSuggestions && issue.fix) {
          console.log(`   💡 Fix: ${issue.fix}\n`);
        }
      });
    }

    await this.outputResults({ issues }, options);
  }

  // Parsing methods for command options
  parseAuditOptions(args) {
    const options = { format: 'json' };

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      if (arg.startsWith('http')) {
        options.url = arg;
      } else if (arg === '--batch' || arg === '-b') {
        options.batch = args[++i];
      } else if (arg === '--format' || arg === '-f') {
        options.format = args[++i];
      } else if (arg === '--output' || arg === '-o') {
        options.output = args[++i];
      } else if (arg === '--timeout') {
        options.timeout = parseInt(args[++i]);
      }
    }

    return options;
  }

  parseCheckOptions(args) {
    const options = { format: 'console' };

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      if (arg.startsWith('http')) {
        options.url = arg;
      } else if (arg === '--output' || arg === '-o') {
        options.output = args[++i];
      } else if (arg === '--format' || arg === '-f') {
        options.format = args[++i];
      }
    }

    return options;
  }

  parseSimulateOptions(args) {
    const options = {
      agentType: 'basic',
      tasks: ['extract-content'],
      multiAgent: false,
      agents: ['basic', 'intermediate', 'advanced'],
      format: 'console',
    };

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      if (arg.startsWith('http')) {
        options.url = arg;
      } else if (arg === '--agent-type' || arg === '-a') {
        options.agentType = args[++i];
      } else if (arg === '--tasks' || arg === '-t') {
        options.tasks = args[++i].split(',');
      } else if (arg === '--multi-agent' || arg === '-m') {
        options.multiAgent = true;
      } else if (arg === '--agents') {
        options.agents = args[++i].split(',');
      } else if (arg === '--output' || arg === '-o') {
        options.output = args[++i];
      } else if (arg === '--format' || arg === '-f') {
        options.format = args[++i];
      }
    }

    return options;
  }

  parseInitOptions(args) {
    const options = {};

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      if (arg === '--framework' || arg === '-f') {
        options.framework = args[++i];
      } else if (arg === '--template' || arg === '-t') {
        options.template = args[++i];
      } else if (arg === '--name' || arg === '-n') {
        options.name = args[++i];
      } else if (arg === '--directory' || arg === '-d') {
        options.directory = args[++i];
      }
    }

    return options;
  }

  parseValidateOptions(args) {
    const options = { format: 'console' };

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      if (arg === '--config' || arg === '-c') {
        options.config = args[++i];
      } else if (arg === '--output' || arg === '-o') {
        options.output = args[++i];
      } else if (arg === '--format' || arg === '-f') {
        options.format = args[++i];
      }
    }

    return options;
  }

  parseScoreOptions(args) {
    const options = { format: 'console', benchmark: false, detailed: false };

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      if (arg.startsWith('http')) {
        options.url = arg;
      } else if (arg === '--benchmark' || arg === '-b') {
        options.benchmark = true;
      } else if (arg === '--detailed' || arg === '-d') {
        options.detailed = true;
      } else if (arg === '--output' || arg === '-o') {
        options.output = args[++i];
      } else if (arg === '--format' || arg === '-f') {
        options.format = args[++i];
      }
    }

    return options;
  }

  parseDoctorOptions(args) {
    const options = { format: 'console', fixSuggestions: false };

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      if (arg.startsWith('http')) {
        options.url = arg;
      } else if (arg === '--fix-suggestions' || arg === '--fix') {
        options.fixSuggestions = true;
      } else if (arg === '--output' || arg === '-o') {
        options.output = args[++i];
      } else if (arg === '--format' || arg === '-f') {
        options.format = args[++i];
      }
    }

    return options;
  }

  // Utility methods
  async loadUrlsFromFile(filePath) {
    const content = await fs.readFile(filePath, 'utf8');
    return content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && line.startsWith('http'));
  }

  async outputResults(results, options) {
    let output;

    if (options.format === 'console') {
      return; // Already displayed to console
    } else if (options.format === 'json') {
      output = JSON.stringify(results, null, 2);
    } else if (options.format === 'markdown') {
      output = this.generateMarkdownOutput(results);
    } else if (options.format === 'html') {
      output = this.generateHTMLOutput(results);
    } else {
      throw new Error(`Unsupported format: ${options.format}`);
    }

    if (options.output) {
      await fs.writeFile(options.output, output);
      console.log(`Results saved to: ${options.output}`);
    } else {
      console.log(output);
    }
  }

  generateMarkdownOutput(results) {
    return `# BiModal Design Results\n\n${JSON.stringify(results, null, 2)}`;
  }

  generateHTMLOutput(results) {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>BiModal Design Results</title>
    <style>
        body { font-family: system-ui, sans-serif; margin: 40px; }
        pre { background: #f5f5f5; padding: 20px; border-radius: 8px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>BiModal Design Results</h1>
    <pre>${JSON.stringify(results, null, 2)}</pre>
</body>
</html>`;
  }

  promptFramework() {
    // In a real implementation, this would use a proper CLI prompt library
    console.log('Available frameworks:');
    Object.entries(this.frameworks).forEach(([key, framework]) => {
      console.log(`  ${key}: ${framework.name}`);
    });

    // For now, return default
    return 'react';
  }

  promptTemplate(framework) {
    const fw = this.frameworks[framework];
    console.log(`Available ${fw.name} templates:`);
    fw.templates.forEach((template) => {
      console.log(`  ${template}`);
    });

    // For now, return default
    return 'basic';
  }

  async initializeProject(options) {
    const { framework, template, name = 'bimodal-design-project', directory = '.' } = options;

    console.log(`Creating ${framework} project with ${template} template...`);

    // Create basic project structure
    const projectPath = path.join(directory, name);

    try {
      await fs.mkdir(projectPath, { recursive: true });

      // Create BiModal Design config
      const config = {
        framework,
        template,
        version: this.version,
        requirements: {
          FR1: { enabled: true, weight: 30 },
          FR2: { enabled: true, weight: 20 },
          FR3: { enabled: true, weight: 15 },
          FR4: { enabled: true, weight: 10 },
          FR5: { enabled: true, weight: 10 },
          FR6: { enabled: true, weight: 10 },
          FR7: { enabled: true, weight: 5 },
        },
      };

      await fs.writeFile(
        path.join(projectPath, 'bimodal-design.config.json'),
        JSON.stringify(config, null, 2)
      );

      // Create basic README
      const readme = `# ${name}

BiModal Design-compliant ${framework} project created with ${template} template.

## Getting Started

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Run BiModal Design validation:
   \`\`\`
   bimodal-design validate
   \`\`\`

3. Test with agent simulation:
   \`\`\`
   bimodal-design simulate http://localhost:3000
   \`\`\`

## BiModal Design Commands

- \`bimodal-design validate\` - Validate implementation
- \`bimodal-design audit <url>\` - Run compliance audit
- \`bimodal-design simulate <url>\` - Test agent interactions
- \`bimodal-design doctor <url>\` - Diagnose issues

Documentation: https://bimodal-design.design/docs
`;

      await fs.writeFile(path.join(projectPath, 'README.md'), readme);

      console.log(`\n✅ Project created successfully!`);
      console.log(`📁 Location: ${projectPath}`);
      console.log(`\nNext steps:`);
      console.log(`  cd ${name}`);
      console.log(`  npm install`);
      console.log(`  bimodal-design validate`);
    } catch (error) {
      throw new Error(`Failed to create project: ${error.message}`);
    }
  }

  async findConfig() {
    const configFiles = [
      'bimodal-design.config.json',
      'bimodal-design.config.js',
      '.bimodal-designrc',
      'package.json',
    ];

    for (const configFile of configFiles) {
      try {
        await fs.access(configFile);
        return configFile;
      } catch (error) {
        // File doesn't exist, continue
      }
    }

    return null;
  }

  async loadConfig(configPath) {
    if (configPath.endsWith('.json')) {
      const content = await fs.readFile(configPath, 'utf8');
      return JSON.parse(content);
    } else if (configPath === 'package.json') {
      const content = await fs.readFile(configPath, 'utf8');
      const pkg = JSON.parse(content);
      return pkg['bimodal-design'] || {};
    }

    // Default config
    return {
      framework: 'vanilla',
      template: 'basic',
      version: this.version,
    };
  }

  async validateImplementation(config) {
    // Basic validation logic
    const issues = [];

    if (!config.framework) {
      issues.push('No framework specified in configuration');
    }

    if (!config.requirements) {
      issues.push('No BiModal Design requirements configuration found');
    }

    // Check for required files based on framework
    const requiredFiles = this.getRequiredFiles(config.framework);
    for (const file of requiredFiles) {
      try {
        await fs.access(file);
      } catch (error) {
        issues.push(`Missing required file: ${file}`);
      }
    }

    return {
      passed: issues.length === 0,
      score: Math.max(0, 100 - issues.length * 20),
      issues,
    };
  }

  getRequiredFiles(framework) {
    const files = {
      react: ['src/index.js', 'public/index.html'],
      vue: ['src/main.js', 'public/index.html'],
      angular: ['src/main.ts', 'src/index.html'],
      vanilla: ['index.html'],
    };

    return files[framework] || files.vanilla;
  }

  calculateComprehensiveScore(auditResult, simResult) {
    const complianceScore = auditResult.overallScore || 0;

    // Calculate usability score from simulation
    let usabilityScore = 0;
    if (simResult.comparison && simResult.comparison.accessibilityScores) {
      const scores = Object.values(simResult.comparison.accessibilityScores);
      usabilityScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    }

    // Calculate performance score
    const performanceScore = auditResult.requirements?.FR7?.score || 0;

    // Weighted overall score
    const overall = Math.round(
      complianceScore * 0.5 + usabilityScore * 0.3 + performanceScore * 0.2
    );

    return {
      overall,
      compliance: complianceScore,
      usability: usabilityScore,
      performance: performanceScore,
    };
  }

  showBenchmarkComparison(score) {
    console.log('📊 Benchmark Comparison:');
    console.log(`   Industry Average: 65%`);
    console.log(`   Top 10%: 85%+`);
    console.log(`   BiModal Design Gold: 90%+`);

    if (score.overall >= 90) {
      console.log(`   🏆 Your Score: GOLD (${score.overall}%)`);
    } else if (score.overall >= 85) {
      console.log(`   🥈 Your Score: TOP 10% (${score.overall}%)`);
    } else if (score.overall >= 65) {
      console.log(`   📊 Your Score: ABOVE AVERAGE (${score.overall}%)`);
    } else {
      console.log(`   📈 Your Score: NEEDS IMPROVEMENT (${score.overall}%)`);
    }
  }

  async runDiagnostics(url) {
    const issues = [];

    // Quick checks that would be implemented
    // This is a simplified version
    try {
      const checker = new FR1Checker();
      const result = await checker.checkFR1(url);

      if (!result.passed) {
        issues.push({
          type: 'FR-1 Failure',
          description: 'Initial payload accessibility check failed',
          fix: 'Ensure content is available without JavaScript execution',
        });
      }

      // Add more diagnostic checks here
    } catch (error) {
      issues.push({
        type: 'Connection Error',
        description: `Could not connect to ${url}`,
        fix: 'Check that the URL is accessible and responds to HTTP requests',
      });
    }

    return issues;
  }
}

// Main execution
async function main() {
  const cli = new BiModalDesignCLI();
  await cli.run();
}

// Export for testing
module.exports = BiModalDesignCLI;

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error.message);
    process.exit(1);
  });
}
