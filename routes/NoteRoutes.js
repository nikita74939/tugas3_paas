const express = require('express');
const router = express.Router();
const NoteController = require('../controllers/NoteController');

// ── Folder Routes ─────────────────────────────────────────
router.get('/folders',         NoteController.getAllFolders);
router.post('/folders',        NoteController.createFolder);
router.put('/folders/:id',     NoteController.updateFolder);
router.delete('/folders/:id',  NoteController.deleteFolder);

// ── Note Routes ───────────────────────────────────────────
router.get('/notes',           NoteController.getAllNotes);
router.get('/notes/:id',       NoteController.getNoteById);
router.post('/notes',          NoteController.createNote);
router.put('/notes/:id',       NoteController.updateNote);
router.delete('/notes/:id',    NoteController.deleteNote);

module.exports = router;