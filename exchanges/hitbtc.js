const request = require('request');

let prices = [];

module.exports.hitbtcPrices = () => {
  request('https://api.hitbtc.com/api/2/public/ticker', function(error, response, body) {
    try {
      prices = [];
      body = JSON.parse(body);
      for(let i = 0; i < body.length; i++) {
        let coin = body[i].symbol.substring(0,body[i].symbol.length-3);
        let pair = body[i].symbol.substring(body[i].symbol.length-3,body[i].symbol.length);
        const bid = body[i].bid;
        const ask = body[i].ask;
        const volume = body[i].volumeQuote;
        if (pair === 'USD') {
          pair = 'USDT';
        };
        if (coin === 'BCH') {
          coin = 'BCC'
        };
        prices.push({coin, pair, bid, ask, volume});
      };
    } catch (e) {};
  });
  return prices;
};
