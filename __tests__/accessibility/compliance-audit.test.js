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


  describe('auditPage', () => {
    let mockPage;
    let mockBrowser;

    beforeEach(() => {
      mockPage = {
        setUserAgent: jest.fn(),
        setViewport: jest.fn(),
        goto: jest.fn().mockResolvedValue(),
        screenshot: jest.fn().mockResolvedValue('base64screenshot'),
      };

      mockBrowser = {
        newPage: jest.fn().mockResolvedValue(mockPage),
        close: jest.fn().mockResolvedValue(),
      };

      require('puppeteer').launch.mockResolvedValue(mockBrowser);

      // Mock the FR tests to avoid actual DOM evaluation
      jest.spyOn(auditor, 'testFR1').mockResolvedValue({ score: 10, passed: true });
      jest.spyOn(auditor, 'testFR2').mockResolvedValue({ score: 10, passed: true });
      jest.spyOn(auditor, 'testFR3').mockResolvedValue({ score: 10, passed: true });
      jest.spyOn(auditor, 'testFR4').mockResolvedValue({ score: 10, passed: true });
      jest.spyOn(auditor, 'testFR5').mockResolvedValue({ score: 10, passed: true });
      jest.spyOn(auditor, 'testFR6').mockResolvedValue({ score: 10, passed: true });
      jest.spyOn(auditor, 'testFR7').mockResolvedValue({ score: 10, passed: true });

      jest.spyOn(auditor, 'calculateOverallScore').mockReturnValue(85);
      jest.spyOn(auditor, 'generateRecommendations').mockReturnValue(['Fix contrast']);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should successfully audit a page and return scores', async () => {
      const url = 'https://example.com';
      const result = await auditor.auditPage(url);

      expect(require('puppeteer').launch).toHaveBeenCalledWith({ headless: true });
      expect(mockBrowser.newPage).toHaveBeenCalled();
      expect(mockPage.setUserAgent).toHaveBeenCalledWith(auditor.options.userAgent);
      expect(mockPage.setViewport).toHaveBeenCalledWith(auditor.options.viewport);
      expect(mockPage.goto).toHaveBeenCalledWith(url, { waitUntil: 'networkidle0', timeout: auditor.options.timeout });

      expect(auditor.testFR1).toHaveBeenCalledWith(mockPage);
      expect(auditor.testFR7).toHaveBeenCalledWith(mockPage);

      expect(auditor.calculateOverallScore).toHaveBeenCalled();
      expect(auditor.generateRecommendations).toHaveBeenCalled();

      expect(result.url).toBe(url);
      expect(result.overallScore).toBe(85);
      expect(result.passed).toBe(true);
      expect(result.recommendations).toEqual(['Fix contrast']);
      expect(result.screenshot).toBeUndefined();

      expect(mockBrowser.close).toHaveBeenCalled();
    });

    it('should capture a screenshot if includeScreenshots is true', async () => {
      auditor.options.includeScreenshots = true;
      const url = 'https://example.com';
      const result = await auditor.auditPage(url);

      expect(mockPage.screenshot).toHaveBeenCalledWith({ encoding: 'base64', fullPage: true });
      expect(result.screenshot).toBe('base64screenshot');
      expect(mockBrowser.close).toHaveBeenCalled();
    });

    it('should handle errors gracefully during the audit', async () => {
      const url = 'https://error.com';
      const errorMessage = 'Navigation failed';
      mockPage.goto.mockRejectedValue(new Error(errorMessage));

      const result = await auditor.auditPage(url);

      expect(result.url).toBe(url);
      expect(result.error).toBe(errorMessage);
      expect(result.passed).toBe(false);
      expect(result.overallScore).toBe(0);

      expect(mockBrowser.close).toHaveBeenCalled();
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
