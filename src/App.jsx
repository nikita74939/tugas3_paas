import { useEffect, useMemo, useRef, useState } from 'react';

const API = 'https://be-rest-255520032221.us-central1.run.app/api';

function FolderIcon({ id }) {
  const colors = ['#F7618E', '#9B4D6F', '#E8366A', '#C46A8A', '#A0395F'];
  const color = colors[Number(id) % colors.length] || colors[0];

  return (
    <svg className="folder-svg-icon" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1 5.5A2.5 2.5 0 013.5 3h4.086a1 1 0 01.707.293L9.5 4.5H20.5A2.5 2.5 0 0123 7v9a2.5 2.5 0 01-2.5 2.5h-17A2.5 2.5 0 011 16V5.5z"
        fill={color}
        fillOpacity="0.18"
        stroke={color}
        strokeWidth="1.4"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="search-svg" viewBox="0 0 20 20" fill="none">
      <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="17" height="17">
      <path d="M12 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FolderLineIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="14" height="14">
      <path
        d="M2 7.5A2.5 2.5 0 014.5 5h2.086a1 1 0 01.707.293L8.5 6.5H15.5A2.5 2.5 0 0118 9v5a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 012 14V7.5z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="12" height="12" style={{ marginLeft: 2, opacity: 0.5 }}>
      <path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="15" height="15">
      <path d="M5 6h10M8 6V4h4v2M6 6l1 9h6l1-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
      <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

function emptyEditNote(folderId) {
  return {
    id: '',
    judul: '',
    isi: '',
    folder_id: folderId !== 'all' ? folderId : '',
  };
}

export default function App() {
  const [folders, setFolders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [activeFolderId, setActiveFolderId] = useState('all');
  const [view, setView] = useState('notes');
  const [search, setSearch] = useState('');
  const [allNotesCount, setAllNotesCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [folderModal, setFolderModal] = useState({ open: false, id: '', nama: '', fromEditor: false });
  const [editNote, setEditNote] = useState(emptyEditNote('all'));
  const [toast, setToast] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [selectOpen, setSelectOpen] = useState(false);
  const selectRef = useRef(null);
  const titleInputRef = useRef(null);

  const activeFolder = useMemo(
    () => folders.find((folder) => String(folder.id) === String(activeFolderId)),
    [activeFolderId, folders],
  );
  const selectedFolder = folders.find((folder) => String(folder.id) === String(editNote.folder_id));
  const noteCountLabel = `${notes.length} ${notes.length === 1 ? 'note' : 'notes'}`;

  async function apiFetch(path, options = {}) {
    const response = await fetch(API + path, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Request failed');
    return data.data;
  }

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2500);
  }

  async function loadFolders() {
    try {
      setFolders(await apiFetch('/folders'));
    } catch (error) {
      showToast(error.message);
    }
  }

  async function loadAllNotesCount() {
    try {
      const data = await apiFetch('/notes');
      setAllNotesCount(data.length);
    } catch (error) {
      showToast(error.message);
    }
  }

  async function loadNotes(folderId = activeFolderId, searchValue = search) {
    try {
      const params = new URLSearchParams();
      if (folderId && folderId !== 'all') params.set('folder_id', folderId);
      if (searchValue) params.set('search', searchValue);
      const query = params.toString() ? `?${params.toString()}` : '';
      const data = await apiFetch(`/notes${query}`);
      setNotes(data);
      if (folderId === 'all' && !searchValue) setAllNotesCount(data.length);
    } catch (error) {
      showToast(error.message);
    }
  }

  useEffect(() => {
    loadFolders();
    loadAllNotesCount();
    loadNotes('all', '');
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => loadNotes(activeFolderId, search.trim()), 300);
    return () => window.clearTimeout(timeout);
  }, [activeFolderId, search]);

  useEffect(() => {
    function closeOnOutsideClick(event) {
      if (selectRef.current && !selectRef.current.contains(event.target)) setSelectOpen(false);
    }

    document.addEventListener('click', closeOnOutsideClick);
    return () => document.removeEventListener('click', closeOnOutsideClick);
  }, []);

  function showNotesView() {
    setView('notes');
    setSelectOpen(false);
    loadNotes(activeFolderId, search.trim());
    loadFolders();
    loadAllNotesCount();
  }

  function openEditView(note = null) {
    setEditNote(
      note
        ? { id: note.id || '', judul: note.judul || '', isi: note.isi || '', folder_id: note.folder_id || '' }
        : emptyEditNote(activeFolderId),
    );
    setView('edit');
    window.setTimeout(() => titleInputRef.current?.focus(), 80);
  }

  function openFolderModal(id = '', nama = '', fromEditor = false) {
    setFolderModal({ open: true, id, nama, fromEditor });
  }

  function closeFolderModal() {
    setFolderModal({ open: false, id: '', nama: '', fromEditor: false });
  }

  function askConfirm(options) {
    return new Promise((resolve) => setConfirm({ resolve, ...options }));
  }

  function closeConfirm(result) {
    if (confirm?.resolve) confirm.resolve(result);
    setConfirm(null);
  }

  function chooseFolder(id) {
    setEditNote((current) => ({ ...current, folder_id: id }));
    setSelectOpen(false);
  }

  async function saveFolder() {
    const nama = folderModal.nama.trim();
    if (!nama) {
      showToast('Folder name is required');
      return;
    }

    try {
      const result = folderModal.id
        ? await apiFetch(`/folders/${folderModal.id}`, { method: 'PUT', body: JSON.stringify({ nama }) })
        : await apiFetch('/folders', { method: 'POST', body: JSON.stringify({ nama }) });

      showToast(folderModal.id ? 'Folder updated' : 'Folder created');
      if (folderModal.fromEditor) setEditNote((current) => ({ ...current, folder_id: result.id }));
      closeFolderModal();
      await loadFolders();
      await loadAllNotesCount();
    } catch (error) {
      showToast(error.message);
    }
  }

  async function deleteFolder(event, id) {
    event.stopPropagation();
    const ok = await askConfirm({
      title: 'Delete this folder?',
      sub: "Notes inside won't be deleted.",
      icon: 'Folder',
      okLabel: 'Delete',
    });
    if (!ok) return;

    try {
      await apiFetch(`/folders/${id}`, { method: 'DELETE' });
      showToast('Folder deleted');
      if (String(activeFolderId) === String(id)) setActiveFolderId('all');
      await loadFolders();
      await loadNotes('all', search.trim());
      await loadAllNotesCount();
    } catch (error) {
      showToast(error.message);
    }
  }

  async function saveNote() {
    const judul = editNote.judul.trim();
    const isi = editNote.isi.trim();
    const folder_id = editNote.folder_id || null;

    if (!judul) {
      showToast('Title is required');
      return;
    }

    try {
      if (editNote.id) {
        await apiFetch(`/notes/${editNote.id}`, { method: 'PUT', body: JSON.stringify({ judul, isi, folder_id }) });
        showToast('Note saved');
      } else {
        await apiFetch('/notes', { method: 'POST', body: JSON.stringify({ judul, isi, folder_id }) });
        showToast('Note created');
      }
      showNotesView();
    } catch (error) {
      showToast(error.message);
    }
  }

  async function deleteFromEdit() {
    if (!editNote.id) return;
    const ok = await askConfirm({
      title: 'Delete this note?',
      sub: 'This action cannot be undone.',
      icon: 'Delete',
      okLabel: 'Delete',
    });
    if (!ok) return;

    try {
      await apiFetch(`/notes/${editNote.id}`, { method: 'DELETE' });
      showToast('Note deleted');
      showNotesView();
    } catch (error) {
      showToast(error.message);
    }
  }

  return (
    <>
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="app-logo">
            <span className="logo-mark">N</span>
            <span className="logo-text">Noted.</span>
          </div>
        </div>

        <div className="search-wrap">
          <SearchIcon />
          <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search notes..." />
        </div>

        <nav className="folder-nav">
          <div className="nav-label">Folders</div>
          <ul id="folderList">
            <li className={`folder-item ${activeFolderId === 'all' ? 'active' : ''}`} data-id="all" onClick={() => setActiveFolderId('all')}>
              <span className="folder-all-icon">O</span>
              <span className="folder-name">All Notes</span>
              <span className="folder-count">{allNotesCount}</span>
            </li>

            {folders.map((folder) => (
              <li
                key={folder.id}
                className={`folder-item ${String(activeFolderId) === String(folder.id) ? 'active' : ''}`}
                data-id={folder.id}
                onClick={() => {
                  setActiveFolderId(folder.id);
                  setSidebarOpen(false);
                }}
              >
                <FolderIcon id={folder.id} />
                <span className="folder-name">{folder.nama}</span>
                <span className="folder-count">{folder.jumlah_notes || 0}</span>
                <span className="folder-actions">
                  <button
                    className="folder-action-btn"
                    type="button"
                    aria-label="Edit folder"
                    onClick={(event) => {
                      event.stopPropagation();
                      openFolderModal(folder.id, folder.nama);
                    }}
                  >
                    Edit
                  </button>
                  <button className="folder-action-btn" type="button" aria-label="Delete folder" onClick={(event) => deleteFolder(event, folder.id)}>
                    X
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </nav>

        <button className="btn-new-folder" type="button" onClick={() => openFolderModal()}>
          <span>+</span> New Folder
        </button>
      </aside>

      <div className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)} />

      <main className="main">
        <header className="main-header">
          <button className="btn-hamburger" type="button" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
            <span />
            <span />
            <span />
          </button>
          <div className="header-title-wrap">
            <h1>{activeFolderId === 'all' ? 'All Notes' : activeFolder?.nama || ''}</h1>
            <span className="notes-count">{noteCountLabel}</span>
          </div>
        </header>

        {view === 'notes' && (
          <section className="notes-section">
            <div className="notes-grid">
              {!notes.length ? (
                <div className="empty-state">
                  <div className="empty-blob" />
                  <span className="empty-icon">+</span>
                  <p className="empty-title">Nothing here yet</p>
                  <p className="empty-sub">
                    Tap the <strong>+</strong> button to write your first note
                  </p>
                </div>
              ) : (
                notes.map((note) => (
                  <button className="note-card" type="button" key={note.id} onClick={() => openEditView(note)}>
                    {note.folder_nama && <div className="note-card-folder">{note.folder_nama}</div>}
                    <div className="note-card-title">{note.judul}</div>
                    {note.isi && <div className="note-card-isi">{note.isi}</div>}
                    <div className="note-card-date">{formatDate(note.tanggal_dibuat)}</div>
                  </button>
                ))
              )}
            </div>
          </section>
        )}

        {view === 'edit' && (
          <section className="edit-section active">
            <div className="edit-inner">
              <button className="edit-back" type="button" onClick={showNotesView}>
                <BackIcon />
                Back to notes
              </button>

              <input
                ref={titleInputRef}
                className="edit-title-input"
                type="text"
                value={editNote.judul}
                onChange={(event) => setEditNote((current) => ({ ...current, judul: event.target.value }))}
                placeholder="Note title..."
              />

              <div className="edit-meta-row">
                <div className="edit-folder-wrap custom-select-trigger" ref={selectRef} onClick={() => setSelectOpen((open) => !open)}>
                  <FolderLineIcon />
                  <span className="custom-select-label">{selectedFolder?.nama || 'No folder'}</span>
                  <ChevronIcon />

                  {selectOpen && (
                    <div className="custom-select-dropdown open">
                      <ul>
                        <li className={!editNote.folder_id ? 'selected' : ''} onClick={() => chooseFolder('')}>
                          <span className="opt-dot" /> No folder
                        </li>
                        {folders.map((folder) => (
                          <li
                            key={folder.id}
                            className={String(folder.id) === String(editNote.folder_id) ? 'selected' : ''}
                            onClick={() => chooseFolder(folder.id)}
                          >
                            <FolderIcon id={folder.id} /> {folder.nama}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <button className="btn-add-folder-mini" type="button" onClick={() => openFolderModal('', '', true)}>
                  + New folder
                </button>
              </div>

              <textarea
                className="edit-body-input"
                value={editNote.isi}
                onChange={(event) => setEditNote((current) => ({ ...current, isi: event.target.value }))}
                placeholder="Write your thoughts..."
              />

              <div className="edit-actions">
                <button className="btn-delete-note" type="button" style={{ display: editNote.id ? 'flex' : 'none' }} onClick={deleteFromEdit}>
                  <DeleteIcon />
                  Delete
                </button>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn-ghost" type="button" onClick={showNotesView}>
                    Cancel
                  </button>
                  <button className="btn-save-note" type="button" onClick={saveNote}>
                    Save note
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {view === 'notes' && (
        <button className="fab" type="button" onClick={() => openEditView()} aria-label="New note">
          <PlusIcon />
        </button>
      )}

      {folderModal.open && (
        <div className="modal-overlay open" onClick={(event) => event.target === event.currentTarget && closeFolderModal()}>
          <div className="modal-card">
            <div className="modal-header">
              <h2>{folderModal.id ? 'Edit Folder' : 'New Folder'}</h2>
              <button className="modal-close" type="button" onClick={closeFolderModal}>
                X
              </button>
            </div>
            <div className="modal-body">
              <div className="field-group">
                <label>Folder name</label>
                <input
                  type="text"
                  value={folderModal.nama}
                  onChange={(event) => setFolderModal((current) => ({ ...current, nama: event.target.value }))}
                  placeholder="e.g. Work, Personal, Ideas..."
                  autoFocus
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-ghost" type="button" onClick={closeFolderModal}>
                Cancel
              </button>
              <button className="btn-primary" type="button" onClick={saveFolder}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {confirm && (
        <div className="modal-overlay open" onClick={(event) => event.target === event.currentTarget && closeConfirm(false)}>
          <div className="modal-card modal-card-confirm">
            <div className="modal-body" style={{ padding: '28px 28px 0', textAlign: 'center' }}>
              <div className="confirm-icon">{confirm.icon || 'Delete'}</div>
              <p className="confirm-title">{confirm.title || 'Are you sure?'}</p>
              <p className="confirm-sub">{confirm.sub || 'This action cannot be undone.'}</p>
            </div>
            <div className="modal-footer" style={{ padding: '20px 28px 28px' }}>
              <button className="btn-ghost" type="button" onClick={() => closeConfirm(false)}>
                Cancel
              </button>
              <button className="btn-danger" type="button" onClick={() => closeConfirm(true)}>
                {confirm.okLabel || 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </>
  );
}
