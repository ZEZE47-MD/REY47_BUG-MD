// config.js

module.exports = {
  // Bot identity
  botName: "BugBot",
  ownerName: "Your Name",

  // WhatsApp owner/admin number(s)
  // Format: with country code, no symbols, just numbers
  admins: ["123456789012"],

  // Command prefix (e.g., !bug, /bug)
  prefix: "!",

  // GitHub integration
  github: {
    repo: "your-username/your-repo-name",
    token: process.env.GITHUB_TOKEN || "", // Use .env for safety
  },

  // Bug report options
  allowAnonymousReports: true, // false = only from admins

  // Cooldown in seconds between reports from the same user
  cooldownSeconds: 30,

  // Message templates (optional, for cleaner index.js)
  messages: {
    welcome: "👋 Hello! I'm BugBot. Send *!bug your issue* to report a bug.",
    bugReceived: "✅ Bug report received. Thank you!",
    missingBugText: "⚠️ Please provide a bug description after the command.",
    cooldownMessage: "⏳ Please wait before sending another bug report.",
    notAdmin: "❌ You are not authorized to use this command.",
    githubError: "🚫 Failed to create GitHub issue. Please try again later.",
  }
};
