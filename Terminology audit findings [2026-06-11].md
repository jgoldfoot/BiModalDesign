# Terminology audit findings [2026-06-11]

During a brand and terminology consistency sweep, some ambiguous cases were found that require human decision:

1. **CHANGELOG.md**
   - Line 118: `[3.0.0]: https://github.com/jgoldfoot/BiModalDesign/compare/v0.1.0...v3.0.0`
   - Line 120: `[0.1.0]: https://github.com/jgoldfoot/BiModalDesign/releases/tag/v0.1.0`
   - *Reason for flagging:* These contain pre-v2.0 version references (`v0.1.0`), but they are in historical CHANGELOG entries.

2. **docs/case-studies.md**
   - Line 582: `<h1 data-agent-content="api-title">CloudProject API v1.0</h1>`
   - *Reason for flagging:* Matches pre-v2.0 pattern (`v1.0`), but likely refers to a mock API version rather than the BiModal Design framework version.
