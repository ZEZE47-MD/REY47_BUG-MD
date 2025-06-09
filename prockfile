require("dotenv").config();

const { Client, LocalAuth } = require("whatsapp-web.js");
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = process.env.PORT || 3000;

// === WhatsApp Client Setup ===
const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  console.log("Scan this QR code:", qr);
});

client.on("ready", () => {
  console.log("WhatsApp client is ready!");
});

client.on("message", async (message) => {
  // Simple test command: reply "pong" if message is "!ping"
  if (message.body === "!ping") {
    await message.reply("pong 🏓");
  }

  // Here you can add your bug reporting logic or command handler
});

client.initialize();

// === Proxy Middleware Setup ===
// Proxy all requests from /api to TARGET_URL (e.g., GitHub API)
const TARGET_URL = process.env.TARGET_URL || "https://api.github.com";

app.use(
  "/api",
  createProxyMiddleware({
    target: TARGET_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api": "", // Remove /api prefix before forwarding
    },
    onProxyReq: (proxyReq, req, res) => {
      // You can modify headers here, for example add GitHub token:
      const token = process.env.GITHUB_TOKEN;
      if (token) {
        proxyReq.setHeader("Authorization", `token ${token}`);
      }
    },
  })
);

// Simple root route
app.get("/", (req, res) => {
  res.send("🤖 BugBot with Proxy Server is running");
});

// Start express server
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
