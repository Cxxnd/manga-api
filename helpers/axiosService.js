import axios from "axios";

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
  "Mozilla/5.0 (X11; Linux x86_64)",
  "Mozilla/5.0 (Linux; Android 10; SM-G973F)",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 15_2 like Mac OS X)",
];

let currentAgent = userAgents[0];
setInterval(() => {
  currentAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
  console.log(`[ROTATE UA] ${currentAgent}`);
}, 60 * 1000);

export const AxiosService = axios.create({
  timeout: 20000,
});

AxiosService.interceptors.request.use((config) => {
  config.headers["User-Agent"] = currentAgent;
  config.headers["Accept-Language"] = "en-US,en;q=0.9";
  return config;
});
