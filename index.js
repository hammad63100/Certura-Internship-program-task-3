// index.js
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

// Multer Storage
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, 'uploads'));
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        }
    })
});

// 1️⃣ Upload file to local server
app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ message: 'File uploaded locally successfully', file: req.file.filename });
});

// 2️⃣ List files in uploads folder
app.get('/files', async (req, res) => {
    const fs = require('fs');
    const uploadsDir = path.join(__dirname, 'uploads');
    try {
        const files = fs.readdirSync(uploadsDir);
        res.json({ files });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3️⃣ Download a file from uploads folder
app.get('/files/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    res.download(filePath, err => {
        if (err) {
            res.status(404).json({ error: 'File not found on server' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
