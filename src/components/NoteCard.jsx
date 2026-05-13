import { formatDate } from "../utils";

export function NoteCard({ note, onClick }) {
  return (
    <div className="note-card" onClick={onClick}>
      {note.folder_nama && (
        <div className="note-card-folder">{note.folder_nama}</div>
      )}
      <div className="note-card-title">{note.judul}</div>
      {note.isi && <div className="note-card-isi">{note.isi}</div>}
      <div className="note-card-date">{formatDate(note.tanggal_dibuat)}</div>
    </div>
  );
}