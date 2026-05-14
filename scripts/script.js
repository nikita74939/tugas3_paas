// ── CONFIG ───────────────────────────────────────────────
const API = 'https://be-rest-255520032221.us-central1.run.app/api';

// ── STATE ────────────────────────────────────────────────
let folders = [];
let notes = [];
let allNotesCount = 0;      
let activeFolderId = 'all';
let editingFolderCallback = null;
let currentView = 'notes';

// ── CONFIRM DIALOG STATE ─────────────────────────────────
let confirmResolve = null;

// ── CUSTOM SELECT STATE ──────────────────────────────────
let selectOpen = false;

// ── INIT ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadFolders();
  loadNotes();
  bindEvents();
  initCustomSelect();
  initConfirmModal();
});

// ── BIND EVENTS ───────────────────────────────────────────
function bindEvents() {
  document.getElementById('fabBtn').addEventListener('click', () => openEditView(null));
  document.getElementById('btnEditBack').addEventListener('click', showNotesView);
  document.getElementById('btnCancelEdit').addEventListener('click', showNotesView);
  document.getElementById('btnSaveNote').addEventListener('click', saveNote);
  document.getElementById('btnDeleteFromEdit').addEventListener('click', deleteFromEdit);

  document.getElementById('btnNewFolder').addEventListener('click', () => openFolderModal());
  document.getElementById('btnAddFolderMini').addEventListener('click', () => {
    editingFolderCallback = (f) => setCustomSelectValue(f.id, f.nama);
    openFolderModal();
  });
  document.getElementById('btnSaveFolder').addEventListener('click', saveFolder);
  document.getElementById('closeFolderModal').addEventListener('click', closeFolderModal);
  document.getElementById('cancelFolderModal').addEventListener('click', closeFolderModal);
  document.getElementById('folderModal').addEventListener('click', (e) => {
    if (e.target.id === 'folderModal') closeFolderModal();
  });

  document.getElementById('searchInput').addEventListener('input', debounce(onSearch, 300));
  document.getElementById('btnHamburger').addEventListener('click', toggleSidebar);
  document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);
}

// ── CUSTOM SELECT ─────────────────────────────────────────
function initCustomSelect() {
  const trigger = document.getElementById('folderSelectTrigger');
  const dropdown = document.getElementById('customSelectDropdown');

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleCustomSelect();
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== trigger && !trigger.contains(e.target)) {
      closeCustomSelect();
    }
  });
}

function toggleCustomSelect() {
  selectOpen ? closeCustomSelect() : openCustomSelect();
}

function openCustomSelect() {
  const trigger = document.getElementById('folderSelectTrigger');
  const dropdown = document.getElementById('customSelectDropdown');
  const rect = trigger.getBoundingClientRect();

  // Position dropdown below trigger
  dropdown.style.top = (rect.bottom + 6) + 'px';
  dropdown.style.left = rect.left + 'px';
  dropdown.style.minWidth = rect.width + 'px';

  // Build list
  const list = document.getElementById('customSelectList');
  const currentVal = document.getElementById('editFolderId').value;
  list.innerHTML = '';

  // "No folder" option
  const noFolder = document.createElement('li');
  noFolder.className = currentVal === '' ? 'selected' : '';
  noFolder.innerHTML = `<span class="opt-dot"></span> No folder`;
  noFolder.addEventListener('click', () => {
    setCustomSelectValue('', 'No folder');
    closeCustomSelect();
  });
  list.appendChild(noFolder);

  folders.forEach(f => {
    const li = document.createElement('li');
    li.className = f.id == currentVal ? 'selected' : '';
    li.innerHTML = `${folderSvg(f.id)} ${esc(f.nama)}`;
    li.addEventListener('click', () => {
      setCustomSelectValue(f.id, f.nama);
      closeCustomSelect();
    });
    list.appendChild(li);
  });

  dropdown.classList.add('open');
  trigger.classList.add('open');
  selectOpen = true;
}

function closeCustomSelect() {
  document.getElementById('customSelectDropdown').classList.remove('open');
  document.getElementById('folderSelectTrigger').classList.remove('open');
  selectOpen = false;
}

function setCustomSelectValue(id, label) {
  document.getElementById('editFolderId').value = id;
  document.getElementById('folderSelectLabel').textContent = label || 'No folder';
}

function renderFolderSelect(selectedId = null) {
  // Update the custom select label/value
  if (!selectedId) {
    setCustomSelectValue('', 'No folder');
  } else {
    const f = folders.find(f => f.id == selectedId);
    setCustomSelectValue(selectedId, f?.nama || 'No folder');
  }
}

// ── CONFIRM MODAL (replaces native confirm()) ─────────────
function initConfirmModal() {
  document.getElementById('confirmOk').addEventListener('click', () => {
    document.getElementById('confirmModal').classList.remove('open');
    if (confirmResolve) { confirmResolve(true); confirmResolve = null; }
  });
  document.getElementById('confirmCancel').addEventListener('click', () => {
    document.getElementById('confirmModal').classList.remove('open');
    if (confirmResolve) { confirmResolve(false); confirmResolve = null; }
  });
  document.getElementById('confirmModal').addEventListener('click', (e) => {
    if (e.target.id === 'confirmModal') {
      document.getElementById('confirmModal').classList.remove('open');
      if (confirmResolve) { confirmResolve(false); confirmResolve = null; }
    }
  });
}

function showConfirm({ title = 'Are you sure?', sub = 'This action cannot be undone.', icon = '🗑️', okLabel = 'Delete' } = {}) {
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmSub').textContent = sub;
  document.getElementById('confirmIcon').textContent = icon;
  document.getElementById('confirmOk').textContent = okLabel;
  document.getElementById('confirmModal').classList.add('open');
  return new Promise(resolve => { confirmResolve = resolve; });
}

// ── VIEW SWITCHING ────────────────────────────────────────
function showNotesView() {
  currentView = 'notes';
  document.getElementById('notesSection').style.display = '';
  document.getElementById('editSection').style.display = 'none';
  document.getElementById('editSection').classList.remove('active');
  document.getElementById('fabBtn').style.display = '';
  loadNotes(activeFolderId === 'all' ? null : activeFolderId);
  loadFolders();
}

function showEditView() {
  currentView = 'edit';
  document.getElementById('notesSection').style.display = 'none';
  document.getElementById('editSection').style.display = 'block';
  document.getElementById('editSection').classList.add('active');
  document.getElementById('fabBtn').style.display = 'none';
}

function openEditView(note) {
  document.getElementById('editNoteId').value = note?.id || '';
  document.getElementById('editJudul').value = note?.judul || '';
  document.getElementById('editIsi').value = note?.isi || '';
  document.getElementById('btnDeleteFromEdit').style.display = note ? 'flex' : 'none';
  renderFolderSelect(note?.folder_id || (activeFolderId !== 'all' ? activeFolderId : null));
  showEditView();
  setTimeout(() => document.getElementById('editJudul').focus(), 80);
}

// ── API HELPERS ───────────────────────────────────────────
async function apiFetch(path, options = {}) {
  try {
    const res = await fetch(API + path, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  } catch (err) {
    showToast('❌ ' + err.message);
    throw err;
  }
}

// ── LOAD DATA ─────────────────────────────────────────────
async function loadFolders() {
  try {
    folders = await apiFetch('/folders');
    renderFolderNav();
  } catch {}
}

async function loadNotes(folderId = null, search = '') {
  try {
    let qs = '';
    if (folderId && folderId !== 'all') qs += `?folder_id=${folderId}`;
    if (search) qs += (qs ? '&' : '?') + `search=${encodeURIComponent(search)}`;
    notes = await apiFetch('/notes' + qs);
    renderNotes();
    updateCountLabels(folderId, search);
  } catch {}
}

// FIX: load total count separately when filtered
async function loadAllNotesCount() {
  try {
    const all = await apiFetch('/notes');
    allNotesCount = all.length;
    const el = document.getElementById('count-all');
    if (el) el.textContent = allNotesCount;
  } catch {}
}

// ── RENDER: FOLDER NAV ────────────────────────────────────
function renderFolderNav() {
  const list = document.getElementById('folderList');
  const allItem = list.querySelector('[data-id="all"]');
  list.innerHTML = '';
  list.appendChild(allItem);

  folders.forEach(f => {
    const li = document.createElement('li');
    li.className = 'folder-item' + (activeFolderId == f.id ? ' active' : '');
    li.dataset.id = f.id;
    li.innerHTML = `
      ${folderSvg(f.id)}
      <span class="folder-name">${esc(f.nama)}</span>
      <span class="folder-count" id="count-${f.id}">${f.jumlah_notes || 0}</span>
      <span class="folder-actions">
        <button class="folder-action-btn" onclick="promptEditFolder(event,${f.id},'${esc(f.nama).replace(/'/g,"\\'")}')">✏</button>
        <button class="folder-action-btn" onclick="deleteFolder(event,${f.id})">✕</button>
      </span>
    `;
    li.addEventListener('click', (e) => {
      if (e.target.closest('.folder-actions')) return;
      setActiveFolder(f.id);
    });
    list.appendChild(li);
  });

  allItem.onclick = () => setActiveFolder('all');

  // Always keep "All Notes" count accurate
  loadAllNotesCount();
}

function folderSvg(id) {
  const colors = ['#F7618E','#9B4D6F','#E8366A','#C46A8A','#A0395F'];
  const c = colors[id % colors.length];
  return `<svg class="folder-svg-icon" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 5.5A2.5 2.5 0 013.5 3h4.086a1 1 0 01.707.293L9.5 4.5H20.5A2.5 2.5 0 0123 7v9a2.5 2.5 0 01-2.5 2.5h-17A2.5 2.5 0 011 16V5.5z" fill="${c}" fill-opacity="0.18" stroke="${c}" stroke-width="1.4"/>
  </svg>`;
}

// ── RENDER: NOTES ─────────────────────────────────────────
function renderNotes() {
  const grid = document.getElementById('notesGrid');
  const empty = document.getElementById('emptyState');
  grid.innerHTML = '';

  if (!notes.length) {
    grid.appendChild(empty);
    empty.style.display = 'flex';
    return;
  }

  notes.forEach(n => {
    const card = document.createElement('div');
    card.className = 'note-card';
    card.innerHTML = `
      ${n.folder_nama ? `<div class="note-card-folder">${esc(n.folder_nama)}</div>` : ''}
      <div class="note-card-title">${esc(n.judul)}</div>
      ${n.isi ? `<div class="note-card-isi">${esc(n.isi)}</div>` : ''}
      <div class="note-card-date">${formatDate(n.tanggal_dibuat)}</div>
    `;
    card.addEventListener('click', () => openEditView(n));
    grid.appendChild(card);
  });
}

// ── FOLDER ACTIONS ────────────────────────────────────────
function setActiveFolder(id) {
  activeFolderId = id;
  document.querySelectorAll('.folder-item').forEach(el => {
    el.classList.toggle('active', el.dataset.id == id);
  });
  const folder = folders.find(f => f.id == id);
  document.getElementById('mainTitle').textContent = id === 'all' ? 'All Notes' : (folder?.nama || '');
  loadNotes(id === 'all' ? null : id);
  closeSidebar();
}

function openFolderModal(id = null, nama = '') {
  document.getElementById('folderId').value = id || '';
  document.getElementById('folderNama').value = nama;
  document.getElementById('folderModalTitle').textContent = id ? 'Edit Folder' : 'New Folder';
  document.getElementById('folderModal').classList.add('open');
  setTimeout(() => document.getElementById('folderNama').focus(), 100);
}
function closeFolderModal() {
  document.getElementById('folderModal').classList.remove('open');
  editingFolderCallback = null;
}

async function saveFolder() {
  const id = document.getElementById('folderId').value;
  const nama = document.getElementById('folderNama').value.trim();
  if (!nama) { showToast('Folder name is required'); return; }
  try {
    let result;
    if (id) {
      result = await apiFetch(`/folders/${id}`, { method: 'PUT', body: JSON.stringify({ nama }) });
      showToast('✅ Folder updated');
    } else {
      result = await apiFetch('/folders', { method: 'POST', body: JSON.stringify({ nama }) });
      showToast('✅ Folder created');
    }
    closeFolderModal();
    await loadFolders();
    if (editingFolderCallback) { editingFolderCallback(result); editingFolderCallback = null; }
  } catch {}
}

function promptEditFolder(e, id, nama) {
  e.stopPropagation();
  openFolderModal(id, nama);
}

async function deleteFolder(e, id) {
  e.stopPropagation();
  const ok = await showConfirm({
    title: 'Delete this folder?',
    sub: "Notes inside won't be deleted.",
    icon: '📁',
    okLabel: 'Delete'
  });
  if (!ok) return;
  try {
    await apiFetch(`/folders/${id}`, { method: 'DELETE' });
    showToast('🗑 Folder deleted');
    if (activeFolderId == id) setActiveFolder('all');
    await loadFolders();
    await loadNotes();
  } catch {}
}

// ── NOTE ACTIONS ──────────────────────────────────────────
async function saveNote() {
  const id = document.getElementById('editNoteId').value;
  const judul = document.getElementById('editJudul').value.trim();
  const isi = document.getElementById('editIsi').value.trim();
  const folder_id = document.getElementById('editFolderId').value || null;
  if (!judul) { showToast('Title is required'); return; }
  try {
    if (id) {
      await apiFetch(`/notes/${id}`, { method: 'PUT', body: JSON.stringify({ judul, isi, folder_id }) });
      showToast('✅ Note saved');
    } else {
      await apiFetch('/notes', { method: 'POST', body: JSON.stringify({ judul, isi, folder_id }) });
      showToast('✅ Note created');
    }
    showNotesView();
  } catch {}
}

async function deleteFromEdit() {
  const id = document.getElementById('editNoteId').value;
  if (!id) return;
  const ok = await showConfirm({
    title: 'Delete this note?',
    sub: 'This action cannot be undone.',
    icon: '🗑️',
    okLabel: 'Delete'
  });
  if (!ok) return;
  try {
    await apiFetch(`/notes/${id}`, { method: 'DELETE' });
    showToast('🗑 Note deleted');
    showNotesView();
  } catch {}
}

// ── SEARCH ────────────────────────────────────────────────
function onSearch(e) {
  const q = e.target.value.trim();
  const fid = activeFolderId === 'all' ? null : activeFolderId;
  loadNotes(fid, q);
}

// ── COUNT LABELS ──────────────────────────────────────────
function updateCountLabels(folderId, search) {
  // Header count: show current filtered count
  const label = document.getElementById('notesCountLabel');
  if (label) label.textContent = notes.length + (notes.length === 1 ? ' note' : ' notes');

  // FIX: if we're viewing a specific folder/search, don't update "All Notes" count
  // "All Notes" badge is kept accurate by loadAllNotesCount() called from renderFolderNav
  if (!folderId && !search) {
    allNotesCount = notes.length;
    const el = document.getElementById('count-all');
    if (el) el.textContent = allNotesCount;
  }
  // Per-folder count: update the active folder badge
  if (folderId) {
    const el = document.getElementById(`count-${folderId}`);
    if (el) el.textContent = notes.length;
  }
}

// ── SIDEBAR ───────────────────────────────────────────────
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('show');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('show');
}

// ── TOAST ─────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ── UTILS ─────────────────────────────────────────────────
function esc(str) {
  return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function formatDate(str) {
  if (!str) return '';
  return new Date(str).toLocaleDateString('en-US', { day:'numeric', month:'short', year:'numeric' });
}
function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}