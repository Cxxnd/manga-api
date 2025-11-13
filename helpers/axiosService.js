// services/AxiosService.js
const axios = require("axios");

// Fungsi untuk ganti User-Agent otomatis setiap 1 menit
let currentUserAgent = getRandomUserAgent();
setInterval(() => {
  currentUserAgent = getRandomUserAgent();
  console.log(`[Rotate UA] ${currentUserAgent}`);
}, 60000);

function getRandomUserAgent() {
  const agents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    "Mozilla/5.0 (X11; Linux x86_64)",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
    "Mozilla/5.0 (Android 10; Mobile; rv:94.0) Gecko/94.0 Firefox/94.0",
  ];
  return agents[Math.floor(Math.random() * agents.length)];
}

const AxiosService = async (url) => {
  return axios.get(url, {
    headers: {
      "User-Agent": currentUserAgent,
      "Accept": "text/html,application/xhtml+xml,application/xml",
    },
    timeout: 15000,
  });
};

module.exports = AxiosService;
