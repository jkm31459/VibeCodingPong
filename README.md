# Pong

Minimal Pong game. Contains a simple browser-based implementation (script.js) and tooling stubs for TypeScript, linting, formatting and tests.

Quick start (Windows)
1. Open the integrated terminal in VS Code (Ctrl+`).
2. Install dev tools:
   PowerShell:
   npm ci
   or
   npm install --save-dev typescript live-server eslint prettier jest ts-jest @types/jest rimraf
3. Dev / run:
   - Serve files: `npm run dev` (starts live-server serving the repo root)
   - Build (if converting to TypeScript): `npm run build`
   - Run tests: `npm test`
   - Lint & format: `npm run lint`, `npm run format`

Suggested next steps
- Convert script.js to TypeScript under src/ and update imports.
- Add unit tests for core game logic (collision, scoring).
- Add ESLint/Prettier configs and a GitHub Actions workflow.

Project layout
- index.html
- script.js         (current game)
- assets/           (images/sounds)
- src/              (if migrating to TypeScript)
- tests/            (unit tests)

License
- Add a LICENSE file (e.g. MIT) if you plan to publish.