const express = require('express');
const cors    = require('cors');
const path    = require('path');
const pool    = require('./config/Database');
const routes  = require('./routes/NoteRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── CORS Config ───────────────────────────────────────────
const allowedOrigins = [
  'https://nikita-fe-dot-praktikum-tcc01.uc.r.appspot.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// ── Middleware ────────────────────────────────────────────
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// ── API Routes ────────────────────────────────────────────
app.use('/api', routes);

// ── Health Check untuk Cloud Run ──────────────────────────
app.get('/', (req, res) => {
  res.status(200).send('Backend Notes API is running 🚀');
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is healthy'
  });
});

// ── SPA Fallback ──────────────────────────────────────────
// Kalau backend kamu hanya API, bagian ini boleh dihapus.
// Kalau tetap dipakai, ini aman untuk Express v5.
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ── Init DB Tables ────────────────────────────────────────
async function initDB() {
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
}

// ── Start Server DULU, baru init DB ───────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);

  initDB().catch(err => {
    console.error('❌ Gagal init database:', err.message);
  });
});
