const fs = require('fs');

// Mock dependencies before requiring the module
// Preserve the rest of the fs module and only mock fs.promises.readFile
jest.mock('fs', () => {
  const actualFs = jest.requireActual('fs');
  return {
    ...actualFs,
    promises: {
      ...actualFs.promises,
      readFile: jest.fn(),
    },
  };
});

jest.mock('../tools/validators/fr1-checker', () => {
  return jest.fn().mockImplementation(() => ({
    checkFR1: jest.fn().mockResolvedValue({ passed: true }),
  }));
});
jest.mock('../accessibility/compliance-audit', () => {
  return jest.fn().mockImplementation(() => ({
    runAudit: jest.fn().mockResolvedValue({ overallScore: 80 }),
    auditPage: jest.fn().mockResolvedValue({ overallScore: 80, passed: true }),
  }));
});
jest.mock('../tools/agent-simulator', () => {
  return jest.fn().mockImplementation(() => ({
    simulate: jest.fn().mockResolvedValue({}),
  }));
});

const BiModalDesignCLI = require('../tools/bimodal-design-cli');

describe('BiModalDesignCLI', () => {
  let cli;

  beforeEach(() => {
    cli = new BiModalDesignCLI();
  });

  describe('calculateComprehensiveScore', () => {
    it('should calculate correct score with full data (happy path)', () => {
      const auditResult = {
        overallScore: 80,
        requirements: {
          FR7: { score: 90 },
        },
      };

      const simResult = {
        comparison: {
          accessibilityScores: {
            agent1: 100,
            agent2: 80,
          },
        },
      };

      // Compliance: 80 * 0.5 = 40
      // Usability: (100 + 80) / 2 = 90. 90 * 0.3 = 27
      // Performance: 90 * 0.2 = 18
      // Overall = 40 + 27 + 18 = 85
      const result = cli.calculateComprehensiveScore(auditResult, simResult);

      expect(result).toEqual({
        overall: 85,
        compliance: 80,
        usability: 90,
        performance: 90,
      });
    });

    it('should handle partial data (missing performance score and usability scores)', () => {
      const auditResult = {
        overallScore: 70,
        // missing requirements/FR7
      };

      const simResult = {
        // missing comparison
      };

      // Compliance: 70 * 0.5 = 35
      // Usability: 0 * 0.3 = 0
      // Performance: 0 * 0.2 = 0
      // Overall = 35
      const result = cli.calculateComprehensiveScore(auditResult, simResult);

      expect(result).toEqual({
        overall: 35,
        compliance: 70,
        usability: 0,
        performance: 0,
      });
    });

    it('should handle empty objects as inputs', () => {
      const result = cli.calculateComprehensiveScore({}, {});

      expect(result).toEqual({
        overall: 0,
        compliance: 0,
        usability: 0,
        performance: 0,
      });
    });

    it('should handle division by zero edge case when accessibilityScores is empty', () => {
      const auditResult = {
        overallScore: 60,
        requirements: {
          FR7: { score: 50 },
        },
      };

      const simResult = {
        comparison: {
          accessibilityScores: {},
        },
      };

      // Compliance: 60 * 0.5 = 30
      // Usability: 0 (should not be NaN)
      // Performance: 50 * 0.2 = 10
      // Overall = 40
      const result = cli.calculateComprehensiveScore(auditResult, simResult);

      expect(result).toEqual({
        overall: 40,
        compliance: 60,
        usability: 0,
        performance: 50,
      });
    });

    it('should handle null/undefined in nested objects safely', () => {
      const auditResult = {
        overallScore: 60,
        requirements: {
          // FR7 exists but score is missing
          FR7: {},
        },
      };

      const simResult = {
        comparison: {
          // accessibilityScores is missing
        },
      };

      const result = cli.calculateComprehensiveScore(auditResult, simResult);

      expect(result.performance).toBe(0);
      expect(result.usability).toBe(0);
    });

    it('should handle null for both auditResult and simResult', () => {
      const result = cli.calculateComprehensiveScore(null, null);

      expect(result).toEqual({
        overall: 0,
        compliance: 0,
        usability: 0,
        performance: 0,
      });
    });

    it('should handle undefined for both auditResult and simResult', () => {
      const result = cli.calculateComprehensiveScore(undefined, undefined);

      expect(result).toEqual({
        overall: 0,
        compliance: 0,
        usability: 0,
        performance: 0,
      });
    });

    it('should correctly round scores up and down', () => {
      // Scenario 1: Rounding up
      // compliance: 33 * 0.5 = 16.5
      // usability: 33 * 0.3 = 9.9
      // performance: 33 * 0.2 = 6.6
      // overall: 16.5 + 9.9 + 6.6 = 33 (exact integer)
      // Wait, let's create a rounding scenario:
      // compliance: 33 * 0.5 = 16.5
      // usability: 0 * 0.3 = 0
      // performance: 0 * 0.2 = 0
      // overall = 16.5 -> round(16.5) = 17
      let result = cli.calculateComprehensiveScore({ overallScore: 33 }, null);
      expect(result.overall).toBe(17);

      // Scenario 2: Rounding down
      // compliance: 31 * 0.5 = 15.5
      // usability: 0 * 0.3 = 0
      // performance: 1 * 0.2 = 0.2
      // overall = 15.5 + 0.2 = 15.7 -> round(15.7) = 16
      // Let's do: compliance 32, performance 1
      // compliance: 32 * 0.5 = 16
      // usability: 0
      // performance: 2 * 0.2 = 0.4
      // overall = 16.4 -> round(16.4) = 16
      result = cli.calculateComprehensiveScore(
        { overallScore: 32, requirements: { FR7: { score: 2 } } },
        null
      );
      expect(result.overall).toBe(16);
    });
  });

  describe('loadUrlsFromFile', () => {
    it('should parse and return an array of valid http URLs', async () => {
      fs.promises.readFile.mockResolvedValueOnce('http://example.com\nhttps://test.com');
      const urls = await cli.loadUrlsFromFile('dummy.txt');
      expect(urls).toEqual(['http://example.com', 'https://test.com']);
    });

    it('should ignore empty lines and whitespace-only lines', async () => {
      fs.promises.readFile.mockResolvedValueOnce('http://a.com\n\n   \nhttps://b.com');
      const urls = await cli.loadUrlsFromFile('dummy.txt');
      expect(urls).toEqual(['http://a.com', 'https://b.com']);
    });

    it('should ignore lines that do not start with http', async () => {
      fs.promises.readFile.mockResolvedValueOnce(
        'http://a.com\nftp://b.com\nexample.com\nhttps://c.com'
      );
      const urls = await cli.loadUrlsFromFile('dummy.txt');
      expect(urls).toEqual(['http://a.com', 'https://c.com']);
    });

    it('should correctly trim whitespace around valid URLs', async () => {
      fs.promises.readFile.mockResolvedValueOnce('  http://a.com  \n\thttps://b.com\t');
      const urls = await cli.loadUrlsFromFile('dummy.txt');
      expect(urls).toEqual(['http://a.com', 'https://b.com']);
    });

    it('should return an empty array if file is completely empty', async () => {
      fs.promises.readFile.mockResolvedValueOnce('');
      const urls = await cli.loadUrlsFromFile('dummy.txt');
      expect(urls).toEqual([]);
    });

    it('should return an empty array if file contains no valid URLs', async () => {
      fs.promises.readFile.mockResolvedValueOnce('not an url\njust text');
      const urls = await cli.loadUrlsFromFile('dummy.txt');
      expect(urls).toEqual([]);
    });

    it('should propagate errors if readFile fails', async () => {
      const error = new Error('File not found');
      fs.promises.readFile.mockRejectedValueOnce(error);
      await expect(cli.loadUrlsFromFile('missing.txt')).rejects.toThrow('File not found');
    });
  });

  describe('loadConfig', () => {
    const fsPromises = require('fs').promises;
    let readFileSpy;

    beforeEach(() => {
      readFileSpy = jest.spyOn(fsPromises, 'readFile');
    });

    afterEach(() => {
      readFileSpy.mockRestore();
    });

    it('should parse and return JSON content for .json files', async () => {
      const mockData = { framework: 'react' };
      readFileSpy.mockResolvedValue(JSON.stringify(mockData));

      const result = await cli.loadConfig('custom-config.json');

      expect(readFileSpy).toHaveBeenCalledWith('custom-config.json', 'utf8');
      expect(result).toEqual(mockData);
    });

    it('should parse and return bimodal-design key from package.json', async () => {
      const mockPkg = {
        name: 'test-project',
        'bimodal-design': { framework: 'vue' },
      };
      readFileSpy.mockResolvedValue(JSON.stringify(mockPkg));

      const result = await cli.loadConfig('package.json');

      expect(readFileSpy).toHaveBeenCalledWith('package.json', 'utf8');
      expect(result).toEqual({ framework: 'vue' });
    });

    it('should return empty object if package.json has no bimodal-design key', async () => {
      const mockPkg = { name: 'test-project' };
      readFileSpy.mockResolvedValue(JSON.stringify(mockPkg));

      const result = await cli.loadConfig('package.json');

      expect(readFileSpy).toHaveBeenCalledWith('package.json', 'utf8');
      expect(result).toEqual({});
    });

    it('should return default config if configPath is not json or package.json', async () => {
      const result = await cli.loadConfig('some-other-file.yml');

      expect(readFileSpy).not.toHaveBeenCalled();
      expect(result).toEqual({
        framework: 'vanilla',
        template: 'basic',
        version: cli.version,
      });
    });

    it('should propagate errors from fs.readFile', async () => {
      const error = new Error('File not found');
      readFileSpy.mockRejectedValue(error);

      await expect(cli.loadConfig('missing.json')).rejects.toThrow('File not found');
    });

    it('should propagate JSON parse errors', async () => {
      readFileSpy.mockResolvedValue('invalid json {');

      await expect(cli.loadConfig('bad.json')).rejects.toThrow();
    });
  });

  describe('runAudit', () => {
    let ComplianceAuditor;

    beforeEach(() => {
      // Clear all mocks before each test
      jest.clearAllMocks();

      ComplianceAuditor = require('../accessibility/compliance-audit');

      // We need to suppress console.log for clean test output
      jest.spyOn(console, 'log').mockImplementation(() => {});

      // Mock outputResults to avoid file system operations during tests
      jest.spyOn(cli, 'outputResults').mockResolvedValue();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should run audit for a single URL', async () => {
      await cli.runAudit(['http://example.com']);

      // Get the instance created inside runAudit
      const auditorInstance = ComplianceAuditor.mock.results[0].value;

      expect(auditorInstance.auditPage).toHaveBeenCalledWith('http://example.com');
      expect(cli.outputResults).toHaveBeenCalledWith(
        { overallScore: 80, passed: true },
        expect.objectContaining({ url: 'http://example.com', format: 'json' })
      );
    });

    it('should run batch audit for multiple URLs', async () => {
      // Mock loadUrlsFromFile
      jest
        .spyOn(cli, 'loadUrlsFromFile')
        .mockResolvedValue(['http://example.com/page1', 'http://example.com/page2']);

      await cli.runAudit(['--batch', 'urls.txt']);

      // Get the instance created inside runAudit
      const auditorInstance = ComplianceAuditor.mock.results[0].value;

      expect(cli.loadUrlsFromFile).toHaveBeenCalledWith('urls.txt');
      expect(auditorInstance.auditPage).toHaveBeenCalledTimes(2);
      expect(auditorInstance.auditPage).toHaveBeenCalledWith('http://example.com/page1');
      expect(auditorInstance.auditPage).toHaveBeenCalledWith('http://example.com/page2');

      expect(cli.outputResults).toHaveBeenCalledWith(
        [
          { overallScore: 80, passed: true },
          { overallScore: 80, passed: true },
        ],
        expect.objectContaining({ batch: 'urls.txt' })
      );
    });

    it('should throw an error if no URL or batch file is provided', async () => {
      await expect(cli.runAudit([])).rejects.toThrow('Please provide a URL or batch file');
    });
  });
});
