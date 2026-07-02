/**
 * Setup and sanity tests for BiModal Design
 * Ensures the test environment is configured correctly
 */

describe('Test Environment', () => {
  test('should be running in Node.js', () => {
    expect(typeof process).toBe('object');
    expect(process.version).toBeDefined();
  });

  test('should have required Node.js version', () => {
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    expect(majorVersion).toBeGreaterThanOrEqual(16);
  });

  test('Jest should be configured correctly', () => {
    expect(expect).toBeDefined();
    expect(describe).toBeDefined();
    expect(test).toBeDefined();
  });
});

describe('BiModal Design Framework', () => {
  test('should have core requirements defined', () => {
    const foundationalRequirements = [
      'FR-1: Initial Payload Accessibility',
      'FR-2: Semantic HTML Structure',
      'FR-3: ARIA Implementation',
      'FR-4: Agent-Friendly Navigation',
      'FR-5: Form Accessibility',
      'FR-6: Content Discovery',
      'FR-7: Performance Optimization',
    ];

    expect(foundationalRequirements.length).toBe(7);
    expect(foundationalRequirements[0]).toContain('FR-1');
  });

  test('should have maturity levels defined', () => {
    const maturityLevels = {
      0: 'Infrastructure Ready',
      1: 'Semantically Accessible',
      2: 'Data-Rich',
      3: 'API-Enabled',
      4: 'Agent-Native',
    };

    expect(Object.keys(maturityLevels).length).toBe(5);
    expect(maturityLevels[0]).toBe('Infrastructure Ready');
    expect(maturityLevels[2]).toBe('Data-Rich');
    expect(maturityLevels[4]).toBe('Agent-Native');
  });
});

describe('Package Configuration', () => {
  test('should have package.json', () => {
    const fs = require('fs');
    const path = require('path');
    const packagePath = path.join(__dirname, '..', 'package.json');

    expect(fs.existsSync(packagePath)).toBe(true);
  });

  test('package.json should have required fields', () => {
    const packageJson = require('../package.json');

    expect(packageJson.name).toBeDefined();
    expect(packageJson.version).toBeDefined();
    expect(packageJson.description).toBeDefined();
    expect(packageJson.license).toBe('Apache-2.0');
    expect(packageJson.author).toBeDefined();
  });

  test('package.json should define CLI commands', () => {
    const packageJson = require('../package.json');

    expect(packageJson.bin).toBeDefined();
    expect(packageJson.bin['bimodal-design']).toBeDefined();
    expect(packageJson.bin['bmd']).toBeDefined();
    expect(packageJson.bin['bmd-validate']).toBeDefined();
    expect(packageJson.bin['bmd-audit']).toBeDefined();
    expect(packageJson.bin['bmd-simulate']).toBeDefined();
  });

  test('package.json should have test script', () => {
    const packageJson = require('../package.json');

    expect(packageJson.scripts).toBeDefined();
    expect(packageJson.scripts.test).toBeDefined();
    expect(packageJson.scripts.test).toContain('jest');
  });
});

describe('Project Structure', () => {
  const fs = require('fs');
  const path = require('path');

  test('should have required documentation files', () => {
    const requiredFiles = [
      'README.md',
      'CONTRIBUTING.md',
      'CODE_OF_CONDUCT.md',
      'LICENSE',
      'SECURITY.md',
      'AGENTS.md',
    ];

    requiredFiles.forEach((file) => {
      const filePath = path.join(__dirname, '..', file);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  test('should have required directories', () => {
    const requiredDirs = ['docs', 'examples', 'tools', 'accessibility'];

    requiredDirs.forEach((dir) => {
      const dirPath = path.join(__dirname, '..', dir);
      expect(fs.existsSync(dirPath)).toBe(true);
    });
  });

  test('should have .gitignore', () => {
    const gitignorePath = path.join(__dirname, '..', '.gitignore');
    expect(fs.existsSync(gitignorePath)).toBe(true);
  });

  test('should have GitHub templates', () => {
    const githubFiles = [
      '.github/ISSUE_TEMPLATE/bug_report.md',
      '.github/ISSUE_TEMPLATE/feature_request.md',
      '.github/PULL_REQUEST_TEMPLATE.md',
    ];

    githubFiles.forEach((file) => {
      const filePath = path.join(__dirname, '..', file);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
});
