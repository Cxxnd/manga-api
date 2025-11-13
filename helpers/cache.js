import fs from "fs";
import path from "path";

const CACHE_DIR = "./cache";
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR);

export const getCache = (key) => {
    const file = path.join(CACHE_DIR, `${key}.json`);
    if (!fs.existsSync(file)) return null;
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    if (Date.now() - data.timestamp > 5 * 60 * 1000) return null; // 5 menit
    return data.content;
};

export const setCache = (key, content) => {
    const file = path.join(CACHE_DIR, `${key}.json`);
    fs.writeFileSync(
        file,
        JSON.stringify({ timestamp: Date.now(), content }, null, 2)
    );
};
