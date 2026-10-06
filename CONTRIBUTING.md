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
   npm run dev
   ```

   The app runs at <http://localhost:5173>.

You need Node.js 20.19 or newer.

## Before opening a pull request

Run the same checks as CI and make sure they pass:

```bash
npm run lint
npm run format:check
npm test
npm run build
```

`npm run format` fixes formatting. Changes to the tree operations in `src/lib/tree.js` should come
with unit tests in `src/lib/tree.test.js`.

Then try your change in the browser: build a small tree, edit a few nodes, and confirm that
**Export JSON** and **Import JSON** still round-trip correctly.

## Guidelines

- **Keep changes focused.** One feature or fix per pull request, with a short description of the
  problem and the approach.
- **Commit messages** follow [Conventional Commits](https://www.conventionalcommits.org):
  `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, `ci:`, `build:`.
- **Keep the JSON format stable.** Exported files are meant to be consumed by other tools. If a
  change alters the shape of the exported data, call it out clearly in the pull request.
- **Formatting** is handled by Prettier (see `.prettierrc.json`) and [`.editorconfig`](.editorconfig).

## Reporting bugs and requesting features

Use the [issue templates](https://github.com/helalaou/Dialogue-tree-builder/issues/new/choose).
For bugs, include steps to reproduce, what you expected, and your browser and device.

By participating in this project you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
