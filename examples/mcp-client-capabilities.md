# MCP Client Capabilities Integration

This example demonstrates how an MCP server can use **client capabilities**
(sampling and roots) to create a bi-directional workflow.

## Overview

In a standard MCP interaction, the client calls tools exposed by the server.
With client capabilities, the server can issue requests _back_ to the client
during a tool call:

- **Sampling:** the server asks the client's LLM to generate a completion (e.g.,
  summarizing data before the server processes it).
- **Roots:** the server asks the client for its allowed workspace directories so
  it can scope file operations safely.
- **Elicitation:** the server asks the client to collect input from the user
  (e.g., a confirmation or 2FA code) — see the note below.

> **Client support varies.** Sampling, roots, and elicitation are optional
> client capabilities. Always check `getClientCapabilities()` before calling
> them, and degrade gracefully when a client doesn't advertise them. Method
> names follow the `@modelcontextprotocol/sdk` server API; pin your SDK version.

## Code Example

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'advanced-workspace-server',
  version: '1.0.0',
});

// A server issues requests back to the client through its underlying
// connection, exposed as `server.server`.
server.tool(
  'analyze_local_file',
  { filename: z.string() },
  async ({ filename }) => {
    const caps = server.server.getClientCapabilities();

    // 1. Roots — discover the client's allowed workspace directories.
    if (!caps?.roots) {
      return {
        content: [
          {
            type: 'text',
            text: 'Error: client must support the roots capability for safe file access.',
          },
        ],
        isError: true,
      };
    }

    const { roots } = await server.server.listRoots();
    const allowedRoots = roots.map((r) => r.uri);
    // (Verify `filename` resolves within one of allowedRoots before reading it.)
    void allowedRoots;
    const fileContent = 'Simulated long file content that needs analysis...';

    // 2. Sampling — offload token-heavy reasoning to the client's LLM.
    if (!caps?.sampling) {
      return {
        content: [
          {
            type: 'text',
            text: 'Error: client must support the sampling capability to analyze the file.',
          },
        ],
        isError: true,
      };
    }

    const result = await server.server.createMessage({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Analyze this file content and extract key entities:\n\n${fileContent}`,
          },
        },
      ],
      maxTokens: 500,
    });

    const analysis = result.content.type === 'text' ? result.content.text : '';

    return {
      content: [{ type: 'text', text: `Analysis complete:\n${analysis}` }],
    };
  }
);
```

## Elicitation (collecting user input)

When a server needs input from the user mid-task — a confirmation, or a code for
a sensitive action — it uses elicitation rather than sampling:

```typescript
const elicit = await server.server.elicitInput({
  message: 'Enter the 2FA code to authorize this transaction:',
  requestedSchema: {
    type: 'object',
    properties: { code: { type: 'string' } },
    required: ['code'],
  },
});
// elicit.action is 'accept' | 'decline' | 'cancel'; on accept, read elicit.content.
```

## Architectural Benefits

By leveraging client capabilities, BiModal Design Layer 5 integrations can
offload token-intensive reasoning to the client's foundation model, keep large
intermediate data out of the model's context, and scope operations to
client-defined boundaries.
