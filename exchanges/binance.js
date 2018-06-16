const request = require('request');

let prices = [];

module.exports.binancePrices = () => {
  request('https://api.binance.com/api/v1/ticker/allBookTickers', function(error, response, body) {
    try {
      prices = [];
      body = JSON.parse(body);
      for (let i = 0; i < body.length; i++) {
        const symbol = body[i]['symbol'];

        let coin;
        let pair;

        if (symbol.substring(symbol.length - 3, symbol.length) !== "BNB") {
          if (symbol.substring(symbol.length - 4, symbol.length) === "USDT") {
            coin = symbol.replace("USDT", "");
            pair = "USDT";
          } else if (symbol.substring(symbol.length - 3, symbol.length) === "BTC") {
            coin = symbol.replace("BTC", "");
            pair = "BTC";
          } else {
            pair = "ETH";
            coin = symbol.replace("ETH", "");
          }
          const bid = parseFloat(body[i]['bidPrice']);
          const ask = parseFloat(body[i]['askPrice']);
          const volume = parseFloat(body[i]['quoteVolume']);
          prices.push({coin, pair, bid, ask, volume});
        };
      };
    } catch (e) {};
  });
  return prices;
};
