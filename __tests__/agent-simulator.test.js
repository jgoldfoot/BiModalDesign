jest.mock('puppeteer', () => ({}), { virtual: true });

const AgentSimulator = require('../tools/agent-simulator.js');

describe('AgentSimulator - generateMarkdownReport', () => {
  let simulator;

  beforeEach(() => {
    simulator = new AgentSimulator();
    // Use jest's fake timers to mock Date output
    jest.useFakeTimers().setSystemTime(new Date('2023-10-27T10:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should generate a single-agent report', () => {
    const mockResults = {
      basic: {
        url: 'https://example.com',
        agentType: 'basic',
        agentProfile: { name: 'Basic Web Agent' },
        accessibility: { score: 85 },
        tasks: {
          'extract-content': {
            taskDescription: 'Find and extract main page content',
            success: true,
            elementsFound: [1, 2, 3],
            issues: [],
          },
          'find-contact': {
            taskDescription: 'Locate contact information',
            success: false,
            elementsFound: [],
            issues: ['Selector failed: timeout'],
          },
        },
      },
    };

    const expectedReport =
      `# Agent Simulation Report\n\n` +
      `Generated on 2023-10-27T10:00:00.000Z\n\n` +
      `## Basic Web Agent Test Results\n\n` +
      `**URL:** https://example.com\n` +
      `**Agent Type:** basic\n` +
      `**Accessibility Score:** 85%\n\n` +
      `### Task Results\n\n` +
      `#### Find and extract main page content\n` +
      `**Status:** ✅ Success\n` +
      `**Elements Found:** 3\n\n` +
      `#### Locate contact information\n` +
      `**Status:** ❌ Failed\n` +
      `**Elements Found:** 0\n` +
      `**Issues:** Selector failed: timeout\n\n`;

    const report = simulator.generateMarkdownReport(mockResults);
    expect(report).toBe(expectedReport);
  });

  it('should generate a multi-agent report with recommendations', () => {
    const mockResults = {
      comparison: {
        taskSuccessRates: {
          'extract-content': { basic: true, advanced: true },
          'find-contact': { basic: false, advanced: true },
        },
        accessibilityScores: {
          basic: 60,
          advanced: 95,
        },
        recommendations: [
          'Basic agents struggling - implement FR-1',
          'Large gap between basic and advanced agents',
        ],
      },
    };

    const expectedReport =
      `# Agent Simulation Report\n\n` +
      `Generated on 2023-10-27T10:00:00.000Z\n\n` +
      `## Multi-Agent Test Results\n\n` +
      `### Task Success Rates\n\n` +
      `**extract-content:**\n` +
      `- basic: ✅\n` +
      `- advanced: ✅\n\n` +
      `**find-contact:**\n` +
      `- basic: ❌\n` +
      `- advanced: ✅\n\n` +
      `### Accessibility Scores\n\n` +
      `- **basic:** 60%\n` +
      `- **advanced:** 95%\n\n` +
      `### Recommendations\n\n` +
      `- Basic agents struggling - implement FR-1\n` +
      `- Large gap between basic and advanced agents\n`;

    const report = simulator.generateMarkdownReport(mockResults);
    expect(report).toBe(expectedReport);
  });

  it('should generate a multi-agent report without recommendations', () => {
    const mockResults = {
      comparison: {
        taskSuccessRates: {
          'extract-content': { basic: true, advanced: true },
        },
        accessibilityScores: {
          basic: 90,
          advanced: 95,
        },
        recommendations: [],
      },
    };

    const expectedReport =
      `# Agent Simulation Report\n\n` +
      `Generated on 2023-10-27T10:00:00.000Z\n\n` +
      `## Multi-Agent Test Results\n\n` +
      `### Task Success Rates\n\n` +
      `**extract-content:**\n` +
      `- basic: ✅\n` +
      `- advanced: ✅\n\n` +
      `### Accessibility Scores\n\n` +
      `- **basic:** 90%\n` +
      `- **advanced:** 95%\n`;

    const report = simulator.generateMarkdownReport(mockResults);
    expect(report).toBe(expectedReport);
  });
});

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

describe('AgentSimulator - simulateAgent', () => {
  let simulator;
  const puppeteer = require('puppeteer');

  beforeEach(() => {
    simulator = new AgentSimulator();
    // Use jest's fake timers to mock Date output
    jest.useFakeTimers().setSystemTime(new Date('2023-10-27T10:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should return error object when browser.newPage throws an error', async () => {
    // Mock puppeteer.launch to return a mock browser with newPage throwing
    puppeteer.launch = jest.fn().mockResolvedValue({
      newPage: jest.fn().mockRejectedValue(new Error('Simulated page error')),
      close: jest.fn().mockResolvedValue(),
    });

    const result = await simulator.simulateAgent('https://example.com', 'basic');

    expect(result).toEqual({
      url: 'https://example.com',
      agentType: 'basic',
      timestamp: '2023-10-27T10:00:00.000Z',
      error: 'Simulated page error',
      success: false,
    });
  });
});
