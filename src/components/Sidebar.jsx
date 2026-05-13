import { SearchIcon, FolderIcon } from "./Icons";
import { folderColor } from "../utils";

export function Sidebar({
  open,
  folders,
  activeFolderId,
  allCount,
  searchValue,
  onSearch,
  onSelectFolder,
  onNewFolder,
  onEditFolder,
  onDeleteFolder,
}) {
  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="app-logo">
        <span className="logo-mark">✿</span>
        <span className="logo-text">Noted.</span>
      </div>

      <div className="search-wrap">
        <span className="search-svg-wrap">
          <SearchIcon />
        </span>
        <input
          type="text"
          className="search-input"
          placeholder="Search notes…"
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <nav className="folder-nav">
        <div className="nav-label">Folders</div>
        <ul className="folder-list">
          <li
            className={`folder-item ${activeFolderId === "all" ? "active" : ""}`}
            onClick={() => onSelectFolder("all")}
          >
            <span className="folder-all-icon">◈</span>
            <span className="folder-name">All Notes</span>
            <span className="folder-count">{allCount}</span>
          </li>

          {folders.map((f) => (
            <li
              key={f.id}
              className={`folder-item ${activeFolderId == f.id ? "active" : ""}`}
              onClick={() => onSelectFolder(f.id)}
            >
              <FolderIcon color={folderColor(f.id)} />
              <span className="folder-name">{f.nama}</span>
              <span className="folder-count">{f.jumlah_notes || 0}</span>
              <span className="folder-actions">
                <button
                  className="folder-action-btn"
                  onClick={(e) => { e.stopPropagation(); onEditFolder(f); }}
                >
                  ✏
                </button>
                <button
                  className="folder-action-btn"
                  onClick={(e) => { e.stopPropagation(); onDeleteFolder(f.id); }}
                >
                  ✕
                </button>
              </span>
            </li>
          ))}
        </ul>
      </nav>

      <button className="btn-new-folder" onClick={onNewFolder}>
        <span>+</span> New Folder
      </button>
    </aside>
  );
}