const NoteModel = require('../models/NoteModel');

class NoteController {

  // ── FOLDERS ────────────────────────────────────────────

  static async getAllFolders(req, res) {
    try {
      const data = await NoteModel.getAllFolders();
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async createFolder(req, res) {
    const { nama } = req.body;
    if (!nama) return res.status(400).json({ success: false, message: 'Nama folder wajib diisi' });
    try {
      const data = await NoteModel.createFolder(nama);
      res.status(201).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async updateFolder(req, res) {
    const { nama } = req.body;
    if (!nama) return res.status(400).json({ success: false, message: 'Nama folder wajib diisi' });
    try {
      const data = await NoteModel.updateFolder(req.params.id, nama);
      if (!data) return res.status(404).json({ success: false, message: 'Folder tidak ditemukan' });
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async deleteFolder(req, res) {
    try {
      const ok = await NoteModel.deleteFolder(req.params.id);
      if (!ok) return res.status(404).json({ success: false, message: 'Folder tidak ditemukan' });
      res.json({ success: true, message: 'Folder dihapus' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // ── NOTES ──────────────────────────────────────────────

  static async getAllNotes(req, res) {
    try {
      const data = await NoteModel.getAllNotes(req.query);
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getNoteById(req, res) {
    try {
      const data = await NoteModel.getNoteById(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: 'Note tidak ditemukan' });
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async createNote(req, res) {
    const { judul, isi, folder_id } = req.body;
    if (!judul) return res.status(400).json({ success: false, message: 'Judul wajib diisi' });
    try {
      const data = await NoteModel.createNote({ judul, isi, folder_id });
      res.status(201).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async updateNote(req, res) {
    const { judul, isi, folder_id } = req.body;
    if (!judul) return res.status(400).json({ success: false, message: 'Judul wajib diisi' });
    try {
      const data = await NoteModel.updateNote(req.params.id, { judul, isi, folder_id });
      if (!data) return res.status(404).json({ success: false, message: 'Note tidak ditemukan' });
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async deleteNote(req, res) {
    try {
      const ok = await NoteModel.deleteNote(req.params.id);
      if (!ok) return res.status(404).json({ success: false, message: 'Note tidak ditemukan' });
      res.json({ success: true, message: 'Note dihapus' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = NoteController;