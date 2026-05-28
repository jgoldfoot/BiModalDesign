jest.mock(
  'jsdom',
  () => ({
    JSDOM: class {},
  }),
  { virtual: true }
);

const { FR1Checker } = require('../tools/validators/fr1-checker');

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
