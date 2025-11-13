require('dotenv').config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const manga = require("./routers/manga");
const chapter = require("./routers/chapter");
const cors = require("cors");
const helmet = require("helmet");

app.use(cors());
app.use(helmet());
app.use("/api", manga);
app.use(express.static("./public"));
app.use("/api/chapter", chapter);
app.use("", (req, res) => {
  res.status(404).json({
    success: false,
    message: "access to /api for using this service/wrong endpoint",
  });
});
// Route utama
app.get("/", (req, res) => {
  res.json({
    status: "running",
    author: "Sanka Vollerei",
    routes: {
      anime: ["/api/anime/home", "/api/anime/search/:query"],
      manga: ["/api/manga/page/:page", "/api/manga/detail/:slug"],
    },
  });
});

app.use("/api", animeRouter);
app.use("/api", mangaRouter);

app.listen(PORT, () => console.log("🚀 API Ready at http://localhost:5000"));
