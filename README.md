<p align="center">
  <img src="public/android-icon-192x192.png" alt="Dialogue Tree Builder" width="96" height="96" />
</p>

<h1 align="center">Dialogue Tree Builder</h1>

<p align="center">
  Sketch branching chatbot conversations as a tree of bot and user turns,<br />
  right in the browser, and export them as JSON.
</p>

<p align="center">
  <a href="https://github.com/helalaou/Dialogue-tree-builder/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/helalaou/Dialogue-tree-builder/actions/workflows/ci.yml/badge.svg" /></a>
  <a href="License.md"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-4f46e5.svg" /></a>
  <a href="https://doi.org/10.1007/978-3-031-79164-2_7"><img alt="DOI" src="https://img.shields.io/badge/DOI-10.1007%2F978--3--031--79164--2__7-blue.svg" /></a>
  <img alt="React 19" src="https://img.shields.io/badge/React-19-149eca.svg" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646cff.svg" />
</p>

<p align="center">
  <img src="docs/assets/screenshot-tree.png" alt="A customer-support dialogue tree with bot and user turns" width="880" />
</p>

## Overview

Dialogue Tree Builder is a small single-page React app for mapping out the conversations a chatbot
should handle. Each node in the tree is one turn, marked as either a **bot** message or a **user**
message, and each branch is a different way the conversation can go. The result can be exported as
a JSON file and used as structured data when building or training a chatbot.

The tool was built for
[*DarijaGenie*](https://doi.org/10.1007/978-3-031-79164-2_7) (see [Citation](#citation)), a
framework for building task-based conversational tutors for low-resource languages. DarijaGenie
was evaluated on Moroccan Arabic (Darija), a mostly spoken dialect with little standardized
spelling and almost no structured learning material, as a deliberately hard test case: an approach
that works there should carry over to other under-resourced languages. Dialogue Tree Builder is how
the tutor's scenario dialogues were authored, and it works the same way for any language.

Everything runs in the browser. There is no backend and no account: the tree lives in memory
while you work, and you save it by exporting it to a file.

## Features

|                         |                                                                                                                                   |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Bot and user turns**  | Every node is tagged `BOT` (🤖) or `USER` (🧑🏻). Click the icon to switch a node between the two.                                    |
| **Branching replies**   | **Add** creates a child under any node, so one bot message can lead to several possible user replies and vice versa.             |
| **Inline editing**      | Click a node's text to edit it in place, then press <kbd>Enter</kbd> to save.                                                      |
| **Drag and drop**       | Grab a node by its handle to reorder it or move it, with its whole branch, under a different parent. Branches can be collapsed. |
| **Delete branches**     | **Delete** removes a node together with everything below it.                                                                      |
| **Protected root**      | The conversation's opening bot message cannot be deleted, dragged or turned into a user turn.                                     |
| **JSON export**         | **Export JSON** downloads the whole tree as `data.json`.                                                                          |
| **JSON import**         | **Import JSON** loads a previously exported file so you can keep working on it. Invalid files are rejected with a message.       |

<p align="center">
  <img src="docs/assets/screenshot-editing.png" alt="Editing a user reply inline" width="720" />
</p>

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org) 20.19 or newer (CI tests Node 20 and 22) and npm

### Install and run

```bash
git clone https://github.com/helalaou/Dialogue-tree-builder.git
cd Dialogue-tree-builder
npm ci
npm run dev
```

The development server runs at <http://localhost:5173>.

### Build for production

```bash
npm run build
```

The static site is written to `dist/` and can be served by any static host. Run `npm run preview`
to serve the production build locally.

## Usage

1. The tree starts with a single bot node. Click its text to write the bot's opening message.
2. Click **Add** on a node to create a reply under it. New nodes start as user turns and reuse the
   text of the node you last clicked or edited, so click them to rename.
3. Click 🤖 / 🧑🏻 to switch a node between bot and user.
4. Drag nodes by their handle to restructure the conversation.
5. Click **Export JSON** to save your work, and **Import JSON** to load it again later.

The editor is designed for desktop browsers but works on phones too: on narrow screens the Export
and Import buttons sit in their own row above the tree, and the tree scrolls sideways to reach long
or deeply nested messages.

If an imported file is not valid JSON or does not have the format below, the editor says what is
wrong (for example, `Node 1.2 has no text`) and keeps the current tree.

## JSON format

The exported file is the tree as an array of nodes. Each node has a `title` (the message text), a
`type` (`BOT` or `USER`) and an optional `children` array. The root node is marked with
`"superparent": true`, and `expanded` records whether a branch was open in the editor.

```json
[
  {
    "title": "Hi! How can I help you today?",
    "superparent": true,
    "type": "BOT",
    "expanded": true,
    "children": [
      {
        "title": "Can I talk to a person?",
        "type": "USER",
        "expanded": true,
        "children": [
          {
            "title": "Of course, connecting you with an agent.",
            "type": "BOT"
          }
        ]
      }
    ]
  }
]
```

## Scripts

| Command                | Description                                 |
| ---------------------- | ------------------------------------------- |
| `npm run dev`          | Development server with hot reload          |
| `npm run build`        | Production build into `dist/`               |
| `npm run preview`      | Serve the production build locally          |
| `npm run lint`         | Lint with ESLint                            |
| `npm run format`       | Format the code with Prettier               |
| `npm run format:check` | Check formatting without changing files     |
| `npm test`             | Run the unit tests once with Vitest         |
| `npm run test:watch`   | Run the unit tests in watch mode            |

## Project structure

```
├── index.html                 HTML entry point
├── public/                    web manifest and app icons
├── src/
│   ├── components/
│   │   ├── DialogueTree.jsx   tree editor: state, import and export
│   │   ├── DialogueTree.css   editor layout and node button styles
│   │   ├── NodeActions.jsx    Add, Delete and bot/user buttons of a node
│   │   ├── NodeTitle.jsx      node text with inline editing
│   │   └── Toolbar.jsx        Export JSON and Import JSON buttons
│   ├── lib/
│   │   ├── tree.js            pure tree operations, export and import validation
│   │   ├── tree.test.js       unit tests for the tree operations
│   │   └── download.js        file download helper
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
└── docs/assets/               README screenshots
```

The tree editor is built on
[@nosferatu500/react-sortable-tree](https://github.com/nosferatu500/react-sortable-tree), the
maintained fork of react-sortable-tree, and bundled with [Vite](https://vite.dev).

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) for the development workflow,
and follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Citation

If you use this tool in your research, please cite:

```bibtex
@incollection{elalaoui2025darijagenie,
  title     = {DarijaGenie: Learning Moroccan Arabic Through a Multimodal Chatbot},
  author    = {El Alaoui, Hamza and Cavalli-Sforza, Violetta},
  series    = {Communications in Computer and Information Science},
  publisher = {Springer},
  pages     = {74--89},
  year      = {2025},
  doi       = {10.1007/978-3-031-79164-2_7}
}
```

## License

Released under the [MIT License](License.md).
