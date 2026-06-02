jest.mock(
  'puppeteer',
  () => ({
    launch: jest.fn().mockResolvedValue({
      newPage: jest.fn().mockResolvedValue({
        setUserAgent: jest.fn(),
        setViewport: jest.fn(),
      }),
      close: jest.fn(),
    }),
  }),
  { virtual: true }
);

const BiModalDesignComplianceAuditor = require('../../accessibility/compliance-audit');

describe('BiModalDesignComplianceAuditor', () => {
  let auditor;
  let mockResults;

  beforeEach(() => {
    auditor = new BiModalDesignComplianceAuditor();
    mockResults = {
      url: 'https://example.com',
      timestamp: new Date().toISOString(),
      passed: true,
      score: 85,
      level: 2,
      requirements: [
        {
          requirement: 'FR1',
          name: 'Initial Payload Accessibility',
          passed: true,
          score: 90,
          details: ['Has title', 'Has main'],
          issues: [],
        },
      ],
      recommendations: [],
    };
  });

  describe('testFR2', () => {
    it('should pass with proper heading hierarchy, all landmarks, and lists', async () => {
      const mockPage = {
        evaluate: jest.fn()
          .mockResolvedValueOnce([{ level: 1, text: 'H1' }, { level: 2, text: 'H2' }]) // Headings
          .mockResolvedValueOnce(['header', 'nav', 'main', 'footer']), // Landmarks
        $$eval: jest.fn().mockResolvedValue(2), // Lists
      };

      const result = await auditor.testFR2(mockPage);

      expect(result.passed).toBe(true);
      expect(result.score).toBe(100);
      expect(result.issues.length).toBe(0);
      expect(result.details).toContain('Document outline with 2 headings');
      expect(result.details).toContain('Proper heading hierarchy maintained');
      expect(result.details).toContain('All required landmarks present');
      expect(result.details).toContain('Found 2 list elements');
    });

    it('should report an issue when no headings are found', async () => {
      const mockPage = {
        evaluate: jest.fn()
          .mockResolvedValueOnce([]) // No headings
          .mockResolvedValueOnce(['header', 'nav', 'main', 'footer']),
        $$eval: jest.fn().mockResolvedValue(0),
      };

      const result = await auditor.testFR2(mockPage);

      expect(result.passed).toBe(false); // 2/3 passed (67% score, need 70% to pass)
      expect(result.issues).toContain('No heading structure found');
    });

    it('should report an issue when heading hierarchy is invalid', async () => {
      const mockPage = {
        evaluate: jest.fn()
          .mockResolvedValueOnce([{ level: 1, text: 'H1' }, { level: 3, text: 'H3' }]) // Gap in hierarchy
          .mockResolvedValueOnce(['header', 'nav', 'main', 'footer']),
        $$eval: jest.fn().mockResolvedValue(0),
      };

      const result = await auditor.testFR2(mockPage);

      expect(result.passed).toBe(false);
      expect(result.issues).toContain('Heading hierarchy has gaps (e.g., h1 directly to h3)');
    });

    it('should report an issue when required landmarks are missing', async () => {
      const mockPage = {
        evaluate: jest.fn()
          .mockResolvedValueOnce([{ level: 1, text: 'H1' }])
          .mockResolvedValueOnce(['header', 'footer']), // Missing nav, main
        $$eval: jest.fn().mockResolvedValue(0),
      };

      const result = await auditor.testFR2(mockPage);

      expect(result.passed).toBe(false);
      expect(result.issues).toContain('Missing landmarks: nav, main');
    });

    it('should gracefully handle errors during execution', async () => {
      const mockError = new Error('Evaluate failed');
      const mockPage = {
        evaluate: jest.fn().mockRejectedValue(mockError),
      };

      const result = await auditor.testFR2(mockPage);

      expect(result.passed).toBe(false);
      expect(result.score).toBe(0);
      expect(result.issues).toContain(`FR-2 test error: ${mockError.message}`);
    });
  });

  describe('testFR3', () => {
    it('should gracefully handle errors during execution', async () => {
      const mockError = new Error('Simulated $$eval failure');
      const mockPage = {
        $$eval: jest.fn().mockRejectedValue(mockError),
      };

      const result = await auditor.testFR3(mockPage);

      expect(result.passed).toBe(false);
      expect(result.score).toBe(0);
      expect(result.issues).toContain(`FR-3 test error: ${mockError.message}`);
    });
  });

  describe('generateReport', () => {
    it('should default to generating a JSON report', async () => {
      const report = await auditor.generateReport(mockResults);
      expect(typeof report).toBe('string');
      const parsed = JSON.parse(report);
      expect(parsed.url).toBe(mockResults.url);
      expect(parsed.score).toBe(mockResults.score);
    });

    it('should generate an HTML report', async () => {
      const report = await auditor.generateReport(mockResults, 'html');
      expect(typeof report).toBe('string');
      expect(report).toContain('<!DOCTYPE html>');
      expect(report).toContain('BiModal Design Compliance Audit Report');
      expect(report).toContain(mockResults.url);
    });

    it('should generate a Markdown report', async () => {
      const report = await auditor.generateReport(mockResults, 'markdown');
      expect(typeof report).toBe('string');
      expect(report).toContain('# BiModal Design Compliance Audit Report');
      expect(report).toContain(mockResults.url);
    });

    it('should generate a CSV report', async () => {
      const report = await auditor.generateReport(mockResults, 'csv');
      expect(typeof report).toBe('string');
      expect(report).toContain('URL,Overall Score,Passed');
      expect(report).toContain(`"${mockResults.url}"`);
    });

    it('should handle an array of results for JSON format', async () => {
      const arrayResults = [mockResults, { ...mockResults, url: 'https://example.org' }];
      const report = await auditor.generateReport(arrayResults, 'json');
      const parsed = JSON.parse(report);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(2);
      expect(parsed[0].url).toBe('https://example.com');
      expect(parsed[1].url).toBe('https://example.org');
    });

    it('should handle an array of results for HTML format', async () => {
      const arrayResults = [mockResults, { ...mockResults, url: 'https://example.org' }];
      const report = await auditor.generateReport(arrayResults, 'html');
      expect(report).toContain('https://example.com');
      expect(report).toContain('https://example.org');
    });
  });
});
