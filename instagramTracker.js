const axios = require('axios');

async function checkNewPost(bot, DB) {
  try {
    // Dummy scraping (replace dengan real IG API / puppeteer)
    const fakePostId = Date.now().toString();

    if (DB.lastPostId !== fakePostId) {
      DB.lastPostId = fakePostId;
      broadcast(bot, DB, `📸 New post dari ${DB.targetIG}!`);
    }
  } catch (err) {
    console.error("IG Tracker error:", err.message);
  }
}

async function updateInsights(bot, DB) {
  try {
    broadcast(bot, DB, `📈 Insight update untuk ${DB.targetIG}: Likes 120, Comments 15, Views 500`);
  } catch (err) {
    console.error("IG Insight error:", err.message);
  }
}

function broadcast(bot, DB, message) {
  Object.keys(DB.users).forEach(uid => {
    if (DB.users[uid].active) {
      bot.telegram.sendMessage(uid, message);
    }
  });
}

module.exports = { checkNewPost, updateInsights };
