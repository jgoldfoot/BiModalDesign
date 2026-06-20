# Pattern: Secure Desktop Agent Execution via Local MCP

This example demonstrates how to structure a Model Context Protocol (MCP) server
designed to be run locally, interfacing safely with sandboxed desktop agents
like Claude Cowork.

## Core Principle: Folder-Scoped Access

Desktop agents should not have blanket filesystem access. Instead, the local MCP
server defines strict boundaries.

```javascript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import path from 'path';
import fs from 'fs/promises';

// Only allow access within a specific designated folder
const ALLOWED_DIRECTORY =
  process.env.AGENT_WORKSPACE || path.join(process.cwd(), 'agent-workspace');

// Helper to ensure paths stay within the allowed directory
function resolveSafePath(requestedPath) {
  const resolved = path.resolve(ALLOWED_DIRECTORY, requestedPath);
  // Compare against the directory + separator so a sibling like
  // "/workspace-evil" can't slip past a naive prefix check on "/workspace".
  const root = ALLOWED_DIRECTORY.endsWith(path.sep)
    ? ALLOWED_DIRECTORY
    : ALLOWED_DIRECTORY + path.sep;
  if (resolved !== ALLOWED_DIRECTORY && !resolved.startsWith(root)) {
    throw new Error(
      'Access Denied: Path is outside the allowed agent workspace.'
    );
  }
  return resolved;
}

const server = new Server(
  {
    name: 'secure-local-filesystem',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'read_file',
        description: 'Read a file from the allowed agent workspace.',
        inputSchema: {
          type: 'object',
          properties: {
            filePath: {
              type: 'string',
              description: 'Path relative to workspace.',
            },
          },
          required: ['filePath'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'read_file') {
    const safePath = resolveSafePath(request.params.arguments.filePath);
    const content = await fs.readFile(safePath, 'utf-8');
    return { content: [{ type: 'text', text: content }] };
  }
  throw new Error('Tool not found');
});

const transport = new StdioServerTransport();
await server.connect(transport);
```
