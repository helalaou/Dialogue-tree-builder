/**
 * Pure helpers for reading and updating the dialogue tree.
 *
 * The tree is the array format used by react-sortable-tree: every node has a
 * `title`, a `type` (`BOT` or `USER`) and an optional `children` array. The
 * root node of a new conversation is flagged with `superparent: true` and is
 * protected from deletion, dragging and type changes.
 *
 * Every helper returns a new tree and never mutates its input.
 */
import {
  addNodeUnderParent,
  changeNodeAtPath,
  getNodeAtPath,
  removeNodeAtPath,
} from '@nosferatu500/react-sortable-tree';

/**
 * @typedef {'BOT' | 'USER'} NodeType
 *
 * @typedef {object} DialogueNode
 * @property {string} title Message text of the turn.
 * @property {NodeType} [type] Who speaks this turn.
 * @property {boolean} [superparent] Marks the protected root node.
 * @property {boolean} [expanded] Whether the branch is open in the editor.
 * @property {DialogueNode[]} [children] Possible next turns.
 *
 * @typedef {Array<number>} NodePath Tree indexes from the root to a node.
 */

/** Speaker types a node can have. */
export const NodeType = Object.freeze({ BOT: 'BOT', USER: 'USER' });

/** Text used for new nodes until a node has been clicked or edited. */
export const DEFAULT_NODE_TITLE = 'default';

/** Opening message of a new conversation ("hello" in Darija). */
export const ROOT_NODE_TITLE = 'سلام';

/**
 * Node keys are the nodes' flat tree indexes, matching the paths that
 * react-sortable-tree passes to `generateNodeProps`.
 *
 * @param {{ treeIndex: number }} params
 * @returns {number}
 */
export const getNodeKey = ({ treeIndex }) => treeIndex;

/**
 * Builds the tree a new conversation starts with: a single bot root node.
 *
 * @returns {DialogueNode[]}
 */
export function createInitialTree() {
  return [{ title: ROOT_NODE_TITLE, superparent: true, children: [], type: NodeType.BOT }];
}

/**
 * Whether a node is the protected root of the conversation.
 *
 * @param {DialogueNode} node
 * @returns {boolean}
 */
export function isRootNode(node) {
  return node.superparent === true;
}

/**
 * Adds a new user turn as the last child of the node at `parentPath` and
 * expands the parent so the new node is visible.
 *
 * @param {DialogueNode[]} treeData
 * @param {NodePath} parentPath
 * @param {string} title Text of the new node.
 * @returns {DialogueNode[]}
 */
export function addChildNode(treeData, parentPath, title) {
  return addNodeUnderParent({
    treeData,
    parentKey: parentPath[parentPath.length - 1],
    expandParent: true,
    getNodeKey,
    newNode: { title, type: NodeType.USER },
  }).treeData;
}

/**
 * Replaces the text of the node at `path`.
 *
 * @param {DialogueNode[]} treeData
 * @param {NodePath} path
 * @param {string} title
 * @returns {DialogueNode[]}
 */
export function renameNode(treeData, path, title) {
  return changeNodeAtPath({
    treeData,
    path,
    getNodeKey,
    newNode: ({ node }) => ({ ...node, title }),
  });
}

/**
 * Returns the type a node switches to when its speaker icon is clicked.
 * Bot turns become user turns and everything else becomes a bot turn, except
 * that a node without a type becomes a user turn.
 *
 * @param {DialogueNode} node
 * @returns {NodeType}
 */
export function getToggledType(node) {
  return node.type === NodeType.BOT || node.type === undefined ? NodeType.USER : NodeType.BOT;
}

/**
 * Switches the node at `path` between bot and user. The root node keeps its
 * type, so the tree is returned unchanged for it.
 *
 * @param {DialogueNode[]} treeData
 * @param {NodePath} path
 * @returns {DialogueNode[]}
 */
export function toggleNodeType(treeData, path) {
  const node = getNode(treeData, path);
  if (!node || isRootNode(node)) return treeData;
  return changeNodeAtPath({
    treeData,
    path,
    getNodeKey,
    newNode: { ...node, type: getToggledType(node) },
  });
}

/**
 * Removes the node at `path` together with its whole branch. The root node
 * cannot be removed, so the tree is returned unchanged for it.
 *
 * @param {DialogueNode[]} treeData
 * @param {NodePath} path
 * @returns {DialogueNode[]}
 */
export function deleteNode(treeData, path) {
  const node = getNode(treeData, path);
  if (!node || isRootNode(node)) return treeData;
  return removeNodeAtPath({ treeData, path, getNodeKey });
}

/**
 * Serializes the tree to the JSON format used by Export JSON.
 *
 * @param {DialogueNode[]} treeData
 * @returns {string}
 */
export function serializeTree(treeData) {
  return JSON.stringify(treeData);
}

/**
 * @param {DialogueNode[]} treeData
 * @param {NodePath} path
 * @returns {DialogueNode | undefined}
 */
function getNode(treeData, path) {
  return getNodeAtPath({ treeData, path, getNodeKey })?.node;
}
