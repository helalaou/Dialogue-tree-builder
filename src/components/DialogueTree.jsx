import { useState } from 'react';
import { SortableTree } from '@nosferatu500/react-sortable-tree';
import '@nosferatu500/react-sortable-tree/style.css';
import './DialogueTree.css';
import {
  DEFAULT_NODE_TITLE,
  addChildNode,
  createInitialTree,
  deleteNode,
  isRootNode,
  renameNode,
  serializeTree,
  toggleNodeType,
} from '../lib/tree';
import NodeActions from './NodeActions';
import NodeTitle from './NodeTitle';
import Toolbar from './Toolbar';

/**
 * Dialogue tree editor: a drag-and-drop tree of bot and user turns with
 * JSON export and import.
 */
export default function DialogueTree() {
  const [treeData, setTreeData] = useState(createInitialTree);
  // Text of the node last clicked or typed into. Enter saves it to the node
  // being edited, and Add uses it as the title of the new node.
  const [draftTitle, setDraftTitle] = useState(DEFAULT_NODE_TITLE);
  // Path (joined with ".") of the node whose title is being edited.
  const [editingKey, setEditingKey] = useState(null);

  const exportData = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(serializeTree(treeData))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'data.json';
    link.click();
  };

  const importData = (file) => {
    const reader = new FileReader();
    reader.onload = () => setTreeData(JSON.parse(reader.result));
    reader.readAsText(file);
  };

  const generateNodeProps = ({ node, path }) => {
    const nodeKey = path.join('.');

    return {
      title: (
        <NodeTitle
          title={node.title}
          isEditing={editingKey === nodeKey}
          onStartEditing={() => {
            setEditingKey(nodeKey);
            setDraftTitle(node.title);
          }}
          onDraftChange={setDraftTitle}
          onSubmit={() => {
            setTreeData(renameNode(treeData, path, draftTitle));
            setEditingKey(null);
          }}
        />
      ),
      buttons: [
        <NodeActions
          key="actions"
          type={node.type}
          onAdd={() => setTreeData(addChildNode(treeData, path, draftTitle))}
          onDelete={() => {
            if (isRootNode(node)) {
              window.alert("You can't delete this node");
            } else {
              setTreeData(deleteNode(treeData, path));
            }
          }}
          onToggleType={() => {
            if (isRootNode(node)) {
              window.alert("You can't change the type of this node");
            } else {
              setTreeData(toggleNodeType(treeData, path));
            }
          }}
        />,
      ],
    };
  };

  return (
    <div className="dialogue-tree">
      <SortableTree
        treeData={treeData}
        onChange={setTreeData}
        generateNodeProps={generateNodeProps}
        canDrag={({ node }) => !isRootNode(node)}
      />
      <Toolbar onExport={exportData} onImport={importData} />
    </div>
  );
}
