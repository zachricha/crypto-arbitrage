const request = require('request');

var prices = [];

module.exports.kucoinPrices = () => {
  request('https://api.kucoin.com/v1/open/tick', function(error, response, body) {
    try {
      prices = [];
      body = JSON.parse(body).data;
      for (i = 0; i < body.length; i++) {
        coin = body[i].coinType;
        pair = body[i].coinTypePair;
        if (coin !== "KCS" && pair !== "KCS" && coin != "BTM") {
          if (coin === "BCH") {
            coin = "BCC";
          } else if (pair === "BCH") {
            pair = "BCC";
          }
          bid = body[i].buy;
          ask = body[i].sell;
          prices.push([coin, pair, bid, ask]);
        };
      };
    } catch (e) {}
  });
  return prices;
};
