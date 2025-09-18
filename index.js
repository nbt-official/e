const express = require('express');
const app = express();

// Decryption function (base64 + XOR)
function customDecrypt(b64str, key) {
    const raw = Buffer.from(b64str, 'base64').toString('binary');
    let out = '';
    for (let i = 0; i < raw.length; i++) {
        out += String.fromCharCode(raw.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return out;
}

// GET endpoint: /get?url=<hi>
app.get('/get', (req, res) => {
    const hi = req.query.url;
    if (!hi) return res.status(400).json({ error: "Missing 'url' query parameter" });

    try {
        const decrypted = customDecrypt(hi, "5fjn6a3h5h6fg518jj4a7v3b4n");
        const [manifestUrl, licenseUrl] = decrypted.split('!');
        res.json({ manifestUrl, licenseUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Decryption failed" });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
