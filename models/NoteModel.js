const pool = require('../config/Database');

class NoteModel {

  // ── FOLDERS ────────────────────────────────────────────

  static async getAllFolders() {
    const [rows] = await pool.execute(`
      SELECT f.*, COUNT(n.id) AS jumlah_notes
      FROM folders f
      LEFT JOIN notes n ON f.id = n.folder_id
      GROUP BY f.id
      ORDER BY f.tanggal_dibuat DESC
    `);
    return rows;
  }

  static async getFolderById(id) {
    const [rows] = await pool.execute('SELECT * FROM folders WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async createFolder(nama) {
    const [result] = await pool.execute(
      'INSERT INTO folders (nama) VALUES (?)', [nama]
    );
    return this.getFolderById(result.insertId);
  }

  static async updateFolder(id, nama) {
    await pool.execute('UPDATE folders SET nama = ? WHERE id = ?', [nama, id]);
    return this.getFolderById(id);
  }

  static async deleteFolder(id) {
    const [result] = await pool.execute('DELETE FROM folders WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // ── NOTES ──────────────────────────────────────────────

  static async getAllNotes({ folder_id, search } = {}) {
    let query = `
      SELECT n.*, f.nama AS folder_nama
      FROM notes n
      LEFT JOIN folders f ON n.folder_id = f.id
      WHERE 1=1
    `;
    const params = [];
    if (folder_id) { query += ' AND n.folder_id = ?'; params.push(folder_id); }
    if (search)    { query += ' AND (n.judul LIKE ? OR n.isi LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    query += ' ORDER BY n.tanggal_dibuat DESC';
    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async getNoteById(id) {
    const [rows] = await pool.execute(`
      SELECT n.*, f.nama AS folder_nama
      FROM notes n
      LEFT JOIN folders f ON n.folder_id = f.id
      WHERE n.id = ?
    `, [id]);
    return rows[0] || null;
  }

  static async createNote({ judul, isi, folder_id }) {
    const [result] = await pool.execute(
      'INSERT INTO notes (judul, isi, folder_id) VALUES (?, ?, ?)',
      [judul, isi || '', folder_id || null]
    );
    return this.getNoteById(result.insertId);
  }

  static async updateNote(id, { judul, isi, folder_id }) {
    await pool.execute(
      'UPDATE notes SET judul = ?, isi = ?, folder_id = ? WHERE id = ?',
      [judul, isi || '', folder_id || null, id]
    );
    return this.getNoteById(id);
  }

  static async deleteNote(id) {
    const [result] = await pool.execute('DELETE FROM notes WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = NoteModel;