const bittrex = require('node-bittrex-api');

let prices = [];

module.exports.bittrexPrices = () => {
  bittrex.getmarketsummaries(function(data, err) {
    try {
      prices = [];
      body = data.result;

      let coin;
      let pair;

      for (let i = 0; i < body.length; i++) {
        if (body[i].MarketName.substring(0, 4) === "USDT") {
          coin = body[i].MarketName.substring(5, body[i].MarketName.length);
          pair = body[i].MarketName.substring(0, 4);
        } else {
          coin = body[i].MarketName.substring(4, body[i].MarketName.length);
          pair = body[i].MarketName.substring(0, 3);
        };
        const bid = body[i].Bid;
        const ask = body[i].Ask;
        const volume = body[i].BaseVolume;
        prices.push({coin, pair, bid, ask, volume});
      };
    } catch (e) {};
  });
  return prices;
};
