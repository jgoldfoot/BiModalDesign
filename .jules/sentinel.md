## 2026-05-25 - Dependency Compatibility Breaking CI
**Vulnerability:** Jest 30.x and ESLint 9+ drop support for Node 16.x, causing CI test failures on `node-version: 16.x` environments.
**Learning:** Tools upgrading their major versions often drop support for older Node runtimes.
**Prevention:** In `package.json`, carefully align devDependencies with the lowest supported Node.js version stated in the `engines` field (`>=16.0.0`). Always set bounds (e.g., `^29.x` instead of `^30.x`) when upgrading tooling in libraries maintaining backwards compatibility.
