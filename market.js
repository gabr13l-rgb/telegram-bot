const axios = require('axios');

async function getAnalysis(pair) {
  try {
    const res = await axios.get(
      `https://api.twelvedata.com/price?symbol=EUR/USD&apikey=${process.env.MARKET_API_KEY}`
    );
    const price = parseFloat(res.data.price);

    // Dummy indikator
    const rsi = Math.floor(Math.random() * 100);
    const ma = price + (Math.random() - 0.5) * 0.01;

    let trend = price > ma ? "UP 📈" : "DOWN 📉";
    let condition = rsi > 70 ? "Overbought" : rsi < 30 ? "Oversold" : "Neutral";
    let bias = "NEUTRAL";
    let confidence = "Medium";

    if (trend === "UP 📈" && rsi < 70) bias = "BUY";
    else if (trend === "DOWN 📉" && rsi > 30) bias = "SELL";

    return `📊 MARKET UPDATE\n\nPair: ${pair}\nPrice: ${price}\nRSI: ${rsi} (${condition})\nTrend: ${trend}\n\nRekomendasi: ${bias}\nConfidence: ${confidence}`;
  } catch (err) {
    console.error("Market error:", err.message);
    return "⚠️ Error ambil data market";
  }
}

module.exports = { getAnalysis };
