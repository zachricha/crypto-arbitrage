const request = require('request');

var prices = [];

module.exports.binancePrices = () => {
  request('https://api.binance.com/api/v1/ticker/allBookTickers', function(error, response, body) {
    try {
      prices = [];
      body = JSON.parse(body);
      for (i = 0; i < body.length; i++) {
        symbol = body[i]['symbol'];
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
          bid = parseFloat(body[i]['bidPrice']);
          ask = parseFloat(body[i]['askPrice']);
          prices.push([coin, pair, bid, ask]);
        };
      };
    } catch (e) {};
  });
  return prices;
};