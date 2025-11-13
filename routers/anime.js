import express from "express";
import cheerio from "cheerio";
import { AxiosService } from "../helpers/axiosService.js";
import { getCache, setCache } from "../helpers/cache.js";

const router = express.Router();
const BASE_URL = "https://otakudesu.cloud";

router.get("/anime/home", async (req, res) => {
    const cacheKey = "anime_home";
    const cached = getCache(cacheKey);
    if (cached) return res.json({ status: true, message: "cache", ...cached });

    try {
        const { data } = await AxiosService.get(BASE_URL);
        const $ = cheerio.load(data);
        const ongoing_anime = [];

        $(".venz ul li").each((_, el) => {
            const title = $(el).find("h2.jdlflm").text().trim();
            const slug = $(el).find("a").attr("href").split("/").filter(Boolean).pop();
            const poster = $(el).find("img").attr("src");
            const episode = $(el).find(".epz").text().trim();

            ongoing_anime.push({ title, slug, poster, episode });
        });

        const responseData = { status: "success", creator: "Sanka Vollerei", data: { ongoing_anime } };
        setCache(cacheKey, responseData);
        res.json(responseData);
    } catch (e) {
        res.status(500).json({ status: false, message: e.message });
    }
});

router.get("/anime/search/:query", async (req, res) => {
    const query = req.params.query;
    const cacheKey = `anime_search_${query}`;
    const cached = getCache(cacheKey);
    if (cached) return res.json({ status: true, message: "cache", ...cached });

    try {
        const { data } = await AxiosService.get(`${BASE_URL}/?s=${query}`);
        const $ = cheerio.load(data);
        const result = [];

        $(".chivsrc").each((_, el) => {
            const title = $(el).find("h2").text().trim();
            const link = $(el).find("a").attr("href");
            const slug = link.split("/").filter(Boolean).pop();
            const poster = $(el).find("img").attr("src");

            result.push({ title, slug, poster });
        });

        const responseData = { status: "success", creator: "Sanka Vollerei", data: { result } };
        setCache(cacheKey, responseData);
        res.json(responseData);
    } catch (e) {
        res.status(500).json({ status: false, message: e.message });
    }
});

export default router;
