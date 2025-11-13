const express = require("express");
const cheerio = require("cheerio");
const AxiosService = require("../helpers/axiosService");
const { getCache, setCache } = require("../helpers/cache");

const router = express.Router();
const BASE_URL = "https://otakudesu.best/";
async function fetchUrl(url) {
    if (typeof AxiosService.get === "function") {
        const { data } = await AxiosService.get(url);
        return data;
    } else {
        const data = await AxiosService(url);
        return data.data || data;
    }
}

// ==========================
// 🔹 Route: Home / Ongoing Anime
// ==========================
router.get("/anime/home", async (req, res) => {
    const cacheKey = "anime_home";
    const cached = getCache(cacheKey);
    if (cached) return res.json({ status: true, message: "cache", ...cached });

    try {
        const html = await fetchUrl(BASE_URL);
        const $ = cheerio.load(html);
        const ongoing_anime = [];

        $(".venz ul li").each((_, el) => {
            const title = $(el).find("h2.jdlflm").text().trim();
            const slug = $(el).find("a").attr("href").split("/").filter(Boolean).pop();
            const poster = $(el).find("img").attr("src");
            const episode = $(el).find(".epz").text().trim();
            const day = $(el).find(".epztipe").text().trim();
            const updated_on = $(el).find(".epztipe2").text().trim();

            ongoing_anime.push({ title, slug, poster, episode, day, updated_on });
        });

        const responseData = {
            status: "success",
            creator: "Faza",
            data: { ongoing_anime },
            pagination: [1, 2, 3, 4, 5],
        };

        setCache(cacheKey, responseData);
        res.json(responseData);
    } catch (e) {
        res.status(500).json({ status: false, message: e.message });
    }
});

// ==========================
// 🔹 Route: Search Anime
// ==========================
router.get("/anime/search/:query", async (req, res) => {
    const query = req.params.query;
    const cacheKey = `anime_search_${query}`;
    const cached = getCache(cacheKey);
    if (cached) return res.json({ status: true, message: "cache", ...cached });

    try {
        const html = await fetchUrl(`${BASE_URL}/?s=${query}`);
        const $ = cheerio.load(html);
        const result = [];

        $(".chivsrc").each((_, el) => {
            const title = $(el).find("h2").text().trim();
            const link = $(el).find("a").attr("href");
            const slug = link.split("/").filter(Boolean).pop();
            const poster = $(el).find("img").attr("src");
            const status = $(el).find(".set").text().trim();

            result.push({ title, slug, poster, status });
        });

        const responseData = {
            status: "success",
            creator: "Faza",
            data: { result },
            pagination: [1, 2, 3, 4, 5],
        };

        setCache(cacheKey, responseData);
        res.json(responseData);
    } catch (e) {
        res.status(500).json({ status: false, message: e.message });
    }
});

module.exports = router;
