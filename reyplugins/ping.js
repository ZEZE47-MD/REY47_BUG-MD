module.exports = {
  name: "ping",
  description: "Responds with pong to test if the bot is online.",
  execute: async (message) => {
    await message.reply("pong 🏓");
  },
};
