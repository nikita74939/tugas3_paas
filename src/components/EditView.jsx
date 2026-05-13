import { useState, useEffect, useRef } from "react";
import { BackIcon, TrashIcon } from "./Icons";
import { FolderSelect } from "./FolderSelect";

export function EditView({
  note,
  folders,
  activeFolderId,
  onBack,
  onSave,
  onDelete,
  onNewFolder,
  showToast,
}) {
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [folderId, setFolderId] = useState("");
  const titleRef = useRef(null);

  useEffect(() => {
    setJudul(note?.judul || "");
    setIsi(note?.isi || "");
    const defaultFolder =
      note?.folder_id || (activeFolderId !== "all" ? activeFolderId : "");
    setFolderId(defaultFolder || "");
    setTimeout(() => titleRef.current?.focus(), 80);
  }, [note, activeFolderId]);

  const handleSave = async () => {
    if (!judul.trim()) {
      showToast("Title is required");
      return;
    }
    await onSave({ judul: judul.trim(), isi: isi.trim(), folder_id: folderId || null });
  };

  return (
    <section className="edit-section active">
      <div style={{ maxWidth: 720 }}>
        <button className="edit-back" onClick={onBack}>
          <BackIcon /> Back to notes
        </button>

        <input
          ref={titleRef}
          className="edit-title-input"
          type="text"
          placeholder="Note title…"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
        />

        <div className="edit-meta-row">
          <FolderSelect
            folders={folders}
            value={folderId}
            onChange={setFolderId}
          />
          <button className="btn-add-folder-mini" onClick={onNewFolder}>
            + New folder
          </button>
        </div>

        <textarea
          className="edit-body-input"
          placeholder="Write your thoughts…"
          value={isi}
          onChange={(e) => setIsi(e.target.value)}
        />

        <div className="edit-actions">
          {note && (
            <button className="btn-delete-note" onClick={onDelete}>
              <TrashIcon /> Delete
            </button>
          )}
          <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
            <button className="btn-ghost" onClick={onBack}>
              Cancel
            </button>
            <button className="btn-save-note" onClick={handleSave}>
              Save note
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}