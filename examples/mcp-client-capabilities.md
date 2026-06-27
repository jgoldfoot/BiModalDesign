# MCP Client Capabilities Integration

This example demonstrates how an MCP server can utilize **Client Capabilities**
(sampling and roots) to create a bi-directional workflow.

## Overview

In a standard MCP interaction, the client calls tools exposed by the server.
With Client Capabilities, the server can request operations from the client:

- **Sampling:** The server asks the client's LLM to generate completions (e.g.,
  summarizing data before the server processes it).
- **Roots:** The server asks the client for allowed workspace directories to
  ensure safe file operations.

## Code Example

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

// Initialize the server
const server = new McpServer({
  name: 'advanced-workspace-server',
  version: '1.0.0',
});

// Tool: Analyze File with Client Sampling
server.tool(
  'analyze_local_file',
  { filename: z.string() },
  async ({ filename }, { client }) => {
    // 1. Check Roots Capability
    if (!client.capabilities?.roots) {
      return {
        content: [
          {
            type: 'text',
            text: 'Error: Client must support roots capability to ensure safe access.',
          },
        ],
        isError: true,
      };
    }

    // Get allowed roots from client
    const rootsResult = await client.requestRoots();
    const allowedRoots = rootsResult.roots.map((r) => r.uri);

    // (Verification logic to ensure 'filename' is within allowedRoots would go here)
    const fileContent = 'Simulated long file content that needs analysis...';

    // 2. Check Sampling Capability
    if (!client.capabilities?.sampling) {
      return {
        content: [
          {
            type: 'text',
            text: 'Error: Client must support sampling to analyze the file.',
          },
        ],
        isError: true,
      };
    }

    // Request the client to use its LLM to analyze the file
    const sampleResult = await client.requestSampling({
      messages: [
        {
          role: 'user',
          content: `Please analyze the following file content and extract key entities:\n\n${fileContent}`,
        },
      ],
      maxTokens: 500,
    });

    const analysis = sampleResult.content[0].text;

    return {
      content: [{ type: 'text', text: `Analysis complete:\n${analysis}` }],
    };
  }
);
```

## Architectural Benefits

By leveraging client capabilities, BiModal Design Layer 5 integrations can
offload token-intensive reasoning to the client's foundation model and safely
scope operations to client-defined boundaries.
