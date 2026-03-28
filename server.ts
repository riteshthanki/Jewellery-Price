import express from 'express';
import multer from 'multer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

const DATA_DIR = path.resolve(__dirname, 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

// Ensure directories exist
fs.ensureDirSync(UPLOADS_DIR);
if (!fs.existsSync(STORE_FILE)) {
  fs.writeJsonSync(STORE_FILE, { rates: [], settings: [], mediaItems: [] });
}

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Helper to read/write data
const getData = () => fs.readJsonSync(STORE_FILE, { throws: false }) || { rates: [], settings: [], mediaItems: [] };
const saveData = (data: any) => fs.writeJsonSync(STORE_FILE, data, { spaces: 2 });

// Serve uploads statically
app.use('/data/uploads', express.static(UPLOADS_DIR));

// Middleware to handle /api.php
app.all('/api.php', (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      console.error('[Multer Error]', err);
      return res.status(500).json({ error: err.message || 'Upload failed' });
    }
    next();
  });
}, async (req, res) => {
  const method = req.method;
  const queryAction = req.query?.action as string;
  const bodyAction = req.body?.action as string;
  const action = queryAction || bodyAction;

  try {
    if (method === 'GET' && action === 'get_data') {
      res.json(getData());
      return;
    }

    if (method === 'POST') {
      const data = getData();
      switch (action) {
        case 'save_rates':
          if (req.body?.rates) {
            data.rates = JSON.parse(req.body.rates);
            saveData(data);
            res.json({ success: true });
            return;
          }
          break;
        case 'save_settings':
          if (req.body?.settings) {
            data.settings = JSON.parse(req.body.settings);
            saveData(data);
            res.json({ success: true });
            return;
          }
          break;
        case 'save_media':
          if (req.body?.mediaItems) {
            data.mediaItems = JSON.parse(req.body.mediaItems);
            saveData(data);
            res.json({ success: true });
            return;
          }
          break;
        case 'upload_file':
          const file = req.file || (req.files && Array.isArray(req.files) ? req.files[0] : null);
          if (file) {
            const webPath = `/data/uploads/${file.filename}`;
            res.json({ success: true, url: webPath });
            return;
          }
          res.status(400).json({ error: 'No file uploaded' });
          return;
        case 'delete_file':
          const url = req.body?.url;
          if (url) {
            const filename = path.basename(url);
            const filePath = path.join(UPLOADS_DIR, filename);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
            res.json({ success: true });
            return;
          }
          break;
        default:
          if (action === 'get_data') {
              res.json(getData());
              return;
          }
          res.status(400).json({ error: 'Invalid action' });
          return;
      }
    }
    res.json({ status: 'API Active' });
  } catch (error: any) {
    console.error('[API Error]', error);
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
