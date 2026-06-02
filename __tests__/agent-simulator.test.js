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

describe('AgentSimulator - executeTask', () => {
  let simulator;
  let mockPage;

  beforeEach(() => {
    simulator = new AgentSimulator();

    // Mock page methods
    mockPage = {
      $$: jest.fn(),
      $$eval: jest.fn(),
      evaluate: jest.fn(),
    };

    // Mock task specific analysis to isolate tests
    simulator.analyzeContactTypes = jest.fn().mockReturnValue(['email']);
    simulator.analyzeContentQuality = jest.fn().mockResolvedValue({ contentQuality: 'good' });
    simulator.analyzeFormAccessibility = jest.fn().mockResolvedValue({ hasForms: true });

    // Set a predictable task template for testing
    simulator.taskTemplates = {
      'test-task': {
        name: 'Test Task',
        description: 'A task for testing',
        selectors: ['.test-selector'],
        textPatterns: [/test pattern/g],
      },
      'find-contact': {
        name: 'Find Contact',
        description: 'Test specific analysis',
        selectors: ['.contact'],
      },
      'extract-content': {
        name: 'Extract Content',
        description: 'Test specific analysis',
        selectors: ['main'],
      },
      'form-interaction': {
        name: 'Form Interaction',
        description: 'Test specific analysis',
        selectors: ['form'],
      },
    };
  });

  it('should return error for unknown task', async () => {
    const result = await simulator.executeTask(mockPage, 'unknown-task', {});
    expect(result).toEqual({ error: 'Unknown task: unknown-task' });
  });

  it('should test selector-based discovery successfully', async () => {
    mockPage.$$.mockResolvedValue([{}]); // simulate one element found
    mockPage.$$eval.mockResolvedValue([
      { text: 'test text', href: 'url', tagName: 'A', attributes: { id: 'test' } },
    ]);
    mockPage.evaluate.mockResolvedValue(''); // no text matches

    const result = await simulator.executeTask(mockPage, 'test-task', {});

    expect(result.success).toBe(true);
    expect(result.elementsFound).toEqual([{ selector: '.test-selector', count: 1 }]);
    expect(result.details[0].selector).toBe('.test-selector');
    expect(result.details[0].elements[0].text).toBe('test text');
    expect(result.issues).toEqual([]);
  });

  it('should handle errors when a selector fails', async () => {
    mockPage.$$.mockRejectedValue(new Error('Selector timeout'));
    mockPage.evaluate.mockResolvedValue('');

    const result = await simulator.executeTask(mockPage, 'test-task', {});

    expect(result.success).toBe(false);
    expect(result.issues).toContain('Selector ".test-selector" failed: Selector timeout');
  });

  it('should test text pattern matching successfully', async () => {
    mockPage.$$.mockResolvedValue([]); // no elements found
    mockPage.evaluate.mockResolvedValue('Here is a test pattern in the text.');

    const result = await simulator.executeTask(mockPage, 'test-task', {});

    expect(result.success).toBe(true);
    expect(result.textMatches.length).toBe(1);
    expect(result.textMatches[0].pattern).toBe('/test pattern/g');
    expect(result.textMatches[0].matches).toEqual(['test pattern']);
  });

  it('should execute task-specific analysis for find-contact', async () => {
    mockPage.$$.mockResolvedValue([{}]);
    mockPage.$$eval.mockResolvedValue([]);
    mockPage.evaluate.mockResolvedValue('');

    const result = await simulator.executeTask(mockPage, 'find-contact', {});
    expect(simulator.analyzeContactTypes).toHaveBeenCalledWith(result);
    expect(result.contactTypes).toEqual(['email']);
  });

  it('should execute task-specific analysis for extract-content', async () => {
    mockPage.$$.mockResolvedValue([{}]);
    mockPage.$$eval.mockResolvedValue([]);
    mockPage.evaluate.mockResolvedValue('');

    const result = await simulator.executeTask(mockPage, 'extract-content', {});
    expect(simulator.analyzeContentQuality).toHaveBeenCalledWith(mockPage, result);
    expect(result.contentQuality).toEqual({ contentQuality: 'good' });
  });

  it('should execute task-specific analysis for form-interaction', async () => {
    mockPage.$$.mockResolvedValue([{}]);
    mockPage.$$eval.mockResolvedValue([]);
    mockPage.evaluate.mockResolvedValue('');

    const result = await simulator.executeTask(mockPage, 'form-interaction', {});
    expect(simulator.analyzeFormAccessibility).toHaveBeenCalledWith(mockPage, result);
    expect(result.formAccessibility).toEqual({ hasForms: true });
  });

  it('should catch general execution failures', async () => {
    // Make something throw outside of the try-catch for selectors
    // the evaluate call will throw here
    mockPage.$$.mockResolvedValue([]);
    mockPage.evaluate.mockRejectedValue(new Error('Evaluate failed'));

    const result = await simulator.executeTask(mockPage, 'test-task', {});

    expect(result.success).toBe(false);
    expect(result.issues).toContain('Task execution failed: Evaluate failed');
  });
});

describe('AgentSimulator - configurePageForAgent', () => {
  let simulator;
  let mockPage;

  beforeEach(() => {
    simulator = new AgentSimulator();
    mockPage = {
      setUserAgent: jest.fn(),
      setViewport: jest.fn(),
      setJavaScriptEnabled: jest.fn(),
      setRequestInterception: jest.fn(),
      on: jest.fn(),
    };
  });

  it('should configure page correctly for advanced profile (all enabled)', async () => {
    const profile = {
      userAgent: 'Advanced Agent',
      capabilities: {
        javascript: true,
        images: true,
        css: true,
      },
    };

    await simulator.configurePageForAgent(mockPage, profile);

    expect(mockPage.setUserAgent).toHaveBeenCalledWith('Advanced Agent');
    expect(mockPage.setViewport).toHaveBeenCalledWith(simulator.options.viewport);

    // JS is true, so setJavaScriptEnabled(false) should NOT be called
    expect(mockPage.setJavaScriptEnabled).not.toHaveBeenCalled();

    // Images and CSS are true, so setRequestInterception should NOT be called
    expect(mockPage.setRequestInterception).not.toHaveBeenCalled();
    expect(mockPage.on).not.toHaveBeenCalled();
  });

  it('should configure page correctly for basic profile (all disabled)', async () => {
    const profile = {
      userAgent: 'Basic Agent',
      capabilities: {
        javascript: false,
        images: false,
        css: false,
      },
    };

    await simulator.configurePageForAgent(mockPage, profile);

    expect(mockPage.setUserAgent).toHaveBeenCalledWith('Basic Agent');
    expect(mockPage.setViewport).toHaveBeenCalledWith(simulator.options.viewport);

    // JS is false, should be disabled
    expect(mockPage.setJavaScriptEnabled).toHaveBeenCalledWith(false);

    // Images/CSS disabled, request interception should be set
    expect(mockPage.setRequestInterception).toHaveBeenCalledWith(true);
    expect(mockPage.on).toHaveBeenCalledWith('request', expect.any(Function));
  });

  it('should handle request interception correctly', async () => {
    const profile = {
      userAgent: 'Intermediate Agent',
      capabilities: {
        javascript: true,
        images: false, // images disabled
        css: true, // css enabled
      },
    };

    await simulator.configurePageForAgent(mockPage, profile);

    // Get the request handler passed to page.on
    const requestHandler = mockPage.on.mock.calls.find((call) => call[0] === 'request')[1];
    expect(requestHandler).toBeDefined();

    // Create a mock request
    const mockRequest = {
      isInterceptResolutionHandled: jest.fn().mockReturnValue(false),
      resourceType: jest.fn(),
      abort: jest.fn(),
      continue: jest.fn(),
    };

    // Test early return if already handled
    mockRequest.isInterceptResolutionHandled.mockReturnValueOnce(true);
    requestHandler(mockRequest);
    expect(mockRequest.resourceType).not.toHaveBeenCalled();

    // Test blocking images
    mockRequest.resourceType.mockReturnValue('image');
    requestHandler(mockRequest);
    expect(mockRequest.abort).toHaveBeenCalled();
    expect(mockRequest.continue).not.toHaveBeenCalled();

    // Reset mocks
    mockRequest.abort.mockClear();
    mockRequest.continue.mockClear();

    // Test allowing CSS (since CSS is enabled in profile)
    mockRequest.resourceType.mockReturnValue('stylesheet');
    requestHandler(mockRequest);
    expect(mockRequest.abort).not.toHaveBeenCalled();
    expect(mockRequest.continue).toHaveBeenCalled();

    // Reset mocks
    mockRequest.abort.mockClear();
    mockRequest.continue.mockClear();

    // Test blocking CSS (if CSS was disabled)
    const profileNoCss = {
      userAgent: 'Basic Agent',
      capabilities: { javascript: false, images: true, css: false },
    };
    // Clear previous mock.calls on mockPage to get the new requestHandler
    mockPage.on.mockClear();
    await simulator.configurePageForAgent(mockPage, profileNoCss);
    const requestHandlerNoCss = mockPage.on.mock.calls.find((call) => call[0] === 'request')[1];

    mockRequest.abort.mockClear();
    mockRequest.resourceType.mockReturnValue('stylesheet');
    requestHandlerNoCss(mockRequest);
    expect(mockRequest.abort).toHaveBeenCalled();
  });
});
