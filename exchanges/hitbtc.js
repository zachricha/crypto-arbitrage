const request = require('request');

var prices = [];

module.exports.hitbtcPrices = () => {
  request('https://api.hitbtc.com/api/2/public/ticker', function(error, response, body) {
    try {
      prices = [];
      body = JSON.parse(body);
      for(i = 0; i < body.length; i++) {
        coin = body[i].symbol.substring(0,body[i].symbol.length-3);
        pair = body[i].symbol.substring(body[i].symbol.length-3,body[i].symbol.length);
        bid = body[i].bid;
        ask = body[i].ask;
        if (pair === "USD") {
          pair = "USDT";
        }
        prices.push([coin, pair, bid, ask]);
      };
    } catch (e) {};
  });
  return prices;
};
