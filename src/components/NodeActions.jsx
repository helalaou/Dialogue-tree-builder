import { NodeType } from '../lib/tree';

/**
 * Buttons shown at the end of every tree row: add a reply, delete the
 * branch, and switch the node between bot and user.
 *
 * @param {object} props
 * @param {import('../lib/tree').NodeType} [props.type] Speaker of the node.
 * @param {() => void} props.onAdd
 * @param {() => void} props.onDelete
 * @param {() => void} props.onToggleType
 */
export default function NodeActions({ type, onAdd, onDelete, onToggleType }) {
  const isBot = type === NodeType.BOT;

  return (
    <>
      <button type="button" className="node-button node-button--add" onClick={onAdd}>
        Add
      </button>
      <button type="button" className="node-button node-button--delete" onClick={onDelete}>
        Delete
      </button>
      <button
        type="button"
        className="node-button node-button--type"
        title={isBot ? 'Bot turn (switch to user)' : 'User turn (switch to bot)'}
        onClick={onToggleType}
      >
        <span role="img" aria-label={isBot ? 'robot' : 'user'}>
          {isBot ? '🤖' : '🧑🏻'}
        </span>
      </button>
    </>
  );
}
