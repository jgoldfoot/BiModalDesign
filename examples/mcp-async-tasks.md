# MCP Async Tasks and Temporal Efficiency (Pattern 10)

This example demonstrates how to implement the `Tasks` primitive introduced in
the November 2025 Model Context Protocol (MCP) specification.

Benchmarks like **OSWorld-Human** have revealed that agents experience extreme
end-to-end latency when forced to execute numerous, granular, synchronous steps
to achieve a goal. To mitigate this and improve temporal efficiency, complex
operations should be exposed as asynchronous "Macro Actions" via MCP Tasks.

## Key Concepts Demonstrated

1. **Async Execution**: Defining a task that does not block the agent's main
   execution loop.
2. **Progress Reporting**: Using the `progress` callback to keep the agent
   informed of long-running states.
3. **Temporal Efficiency**: Collapsing what would be 50+ individual DOM
   interactions into a single, declarative task initiation.

## Example Implementation

```javascript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

// Initialize the server with async task support
const server = new McpServer({
  name: 'enterprise-reporting-agent',
  version: '2.1.0',
});

/**
 * Exposing a long-running workflow as a Task.
 * This prevents the agent from having to navigate a complex reporting UI,
 * set 10 different filters, and wait for a synchronous timeout.
 */
server.task(
  'generate_comprehensive_audit',
  {
    startDate: z.string(),
    endDate: z.string(),
    departments: z.array(z.string()),
  },
  async ({ startDate, endDate, departments }, { progress }) => {
    progress.report(10, 'Initiating audit query across departments...');

    // Simulate long running database aggregations
    await new Promise((resolve) => setTimeout(resolve, 2000));
    progress.report(40, 'Aggregating financial records...');

    await new Promise((resolve) => setTimeout(resolve, 3000));
    progress.report(70, 'Compiling compliance violations...');

    await new Promise((resolve) => setTimeout(resolve, 2000));
    progress.report(100, 'Audit generation complete.');

    return {
      status: 'complete',
      content: [
        {
          type: 'text',
          text: `Audit complete for ${departments.join(', ')} from ${startDate} to ${endDate}. Found 3 actionable insights.`,
        },
      ],
      artifacts: [
        {
          type: 'application/pdf',
          url: 'https://api.example.com/reports/audit-789.pdf',
        },
      ],
    };
  }
);

// Start the server (stdio transport for local agents, SSE for remote)
server.start();
```

## Why This Works for Agents

- **Latency Reduction**: The agent sends one payload and can move on to other
  reasoning tasks, dramatically reducing end-to-end task time.
- **Reliability**: Eliminates the risk of an agent timing out while waiting for
  a synchronous RPC call to complete.
- **UX Alignment**: Matches the way humans offload long-running tasks to
  background jobs rather than staring at a loading spinner.
