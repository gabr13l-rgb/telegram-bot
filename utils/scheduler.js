const cron = require('node-cron');

function setupSchedulers(bot, DB, market, igTracker, broadcast) {
  cron.schedule('*/5 * * * *', () => igTracker.checkNewPost(bot, DB));
  cron.schedule('0 * * * *', () => igTracker.updateInsights(bot, DB));
  cron.schedule('*/10 * * * *', async () => {
    const result = await market.getAnalysis("EUR/USD");
    broadcast(bot, DB, result);
  });
}

module.exports = { setupSchedulers };
