# Contributing to Dialogue Tree Builder

Thanks for your interest in improving Dialogue Tree Builder. This guide covers the development
workflow and the conventions the project follows.

## Development setup

1. Fork and clone the repository, then install dependencies:

   ```bash
   npm ci
   ```

2. Start the development server:

   ```bash
   npm start
   ```

   The app opens at <http://localhost:3000>.

The project uses `react-scripts` 3, which relies on webpack 4. On Node.js 17 or newer, set
`NODE_OPTIONS=--openssl-legacy-provider` before running `npm start` or `npm run build`
(see the [README](README.md#getting-started)).

## Before opening a pull request

Run the same check as CI and make sure it passes:

```bash
npm run build
```

Then try your change in the browser: build a small tree, edit a few nodes, and confirm that
**Export JSON** and **Import JSON** still round-trip correctly.

## Guidelines

- **Keep changes focused.** One feature or fix per pull request, with a short description of the
  problem and the approach.
- **Commit messages** follow [Conventional Commits](https://www.conventionalcommits.org):
  `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, `ci:`, `build:`.
- **Keep the JSON format stable.** Exported files are meant to be consumed by other tools. If a
  change alters the shape of the exported data, call it out clearly in the pull request.
- **Formatting** follows [`.editorconfig`](.editorconfig).

## Reporting bugs and requesting features

Use the [issue templates](https://github.com/helalaou/Dialogue-tree-builder/issues/new/choose).
For bugs, include steps to reproduce, what you expected, and your browser and device.

By participating in this project you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
