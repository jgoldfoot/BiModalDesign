# MCP Async Tasks and Temporal Efficiency (Pattern 10)

This example demonstrates the `Tasks` primitive introduced in the 2025-11-25
Model Context Protocol (MCP) specification.

**Status: experimental.** Tasks shipped as an experimental feature in the
2025-11-25 spec (SEP-1686). The API may change in future protocol versions, and
the 2026 roadmap already flags open lifecycle questions (retry semantics,
result-retention/expiry). Pin to the 2025-11-25 spec version and treat the
surface below as subject to revision.

Benchmarks like **OSWorld-Human** (arXiv:2506.16042) show that computer-use
agents lose most of their time to end-to-end latency, with even top performers
taking 1.4-2.7x more steps than a human reference trajectory. Long synchronous
tool calls make this worse: the agent blocks, and the transport risks timing out
before the work finishes.

## How Tasks actually work

Tasks are not a new kind of tool you register. They are an augmentation of
existing requests that enables a "call-now, fetch-later" flow:

1. The client sends a normal `tools/call`, augmented with a `task` (it signals
   "this may take a while").
2. The server creates a task, stores its state, starts the work in the
   background, and immediately returns a task handle (`{ task }`) instead of a
   result.
3. The client polls `tasks/get` to read status, which moves through `working` ->
   `input_required` -> `completed` / `failed` / `cancelled`.
4. Once the task is terminal, the client calls `tasks/result` to retrieve the
   `CallToolResult`.

The server opts in by declaring the `tasks` capability and marking the tool as
task-augmentable via its `execution` field. Task state is persisted through a
`TaskStore`; the SDK ships `InMemoryTaskStore` for reference. Use a durable
store (Redis, Postgres, an external job API) in production.

## Example Implementation

```typescript
import { randomUUID } from 'node:crypto';

import { createMcpExpressApp } from '@modelcontextprotocol/express';
import { NodeStreamableHTTPServerTransport } from '@modelcontextprotocol/node';
import {
  InMemoryTaskStore,
  isTerminal,
  Server,
} from '@modelcontextprotocol/server';
import type {
  CallToolResult,
  CreateTaskOptions,
  CreateTaskResult,
  GetTaskPayloadResult,
  GetTaskResult,
  Tool,
} from '@modelcontextprotocol/server';

// Persists task metadata and results. Swap for a durable store in production.
const taskStore = new InMemoryTaskStore();

// Your long-running work. Replace with real aggregation/analysis.
async function runAudit(args: {
  startDate: string;
  endDate: string;
  departments: string[];
}): Promise<{ summary: string }> {
  // ...expensive cross-department aggregation...
  return {
    summary:
      `Audit complete for ${args.departments.join(', ')} from ` +
      `${args.startDate} to ${args.endDate}. Found 3 actionable insights.`,
  };
}

function createServer(): Server {
  const server = new Server(
    { name: 'enterprise-reporting-agent', version: '2.1.0' },
    {
      capabilities: {
        tools: {},
        // Declare task support so clients know they may augment calls.
        tasks: { requests: { tools: { call: {} } } },
      },
    }
  );

  // Advertise the tool and mark it task-augmentable.
  // 'required' forces task mode; use 'optional' to also allow sync calls.
  server.setRequestHandler(
    'tools/list',
    async (): Promise<{ tools: Tool[] }> => ({
      tools: [
        {
          name: 'generate_comprehensive_audit',
          description:
            'Runs a long audit across departments and returns a report',
          inputSchema: {
            type: 'object',
            properties: {
              startDate: { type: 'string' },
              endDate: { type: 'string' },
              departments: { type: 'array', items: { type: 'string' } },
            },
            required: ['startDate', 'endDate', 'departments'],
          },
          execution: { taskSupport: 'required' },
        },
      ],
    })
  );

  // tools/call: create the task, return its handle now, run work in background.
  server.setRequestHandler(
    'tools/call',
    async (request, ctx): Promise<CallToolResult | CreateTaskResult> => {
      const { name, arguments: args } = request.params;
      const taskParams = (request.params._meta?.task ?? request.params.task) as
        | { ttl?: number; pollInterval?: number }
        | undefined;

      if (name !== 'generate_comprehensive_audit') {
        throw new Error(`Unknown tool: ${name}`);
      }
      if (!taskParams) {
        // This tool is task-only; reject a plain synchronous call.
        throw new Error(`Tool ${name} requires task mode`);
      }

      const options: CreateTaskOptions = {
        ttl: taskParams.ttl,
        pollInterval: taskParams.pollInterval ?? 2000,
      };
      const task = await taskStore.createTask(
        options,
        ctx.mcpReq.id,
        request,
        ctx.sessionId
      );

      // Run in the background. Do NOT await before returning the handle.
      void (async () => {
        try {
          await taskStore.updateTaskStatus(
            task.taskId,
            'working',
            'Aggregating records...'
          );
          const report = await runAudit(args as Parameters<typeof runAudit>[0]);
          const result: CallToolResult = {
            content: [{ type: 'text', text: report.summary }],
          };
          await taskStore.storeTaskResult(task.taskId, 'completed', result);
        } catch (error) {
          await taskStore.storeTaskResult(task.taskId, 'failed', {
            content: [{ type: 'text', text: `Audit failed: ${String(error)}` }],
            isError: true,
          });
        }
      })();

      // Immediate response: the task handle, not the result.
      return { task };
    }
  );

  // tasks/get: report current status so the client can poll.
  server.setRequestHandler(
    'tasks/get',
    async (request): Promise<GetTaskResult> => {
      const task = await taskStore.getTask(request.params.taskId);
      if (!task) throw new Error(`Task ${request.params.taskId} not found`);
      return task;
    }
  );

  // tasks/result: return the stored result once the task is terminal.
  server.setRequestHandler(
    'tasks/result',
    async (request): Promise<GetTaskPayloadResult> => {
      const { taskId } = request.params;
      const task = await taskStore.getTask(taskId);
      if (!task) throw new Error(`Task ${taskId} not found`);
      if (!isTerminal(task.status)) {
        throw new Error(
          `Task ${taskId} is ${task.status}; poll tasks/get until terminal`
        );
      }
      return taskStore.getTaskResult(taskId);
    }
  );

  return server;
}

// --- Standard Streamable HTTP transport + per-session wiring ---
// (Boilerplate shared by every MCP server; see the SDK's
// simpleStreamableHttp.ts for the fully hardened version.)
const app = createMcpExpressApp();
const transports: Record<string, NodeStreamableHTTPServerTransport> = {};

app.post('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  let transport = sessionId ? transports[sessionId] : undefined;

  if (!transport) {
    transport = new NodeStreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sid) => {
        transports[sid] = transport!;
      },
    });
    await createServer().connect(transport);
  }

  await transport.handleRequest(req, res, req.body);
});

app.listen(8000, () => {
  console.log('MCP server on http://localhost:8000/mcp');
});
```

## Why This Works for Agents

- **Latency reduction**: the agent fires one request, gets a handle, and is free
  to reason about other work while the task runs.
- **Reliability**: no hanging connection or synchronous RPC timeout while a
  multi-minute job completes.
- **UX alignment**: mirrors how humans offload long jobs to the background
  instead of watching a spinner.

## Notes and caveats

- **Experimental surface.** `Server`, the `tasks` capability shape, and the
  `tasks/*` handlers may change. The SDK also offers a higher-level helper,
  `server.experimental.tasks.registerToolTask(...)`, documented in the MCP
  TypeScript SDK server guide. It is likewise experimental.
- **Durable storage.** `InMemoryTaskStore` loses all tasks on restart. Back
  tasks with persistent storage if results must survive a deploy.
- **In-call progress is a different mechanism.** If you only need progress
  updates within a single synchronous call (not deferred retrieval), use a
  `progressToken` from the request `_meta` and emit `notifications/progress`,
  rather than a task.
