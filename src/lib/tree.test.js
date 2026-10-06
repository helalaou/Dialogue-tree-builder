import { describe, expect, it } from 'vitest';
import {
  DEFAULT_NODE_TITLE,
  NodeType,
  ROOT_NODE_TITLE,
  TreeImportError,
  addChildNode,
  createInitialTree,
  deleteNode,
  getToggledType,
  parseTree,
  renameNode,
  serializeTree,
  toggleNodeType,
} from './tree';

/** A root bot node with two user replies, the first of which has a bot reply. */
function sampleTree() {
  return [
    {
      title: 'Hi! How can I help you today?',
      superparent: true,
      type: 'BOT',
      expanded: true,
      children: [
        {
          title: 'I want to track my order',
          type: 'USER',
          expanded: true,
          children: [{ title: 'Sure! What is your order number?', type: 'BOT' }],
        },
        { title: "I'd like a refund", type: 'USER' },
      ],
    },
  ];
}

// Paths are flat tree indexes of the visible nodes, as react-sortable-tree
// passes them to generateNodeProps.
const ROOT = [0];
const TRACK_ORDER = [0, 1];
const ORDER_NUMBER = [0, 1, 2];
const REFUND = [0, 3];

describe('createInitialTree', () => {
  it('starts with a single protected bot root', () => {
    expect(createInitialTree()).toEqual([
      { title: ROOT_NODE_TITLE, superparent: true, children: [], type: NodeType.BOT },
    ]);
  });

  it('returns a fresh tree on every call', () => {
    expect(createInitialTree()).not.toBe(createInitialTree());
  });
});

describe('addChildNode', () => {
  it('adds a user turn as the last child of the parent', () => {
    const tree = addChildNode(createInitialTree(), ROOT, DEFAULT_NODE_TITLE);
    expect(tree[0].children).toEqual([{ title: DEFAULT_NODE_TITLE, type: NodeType.USER }]);
  });

  it('expands a collapsed parent so the new node is visible', () => {
    const tree = sampleTree();
    tree[0].children[1].expanded = false;
    const next = addChildNode(tree, REFUND, 'It arrived damaged');
    expect(next[0].children[1]).toMatchObject({
      expanded: true,
      children: [{ title: 'It arrived damaged', type: NodeType.USER }],
    });
  });

  it('does not mutate the original tree', () => {
    const tree = sampleTree();
    addChildNode(tree, TRACK_ORDER, 'new');
    expect(tree).toEqual(sampleTree());
  });
});

describe('deleteNode', () => {
  it('removes a node together with its branch', () => {
    const next = deleteNode(sampleTree(), TRACK_ORDER);
    expect(next[0].children.map((node) => node.title)).toEqual(["I'd like a refund"]);
  });

  it('removes a leaf node', () => {
    const next = deleteNode(sampleTree(), ORDER_NUMBER);
    expect(next[0].children[0].children).toEqual([]);
  });

  it('keeps the root node', () => {
    const tree = sampleTree();
    expect(deleteNode(tree, ROOT)).toBe(tree);
  });
});

describe('renameNode', () => {
  it('changes only the title of the node at the path', () => {
    const next = renameNode(sampleTree(), REFUND, 'Cancel my order');
    expect(next[0].children[1]).toEqual({ title: 'Cancel my order', type: 'USER' });
    expect(next[0].children[0]).toEqual(sampleTree()[0].children[0]);
  });

  it('does not mutate the original tree', () => {
    const tree = sampleTree();
    renameNode(tree, ROOT, 'Hello');
    expect(tree[0].title).toBe('Hi! How can I help you today?');
  });
});

describe('toggleNodeType', () => {
  it('switches a user turn to a bot turn and back', () => {
    const once = toggleNodeType(sampleTree(), REFUND);
    expect(once[0].children[1].type).toBe(NodeType.BOT);
    const twice = toggleNodeType(once, REFUND);
    expect(twice[0].children[1].type).toBe(NodeType.USER);
  });

  it('keeps the type of the root node', () => {
    const tree = sampleTree();
    expect(toggleNodeType(tree, ROOT)).toBe(tree);
  });

  it('turns a node without a type into a user turn', () => {
    expect(getToggledType({ title: 'untyped' })).toBe(NodeType.USER);
  });
});

describe('serializeTree', () => {
  it('exports the tree as a JSON array of nodes', () => {
    const json = serializeTree(sampleTree());
    expect(JSON.parse(json)).toEqual(sampleTree());
  });

  it('keeps the documented node fields', () => {
    const [root] = JSON.parse(serializeTree(sampleTree()));
    expect(Object.keys(root).sort()).toEqual(
      ['children', 'expanded', 'superparent', 'title', 'type'].sort(),
    );
    expect(root.children[1]).toEqual({ title: "I'd like a refund", type: 'USER' });
  });

  it('round-trips through parseTree', () => {
    const tree = addChildNode(sampleTree(), REFUND, 'سلام');
    expect(parseTree(serializeTree(tree))).toEqual(tree);
  });
});

describe('parseTree', () => {
  it('accepts an exported tree', () => {
    expect(parseTree(JSON.stringify(sampleTree()))).toEqual(sampleTree());
  });

  it('accepts nodes without type or children', () => {
    expect(parseTree('[{"title":"Hello"}]')).toEqual([{ title: 'Hello' }]);
  });

  it.each([
    ['text that is not JSON', 'not json', 'The file is not valid JSON.'],
    ['an object instead of a list', '{"title":"Hi"}', 'Expected a list of nodes'],
    ['an empty list', '[]', 'does not contain any nodes'],
    ['a node that is not an object', '[1]', 'Node 1 is not an object.'],
    ['a node without a title', '[{"type":"BOT"}]', 'Node 1 has no text'],
    ['a non-string title', '[{"title":42}]', 'Node 1 has no text'],
    ['an unknown type', '[{"title":"Hi","type":"ROBOT"}]', 'Node 1 has an unknown type'],
    ['children that are not a list', '[{"title":"Hi","children":{}}]', 'not a list'],
    [
      'an invalid nested node',
      '[{"title":"Hi","children":[{"title":"Ok"},{"type":"USER"}]}]',
      'Node 1.2 has no text',
    ],
  ])('rejects %s', (_, text, message) => {
    expect(() => parseTree(text)).toThrow(TreeImportError);
    expect(() => parseTree(text)).toThrow(message);
  });
});
