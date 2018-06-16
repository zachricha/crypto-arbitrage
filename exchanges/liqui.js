const request = require('request');

let coinurl = "";
let ids = [];
let prices = [];

module.exports.liquiPrices = () => {
  request('https://api.liqui.io/api/3/info', function(error, response, body) {
    try {
      coinurl = "";
      ids = [];
      prices = [];
      body = JSON.parse(body);
      body = body.pairs;
      for (let key in body) {
        ids.push(key);
      };
      coinurl = ids.join("-");
      getPrices();
    } catch(e) {}
  });

  function getPrices() {
    request('https://api.liqui.io/api/3/ticker/'+coinurl, function(error, response, body) {
      try {
        body = JSON.parse(body);
        for (let key in body) {
          const coin = (key.split('_')[0]).toUpperCase();
          const pair = (key.split('_')[1]).toUpperCase();
          const bid = body[key].buy;
          const ask = body[key].sell;
          const volume = body[key].vol;
          if(bid > 0) {
            prices.push({coin, pair, bid, ask, volume});
          };
        };
      } catch (e) {}
    });
  };
  return prices;
};
