// helpers/cache.js
const fs = require("fs");
const path = require("path");

const CACHE_DIR = path.resolve(__dirname, "../cache");
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR);

const getCache = (key) => {
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
    const file = path.join(CACHE_DIR, `${key}.json`);
    fs.writeFileSync(file, JSON.stringify({ timestamp: Date.now(), content }, null, 2));
};

module.exports = { getCache, setCache };
