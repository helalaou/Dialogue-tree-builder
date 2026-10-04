import { useRef } from 'react';

/**
 * Export and Import buttons for saving the tree to, and loading it from, a
 * JSON file.
 *
 * @param {object} props
 * @param {() => void} props.onExport Called when Export JSON is clicked.
 * @param {(file: File) => void} props.onImport Called with the chosen file.
 */
export default function Toolbar({ onExport, onImport }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) onImport(file);
  };

  return (
    <div className="toolbar">
      <button type="button" onClick={onExport}>
        Export JSON
      </button>
      <button type="button" onClick={() => fileInputRef.current.click()}>
        Import JSON
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        hidden
        onChange={handleFileChange}
      />
    </div>
  );
}
