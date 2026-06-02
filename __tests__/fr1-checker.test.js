jest.mock(
  'jsdom',
  () => ({
    JSDOM: class {},
  }),
  { virtual: true }
);

const https = require('https');
const { EventEmitter } = require('events');
const { FR1Checker } = require('../tools/validators/fr1-checker');

describe('FR1Checker - fetchHTML', () => {
  let checker;

  beforeEach(() => {
    checker = new FR1Checker();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should reject when response has non-2xx status code', async () => {
    const mockReq = new EventEmitter();
    mockReq.end = jest.fn();
    mockReq.destroy = jest.fn();

    const mockRes = new EventEmitter();
    mockRes.statusCode = 404;
    mockRes.statusMessage = 'Not Found';

    jest.spyOn(https, 'request').mockImplementation((_options, callback) => {
      callback(mockRes);
      mockRes.emit('end');
      return mockReq;
    });

    await expect(checker.fetchHTML('https://example.com')).rejects.toThrow('HTTP 404: Not Found');
  });

  it('should reject on request error', async () => {
    const mockReq = new EventEmitter();
    mockReq.end = jest.fn();
    mockReq.destroy = jest.fn();

    jest.spyOn(https, 'request').mockImplementation((_options, _callback) => {
      // Don't call callback, simulate error
      setTimeout(() => mockReq.emit('error', new Error('Network error')), 0);
      return mockReq;
    });

    await expect(checker.fetchHTML('https://example.com')).rejects.toThrow('Network error');
  });

  it('should reject on request timeout', async () => {
    const mockReq = new EventEmitter();
    mockReq.end = jest.fn();
    mockReq.destroy = jest.fn();

    jest.spyOn(https, 'request').mockImplementation((_options, _callback) => {
      setTimeout(() => mockReq.emit('timeout'), 0);
      return mockReq;
    });

    await expect(checker.fetchHTML('https://example.com')).rejects.toThrow('Request timeout');
    expect(mockReq.destroy).toHaveBeenCalled();
  });

  it('should resolve with data on successful response', async () => {
    const mockReq = new EventEmitter();
    mockReq.end = jest.fn();
    mockReq.destroy = jest.fn();

    const mockRes = new EventEmitter();
    mockRes.statusCode = 200;

    jest.spyOn(https, 'request').mockImplementation((_options, callback) => {
      callback(mockRes);
      mockRes.emit('data', '<html>');
      mockRes.emit('data', '<body>OK</body></html>');
      mockRes.emit('end');
      return mockReq;
    });

    const result = await checker.fetchHTML('https://example.com');
    expect(result).toBe('<html><body>OK</body></html>');
  });
});

describe('FR1Checker - generateRecommendations', () => {
  let checker;

  beforeEach(() => {
    checker = new FR1Checker();
  });

  describe('with pre-calculated summary', () => {
    it('should return high priority recommendation when averageScore is < 0.7', () => {
      const summary = {
        averageScore: 0.65,
        commonIssues: [],
        failed: 0,
        total: 10,
      };

      const recommendations = checker.generateRecommendations([], summary);

      expect(recommendations).toContainEqual(
        expect.objectContaining({
          priority: 'high',
          title: 'Improve overall FR-1 compliance',
          description: 'Average score is 65.0%. Focus on addressing common issues.',
        })
      );
    });

    it('should not return score-related recommendation when averageScore is >= 0.7', () => {
      const summary = {
        averageScore: 0.75,
        commonIssues: [],
        failed: 0,
        total: 10,
      };

      const recommendations = checker.generateRecommendations([], summary);

      expect(recommendations.some((r) => r.title === 'Improve overall FR-1 compliance')).toBe(
        false
      );
    });

    it('should return recommendation for the top issue if commonIssues exist', () => {
      const summary = {
        averageScore: 0.9,
        commonIssues: [
          { issue: 'Missing alt text', percentage: '45.0' },
          { issue: 'Insufficient contrast', percentage: '20.0' },
        ],
        failed: 0,
        total: 10,
      };

      const recommendations = checker.generateRecommendations([], summary);

      expect(recommendations).toContainEqual(
        expect.objectContaining({
          priority: 'high',
          title: 'Address most common issue',
          description: '"Missing alt text" affects 45.0% of pages',
        })
      );
    });

    it('should return medium priority recommendation when there are failing pages', () => {
      const summary = {
        averageScore: 0.8,
        commonIssues: [],
        failed: 3,
        total: 10,
      };

      const recommendations = checker.generateRecommendations([], summary);

      expect(recommendations).toContainEqual(
        expect.objectContaining({
          priority: 'medium',
          title: 'Fix failing pages',
          description: '3 out of 10 pages are failing FR-1 compliance',
        })
      );
    });

    it('should return multiple recommendations if multiple conditions are met', () => {
      const summary = {
        averageScore: 0.5,
        commonIssues: [{ issue: 'Missing alt text', percentage: '45.0' }],
        failed: 5,
        total: 10,
      };

      const recommendations = checker.generateRecommendations([], summary);

      expect(recommendations).toHaveLength(3);
      expect(recommendations[0].title).toBe('Improve overall FR-1 compliance');
      expect(recommendations[1].title).toBe('Address most common issue');
      expect(recommendations[2].title).toBe('Fix failing pages');
    });

    it('should return empty array if no conditions are met', () => {
      const summary = {
        averageScore: 1.0,
        commonIssues: [],
        failed: 0,
        total: 10,
      };

      const recommendations = checker.generateRecommendations([], summary);

      expect(recommendations).toHaveLength(0);
    });
  });

  describe('without pre-calculated summary', () => {
    it('should calculate summary from results and generate score recommendation', () => {
      const results = [
        { score: 0.4, passed: false, issues: ['A'] },
        { score: 0.8, passed: true, issues: [] },
      ];
      // averageScore = 0.6, failed = 1, total = 2
      // commonIssues = [{issue: 'A', count: 1, percentage: '50.0'}]

      const recommendations = checker.generateRecommendations(results);

      expect(recommendations).toHaveLength(3);

      expect(recommendations).toContainEqual(
        expect.objectContaining({
          priority: 'high',
          title: 'Improve overall FR-1 compliance',
          description: 'Average score is 60.0%. Focus on addressing common issues.',
        })
      );

      expect(recommendations).toContainEqual(
        expect.objectContaining({
          priority: 'high',
          title: 'Address most common issue',
          description: '"A" affects 50.0% of pages',
        })
      );

      expect(recommendations).toContainEqual(
        expect.objectContaining({
          priority: 'medium',
          title: 'Fix failing pages',
          description: '1 out of 2 pages are failing FR-1 compliance',
        })
      );
    });

    it('should handle results without score property gracefully', () => {
      const results = [
        { passed: true, issues: [] },
        { passed: true, issues: [] },
      ];
      // averageScore = 0.0, failed = 0, total = 2

      const recommendations = checker.generateRecommendations(results);

      expect(recommendations).toContainEqual(
        expect.objectContaining({
          priority: 'high',
          title: 'Improve overall FR-1 compliance',
          description: 'Average score is 0.0%. Focus on addressing common issues.',
        })
      );
    });
  });
});


describe('FR1Checker - checkURL', () => {
  let checker;

  beforeEach(() => {
    checker = new FR1Checker();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should return combined result on successful check', async () => {
    jest.spyOn(checker, 'fetchHTML').mockImplementation(() => {
      jest.setSystemTime(new Date('2023-01-01T00:00:00.050Z'));
      return '<html></html>';
    });
    jest.spyOn(checker, 'analyzeHTML').mockImplementation(() => {
      jest.setSystemTime(new Date('2023-01-01T00:00:00.100Z'));
      return {
        passed: true,
        score: 1.0,
        issues: [],
        warnings: [],
        recommendations: [],
        details: {}
      };
    });

    const result = await checker.checkURL('https://example.com');

    expect(checker.fetchHTML).toHaveBeenCalledWith('https://example.com');
    expect(checker.analyzeHTML).toHaveBeenCalledWith('<html></html>', 'https://example.com');

    expect(result).toEqual({
      url: 'https://example.com',
      timestamp: '2023-01-01T00:00:00.100Z',
      loadTime: 100,
      passed: true,
      score: 1.0,
      issues: [],
      warnings: [],
      recommendations: [],
      details: {}
    });
  });

  it('should handle errors from fetchHTML', async () => {
    jest.spyOn(checker, 'fetchHTML').mockImplementation(() => {
      jest.setSystemTime(new Date('2023-01-01T00:00:00.050Z'));
      throw new Error('Network timeout');
    });
    jest.spyOn(checker, 'analyzeHTML').mockResolvedValue({});

    const result = await checker.checkURL('https://example.com');

    expect(checker.fetchHTML).toHaveBeenCalledWith('https://example.com');
    expect(checker.analyzeHTML).not.toHaveBeenCalled();

    expect(result).toEqual({
      url: 'https://example.com',
      timestamp: '2023-01-01T00:00:00.050Z',
      loadTime: 50,
      passed: false,
      score: 0,
      error: 'Network timeout',
      issues: ['Failed to load page: Network timeout']
    });
  });

  it('should handle errors from analyzeHTML', async () => {
    jest.spyOn(checker, 'fetchHTML').mockImplementation(() => {
      jest.setSystemTime(new Date('2023-01-01T00:00:00.050Z'));
      return '<html></html>';
    });
    jest.spyOn(checker, 'analyzeHTML').mockImplementation(() => {
      jest.setSystemTime(new Date('2023-01-01T00:00:00.080Z'));
      throw new Error('Parse error');
    });

    const result = await checker.checkURL('https://example.com');

    expect(checker.fetchHTML).toHaveBeenCalledWith('https://example.com');
    expect(checker.analyzeHTML).toHaveBeenCalledWith('<html></html>', 'https://example.com');

    expect(result).toEqual({
      url: 'https://example.com',
      timestamp: '2023-01-01T00:00:00.080Z',
      loadTime: 80,
      passed: false,
      score: 0,
      error: 'Parse error',
      issues: ['Failed to load page: Parse error']
    });
  });
});
