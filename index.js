require('dotenv').config();
const { Telegraf } = require('telegraf');
const cron = require('node-cron');
const market = require('./market');
const igTracker = require('./instagramTracker');

const bot = new Telegraf(process.env.BOT_TOKEN);

// In-memory DB sementara
const DB = {
  users: {},
  targetIG: process.env.TARGET_IG,
  lastPostId: null,
  posts: {}
};

// Register user saat /start
bot.start((ctx) => {
  const userId = ctx.from.id;
  DB.users[userId] = { active: true, state: {} };
  ctx.reply("🚀 Bot aktif! Kamu otomatis subscribe IG tracker.");
});

// Toggle notif
bot.command('on', (ctx) => {
  DB.users[ctx.from.id].active = true;
  ctx.reply("🔔 Notifikasi aktif");
});

bot.command('off', (ctx) => {
  DB.users[ctx.from.id].active = false;
  ctx.reply("🔕 Notifikasi nonaktif");
});

// Echo message (state per user)
bot.on('text', (ctx) => {
  const userId = ctx.from.id;
  const text = ctx.message.text;

  // Jika sedang main game tebak angka
  const state = DB.users[userId]?.state;
  if (state?.game) {
    const guess = parseInt(text);
    if (guess === state.game) {
      ctx.reply("✅ Bener coy!");
      delete state.game;
    } else {
      ctx.reply("❌ Salah, coba lagi!");
    }
    return;
  }

  ctx.reply(`📩 Kamu bilang: ${text}`);
});

// Market update manual
bot.command('market', async (ctx) => {
  const result = await market.getAnalysis("EUR/USD");
  ctx.reply(result);
});

// Dummy AI / Fun
bot.command('game', (ctx) => {
  const num = Math.floor(Math.random() * 10) + 1;
  ctx.reply("🎮 Tebak angka 1–10!");
  DB.users[ctx.from.id].state.game = num;
});

// Scheduler
cron.schedule('*/5 * * * *', () => igTracker.checkNewPost(bot, DB));
cron.schedule('0 * * * *', () => igTracker.updateInsights(bot, DB));
cron.schedule('*/10 * * * *', async () => {
  const result = await market.getAnalysis("EUR/USD");
  broadcast(bot, DB, result);
});

// Broadcast helper
function broadcast(bot, DB, message) {
  Object.keys(DB.users).forEach(uid => {
    if (DB.users[uid].active) {
      bot.telegram.sendMessage(uid, message);
    }
  });
}

bot.launch();
