/**
 * Title of a tree node. Shows the message text, or a text field while the
 * node is being edited; pressing Enter saves the draft text.
 *
 * @param {object} props
 * @param {string} props.title Current message text.
 * @param {boolean} props.isEditing Whether the text field is shown.
 * @param {() => void} props.onStartEditing Called when the text is clicked.
 * @param {(text: string) => void} props.onDraftChange Called on every keystroke.
 * @param {() => void} props.onSubmit Called when Enter is pressed.
 */
export default function NodeTitle({ title, isEditing, onStartEditing, onDraftChange, onSubmit }) {
  if (isEditing) {
    return (
      <input
        className="node-title-input"
        aria-label="Message text"
        onChange={(event) => onDraftChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') onSubmit();
        }}
      />
    );
  }

  return (
    <span className="node-title" onClick={onStartEditing}>
      {title}
    </span>
  );
}
