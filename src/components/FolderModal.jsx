import { useState, useEffect, useRef } from "react";

export function FolderModal({ open, editing, onClose, onSave }) {
  const [name, setName] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setName(editing?.nama || "");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, editing]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim());
  };

  return (
    <div className={`modal-overlay ${open ? "open" : ""}`} onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editing ? "Edit Folder" : "New Folder"}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="field-group">
            <label>Folder name</label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              placeholder="e.g. Work, Personal, Ideas…"
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}