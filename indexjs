// index.js
const { Boom } = require('@hapi/boom');
const makeWASocket = require('@whiskeysockets/baileys').default;
const { useSingleFileAuthState } = require('@whiskeysockets/baileys');
const axios = require('axios');
const fs = require('fs');

const { state, saveState } = useSingleFileAuthState('./auth_info.json');

async function startBot() {
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on('creds.update', saveState);

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const sender = msg.key.remoteJid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

    if (text?.toLowerCase().startsWith('bug:')) {
      const bugDescription = text.slice(4).trim();
      await sendGitHubIssue(bugDescription, sender);

      await sock.sendMessage(sender, {
        text: '✅ Bug reported successfully to GitHub!',
      });
    }
  });
}

async function sendGitHubIssue(description, sender) {
  const GITHUB_TOKEN = 'your_github_token_here';
  const REPO_OWNER = 'your_username';
  const REPO_NAME = 'your_repo';

  const issueData = {
    title: `Bug report from ${sender}`,
    body: description,
    labels: ['bug', 'whatsapp-bot'],
  };

  try {
    const res = await axios.post(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
      issueData,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );
    console.log('✅ Issue created:', res.data.html_url);
  } catch (err) {
    console.error('❌ Failed to create GitHub issue:', err.message);
  }
}

startBot();
