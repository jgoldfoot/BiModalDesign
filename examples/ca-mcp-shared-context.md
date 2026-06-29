```javascript
/**
 * BiModal Design Example: Context-Aware MCP (CA-MCP) Shared Context Store
 *
 * Demonstrates a stateful MCP pattern where intermediate tool results
 * are written to a Shared Context Store (SCS) rather than returned
 * directly to the LLM context, reducing token usage for long-horizon tasks.
 */
class SharedContextStore {
  constructor() {
    this.store = new Map();
  }

  write(key, value) {
    this.store.set(key, value);
    return `Context updated for key: ${key}`;
  }

  read(key) {
    return this.store.get(key) || null;
  }
}

const scs = new SharedContextStore();

// Example MCP Tool Registration
const tools = [
  {
    name: 'fetch_enterprise_dataset',
    description:
      'Fetches a massive dataset and writes it to the Shared Context Store without returning it to the LLM.',
    execute: async (params) => {
      // Simulate fetching 100,000 rows
      const datasetId = `dataset_${Date.now()}`;
      const mockData = Array.from({ length: 100000 }, (_, i) => ({
        id: i,
        value: Math.random(),
      }));
      scs.write(datasetId, mockData);

      // Return a reference to the LLM, not the data
      return `Dataset fetched and stored in SCS with ID: ${datasetId}. Pass this ID to analytical tools.`;
    },
  },
  {
    name: 'analyze_dataset_from_context',
    description:
      'Reads a dataset from the Shared Context Store and returns only the summarized insights.',
    execute: async (params) => {
      const data = scs.read(params.datasetId);
      if (!data)
        return `Error: Dataset ${params.datasetId} not found in Context Store.`;

      // Perform analysis Server-Side
      const average =
        data.reduce((acc, curr) => acc + curr.value, 0) / data.length;

      // Return only the insight to the LLM
      return `Analysis complete. The average value is ${average.toFixed(4)}.`;
    },
  },
];
```
