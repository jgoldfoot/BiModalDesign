const AgentSimulator = require('../tools/agent-simulator');

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
                        issues: []
                    },
                    'find-contact': {
                        taskDescription: 'Locate contact information',
                        success: false,
                        elementsFound: [],
                        issues: ['Selector failed: timeout']
                    }
                }
            }
        };

        const expectedReport = `# Agent Simulation Report\n\n` +
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
                    'find-contact': { basic: false, advanced: true }
                },
                accessibilityScores: {
                    basic: 60,
                    advanced: 95
                },
                recommendations: [
                    'Basic agents struggling - implement FR-1',
                    'Large gap between basic and advanced agents'
                ]
            }
        };

        const expectedReport = `# Agent Simulation Report\n\n` +
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
                    'extract-content': { basic: true, advanced: true }
                },
                accessibilityScores: {
                    basic: 90,
                    advanced: 95
                },
                recommendations: []
            }
        };

        const expectedReport = `# Agent Simulation Report\n\n` +
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
