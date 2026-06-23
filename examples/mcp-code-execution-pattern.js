/**
 * Pattern: MCP Code Execution for Context Efficiency
 *
 * This example demonstrates how an agent can interact with an MCP server
 * using a code execution environment rather than direct tool calls.
 * By writing a script that fetches and filters a large dataset,
 * the agent prevents the entire dataset from entering its context window,
 * significantly reducing latency and token costs (up to 98.7% reduction).
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

// Mock large dataset (e.g., 10,000 rows in reality)
const mockDatabase = Array.from({ length: 1000 }, (_, i) => ({
  id: `USR-${i}`,
  status: i % 10 === 0 ? 'pending' : 'active',
  email: `user${i}@example.com`,
  score: Math.floor(Math.random() * 100),
}));

const server = new Server(
  {
    name: 'enterprise-data-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// We define tools that return large datasets.
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_users',
        description: 'Retrieves all user records. Returns a massive dataset.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'search_tools',
        description: 'Search for available tool definitions for progressive disclosure.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string' },
          },
          required: ['query'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'get_users') {
    // Instead of the agent calling this directly and loading all users into context,
    // the agent writes a script (like below) to call this and filter it in the sandbox.
    return { content: [{ type: 'text', text: JSON.stringify(mockDatabase) }] };
  }

  if (request.params.name === 'search_tools') {
    return { content: [{ type: 'text', text: 'Tool: get_users - Retrieves user records.' }] };
  }

  throw new Error('Tool not found');
});

// START: Example Agent Script (Executed in a sandbox, NOT in the LLM context)
/*
  The agent writes and executes the following code in its secure VM:

  ```javascript
  const usersJson = await callMCPTool('enterprise-data-server', 'get_users', {});
  const allUsers = JSON.parse(usersJson.content[0].text);

  // Filter the massive dataset locally in the execution environment
  const pendingUsers = allUsers.filter(u => u.status === 'pending');

  // Only the final, small insight is printed to stdout and returned to the LLM
  console.log(`Found ${pendingUsers.length} pending users.`);
  console.log(JSON.stringify(pendingUsers.slice(0, 5)));
  ```
*/
// END: Example Agent Script

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Server is running and listening on stdio
}

// Ensure the module is not executed automatically if imported elsewhere
if (typeof require !== 'undefined' && require.main === module) {
  main().catch(console.error);
} else if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
