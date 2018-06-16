const request = require('request');

let prices = [];

module.exports.poloniexPrices = () => {
  request('https://poloniex.com/public?command=returnTicker', function(error, response, body) {
    try {
      prices = [];
      body = JSON.parse(body);
      for (let key in body) {
        const pair = key.split('_')[0];
        const coin = key.split('_')[1];
        const bid = body[key].highestBid;
        const ask = body[key].lowestAsk;
        const volume = body[key].BaseVolume;
        prices.push({coin, pair, bid, ask, volume});
      };
    } catch (e) {};
  });
  return prices;
};
