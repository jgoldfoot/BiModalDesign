jest.mock('puppeteer', () => ({}), { virtual: true });

const AgentSimulator = require('../tools/agent-simulator.js');

describe('AgentSimulator - compareAgentResults', () => {
  let simulator;

  beforeEach(() => {
    simulator = new AgentSimulator();
  });

  test('should return empty comparison for empty results', () => {
    const results = {};
    const expected = {
      taskSuccessRates: {},
      accessibilityScores: {},
      performanceComparison: {},
      recommendations: [],
    };
    expect(simulator.compareAgentResults(results)).toEqual(expected);
  });

  test('should extract task success rates, accessibility scores, and performance', () => {
    const results = {
      basic: {
        tasks: {
          'task-1': { success: true },
          'task-2': { success: false },
        },
        accessibility: { score: 80 },
        performance: { totalLoadTime: 1000 },
      },
      advanced: {
        tasks: {
          'task-1': { success: true },
          'task-2': { success: true },
        },
        accessibility: { score: 95 },
        performance: { totalLoadTime: 1500 },
      },
    };

    const comparison = simulator.compareAgentResults(results);

    expect(comparison.taskSuccessRates).toEqual({
      'task-1': { basic: true, advanced: true },
      'task-2': { basic: false, advanced: true },
    });
    expect(comparison.accessibilityScores).toEqual({
      basic: 80,
      advanced: 95,
    });
    expect(comparison.performanceComparison).toEqual({
      basic: { totalLoadTime: 1000 },
      advanced: { totalLoadTime: 1500 },
    });
  });

  test('should generate recommendation when basic agent score is < 70', () => {
    const results = {
      basic: {
        accessibility: { score: 60 },
      },
      advanced: {
        accessibility: { score: 80 },
      },
    };

    const comparison = simulator.compareAgentResults(results);
    expect(comparison.recommendations).toContain(
      'Basic agents struggling - implement FR-1 (Initial Payload Accessibility)'
    );
  });

  test('should generate recommendation when advanced score > basic score + 30', () => {
    const results = {
      basic: {
        accessibility: { score: 60 },
      },
      advanced: {
        accessibility: { score: 95 },
      },
    };

    const comparison = simulator.compareAgentResults(results);
    expect(comparison.recommendations).toContain(
      'Large gap between basic and advanced agents - consider progressive enhancement'
    );
  });

  test('should generate recommendation when task works for advanced but fails for basic', () => {
    const results = {
      basic: {
        tasks: { 'complex-task': { success: false } },
        accessibility: { score: 80 },
      },
      advanced: {
        tasks: { 'complex-task': { success: true } },
        accessibility: { score: 80 },
      },
    };

    const comparison = simulator.compareAgentResults(results);
    expect(comparison.recommendations).toContain(
      'Task "complex-task" only works for advanced agents - improve semantic markup'
    );
  });

  test('should ignore "comparison" key in results', () => {
    const results = {
      basic: { accessibility: { score: 80 } },
      comparison: { someKey: 'should-be-ignored' },
    };

    const comparison = simulator.compareAgentResults(results);
    expect(Object.keys(comparison.accessibilityScores)).toEqual(['basic']);
  });
});
