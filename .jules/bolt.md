## 2024-05-24 - Async Concurrency vs Sequential I/O Awaits in Agent Simulators

**Learning:** Sequential `await` in loops (`for...of`) simulating independent
multi-agent scenarios create unnecessary bottlenecks. The performance cost is
strictly additive (O(n)), increasing load times proportionally with every new
agent tested. **Action:** Always identify independent, I/O-bound simulation
processes and decouple them using `Promise.all` with `Array.prototype.map()`.
This enforces concurrency, shifting performance cost to the slowest single
promise rather than the sum of all tasks.

## 2024-05-25 - Async Concurrency in CLI commands

**Learning:** Sequential await calls for independent processes, like
`ComplianceAuditor.auditPage` and `AgentSimulator.runMultiAgentTest`,
artificially increase response times. **Action:** Used `Promise.all` to
destructure and execute multiple asynchronous promises concurrently.
