const gdax = require('gdax');
const pub = new gdax.PublicClient();

var ids = [];
var coins = [];
var prices = [];
var count = 0;

module.exports.gdaxPrices = () => {
  pub.getProducts((error, response, body) => {
    try {
      ids = [];
      coins = [];
      count = 0;
      prices = [];
      for (i = 0; i < body.length; i++) {
        if (body[i].id.substring(4, body[i].id.length) !== "EUR" && body[i].id.substring(4, body[i].id.length) !== "GBP") {
          coin = body[i].id;
          fcoin = body[i].id.substring(0, 4);
          if (fcoin === "BCH-") {
            fcoin = "BCC-";
          };
          if (body[i].id.substring(4, body[i].id.length) === "USD") {
            coin = fcoin + "USDT";
          } else {
            coin = fcoin + "BTC";
          };
          coin1 = coin.split('-')[0];
          pair = coin.split('-')[1];
          coins.push([coin1, pair]);
          ids.push(body[i].id);
        };
      };
      getPrices();
    } catch (e) {}
  });

  function getPrices() {
    pub.getProductTicker(ids[count], (error, response, body) => {
      try {
        bid = body.bid;
        ask = body.ask;
        prices.push([coins[count][0], coins[count][1], parseFloat(bid), parseFloat(ask)]);
      } catch (e) {}
      count += 1;
      if (count < ids.length) {
        getPrices();
      };
    });
  };
  return prices;
};