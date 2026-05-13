const express = require('express');
const cors    = require('cors');
const path    = require('path');
const pool    = require('./config/Database');
const routes  = require('./routes/NoteRoutes');

const app  = express();
const PORT = 3000;

// ── Middleware ────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// ── API Routes ────────────────────────────────────────────
app.use('/api', routes);

// ── SPA Fallback ──────────────────────────────────────────
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ── Init DB Tables & Start ────────────────────────────────
async function init() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS folders (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      nama           VARCHAR(100) NOT NULL,
      tanggal_dibuat DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS notes (
      id               INT AUTO_INCREMENT PRIMARY KEY,
      judul            VARCHAR(255) NOT NULL,
      isi              TEXT,
      folder_id        INT,
      tanggal_dibuat   DATETIME DEFAULT CURRENT_TIMESTAMP,
      tanggal_diupdate DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL
    )
  `);
  console.log('✅ Database connected & tables ready');

  app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  });
}

init().catch(err => {
  console.error('❌ Gagal connect ke database:', err.message);
  process.exit(1);
});