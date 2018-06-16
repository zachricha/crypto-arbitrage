const gdax = require('gdax');
const pub = new gdax.PublicClient();

let ids = [];
let coins = [];
let prices = [];
let count = 0;

module.exports.gdaxPrices = () => {
  pub.getProducts((error, response, body) => {
    try {
      ids = [];
      coins = [];
      count = 0;
      prices = [];

      let coin;
      let fcoin;

      for (let i = 0; i < body.length; i++) {
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
          const coin1 = coin.split('-')[0];
          const pair = coin.split('-')[1];
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
        const bid = body.bid;
        const ask = body.ask;
        const volume = body.volume;
        prices.push({coin: coins[count][0],
          pair: coins[count][1],
          bid: parseFloat(bid),
          ask: parseFloat(ask),
          volume: parseFloat(volume),
        });
      } catch (e) {}
      count += 1;
      if (count < ids.length) {
        getPrices();
      };
    });
  };
  return prices;
};
