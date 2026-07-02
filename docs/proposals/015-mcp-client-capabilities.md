# Proposal: MCP Client Capabilities Integration (Sampling, Elicitation, Roots)

## Summary

The Model Context Protocol (MCP) spec defines not just Server Capabilities
(tools, resources, prompts) but also **Client Capabilities** (sampling,
elicitation, roots). These capabilities allow servers to request actions from
the client, such as invoking the client-side LLM (`sampling`), collecting user
input (`elicitation`), or accessing client root directories (`roots`). As
BiModal Design defines MCP integration at Layer 5, the framework must provide
guidance on leveraging Client Capabilities to build truly bi-directional
agent-server interactions.

## Motivation

Currently, BiModal Design documentation focuses primarily on exposing
server-side tools and resources to agents. However, emerging agent workflows
require the server to delegate reasoning or data collection back to the client
application:

1. **Sampling:** A server tool might need the client's LLM to summarize a large
   document before returning a structured result, reducing network overhead.
2. **Elicitation:** A server might need the client to prompt the user for a 2FA
   code or confirmation before executing a sensitive transaction.
3. **Roots:** A local server needs to understand the boundaries of the client's
   workspace to safely operate on local files.

## Proposed Changes

### 1. Update `docs/whitepaper.md`

- Expand the Layer 5 (Agent Protocols) section to include Client Capabilities.
- Explain the shift from uni-directional (Server exposes tools) to
  bi-directional (Server requests client-side LLM sampling and user
  elicitation).

### 2. Update `docs/implementation-guide.md`

- Add a new code pattern demonstrating how an MCP server can use the `sampling`
  capability to invoke the client's LLM for intermediate reasoning.
- Add an example of using the `roots` capability to establish safe operational
  boundaries.

### 3. Create `examples/mcp-client-capabilities.md`

- Provide a concrete example of an MCP server utilizing `sampling` and
  `elicitation` to demonstrate a complete bi-directional flow.

## Example: Server Requesting Client Sampling

```typescript
// Inside a server tool implementation
server.tool(
  'summarize_and_store',
  { text: z.string() },
  async ({ text }, { client }) => {
    // Check if client supports sampling
    if (!client.capabilities?.sampling) {
      throw new Error('Client must support sampling for this tool');
    }

    // Request the client's LLM to summarize the text
    const result = await client.requestSampling({
      messages: [
        {
          role: 'user',
          content: `Please summarize the following text: ${text}`,
        },
      ],
      maxTokens: 100,
    });

    const summary = result.content[0].text;

    // Store the summary in the database
    await db.store(summary);

    return {
      content: [{ type: 'text', text: 'Successfully summarized and stored.' }],
    };
  }
);
```

## Conclusion

Integrating Client Capabilities ensures the BiModal Design framework remains the
definitive standard for advanced MCP integrations, moving beyond basic tool
execution into collaborative agent-server architectures.
