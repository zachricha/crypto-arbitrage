const request = require('request');

let prices = [];

module.exports.cryptopiaPrices = () => {
  request('https://www.cryptopia.co.nz/api/GetMarkets', function(err, res, body) {
    try {
      prices = [];
      body = JSON.parse(body);
      const result = body.Data;

      for(let i = 0; i < result.length; i++) {
        let coin = result[i].Label.split('/')[0];
        let pair = result[i].Label.split('/')[1];

        if(pair !== 'DOGE' && pair !== 'NZDT' && pair !== 'LTC'
        && coin !== 'FCN' && coin !== 'LDC' && coin !== 'BTG'
        && coin !== 'HAV' && coin !== 'WRC') {

          if(coin === 'BCH') {
            coin = 'BCC'
          };

          const bid = result[i].BidPrice;
          const ask = result[i].AskPrice;
          const volume = result[i].BaseVolume;
          prices.push({coin, pair, bid, ask, volume});
        };
      };
    } catch(e) {};
  });
  return prices;
};
