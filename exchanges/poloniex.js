const request = require('request');

var prices = [];

module.exports.poloniexPrices = () => {
  request('https://poloniex.com/public?command=returnTicker', function(error, response, body) {
    try {
      prices = [];
      body = JSON.parse(body);
      for (var key in body) {
        pair = key.split('_')[0];
        coin = key.split('_')[1];
        bid = body[key].highestBid;
        ask = body[key].lowestAsk;
        prices.push([coin, pair, bid, ask]);
      };
    } catch (e) {};
  });
  return prices;
};