const request = require('request');

let prices = [];

module.exports.kucoinPrices = () => {
  request('https://api.kucoin.com/v1/open/tick', function(error, response, body) {
    try {
      prices = [];
      body = JSON.parse(body).data;

      let coin;
      let pair;

      for (let i = 0; i < body.length; i++) {
        coin = body[i].coinType;
        pair = body[i].coinTypePair;
        if (coin !== "KCS" && pair !== "KCS" && coin != "BTM") {
          if (coin === "BCH") {
            coin = "BCC";
          } else if (pair === "BCH") {
            pair = "BCC";
          }
          const bid = body[i].buy;
          const ask = body[i].sell;
          const volume = body[i].volValue;
          prices.push({coin, pair, bid, ask, volume});
        };
      };
    } catch (e) {}
  });
  return prices;
};
