// helpers/cache.js
const fs = require("fs");
const path = require("path");

const CACHE_DIR = path.resolve(__dirname, "../cache");

// 🧠 In-memory cache fallback (buat serverless / Vercel)
const memoryCache = {};
const isReadOnly =
    process.env.VERCEL === "1" ||
    process.env.NODE_ENV === "production" ||
    process.cwd().startsWith("/var/task");

// Cek dan buat folder cache jika belum ada (kalau bukan read-only)
if (!isReadOnly) {
    if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
}

const getCache = (key) => {
    // Kalau di environment read-only, ambil dari memori
    if (isReadOnly) {
        return memoryCache[key] || null;
    }

    // Kalau di lokal, ambil dari file
    const file = path.join(CACHE_DIR, `${key}.json`);
    if (!fs.existsSync(file)) return null;

    try {
        const data = JSON.parse(fs.readFileSync(file, "utf8"));
        if (Date.now() - data.timestamp > 5 * 60 * 1000) return null; // 5 menit
        return data.content;
    } catch {
        return null;
    }
};

const setCache = (key, content) => {
    // Kalau di environment read-only, simpan di memori aja
    if (isReadOnly) {
        memoryCache[key] = content;
        setTimeout(() => delete memoryCache[key], 5 * 60 * 1000); // hapus setelah 5 menit
        return;
    }

    // Kalau di lokal, simpan ke file
    const file = path.join(CACHE_DIR, `${key}.json`);
    fs.writeFileSync(
        file,
        JSON.stringify({ timestamp: Date.now(), content }, null, 2)
    );
};

module.exports = { getCache, setCache };
