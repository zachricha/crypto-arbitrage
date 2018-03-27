const bittrex = require('node-bittrex-api');

var prices = [];

module.exports.bittrexPrices = () => {
  bittrex.getmarketsummaries(function(data, err) {
    try {
      prices = [];
      body = data.result;
      for (i = 0; i < body.length; i++) {
        if (body[i].MarketName.substring(0, 4) === "USDT") {
          coin = body[i].MarketName.substring(5, body[i].MarketName.length);
          pair = body[i].MarketName.substring(0, 4);
        } else {
          coin = body[i].MarketName.substring(4, body[i].MarketName.length);
          pair = body[i].MarketName.substring(0, 3);
        };
        bid = body[i].Bid;
        ask = body[i].Ask;
        prices.push([coin, pair, bid, ask]);
      };
    } catch (e) {};
  });
  return prices;
};