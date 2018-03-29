const request = require('request');

var coinurl = "";
var ids = [];
var prices = [];

module.exports.liquiPrices = () => {
  request('https://api.liqui.io/api/3/info', function(error, response, body) {
    try {
      coinurl = "";
      ids = [];
      prices = [];
      result = JSON.parse(body);
      result = result.pairs;
      for (var key in result) {
        ids.push(key);
      };
      coinurl = ids.join("-");
      getPrices();
    } catch(e) {}
  });

  function getPrices() {
    request('https://api.liqui.io/api/3/ticker/'+coinurl, function(error, response, body) {
      try {
        result = JSON.parse(body);
        for (var key in result) {
          coin = (key.split('_')[0]).toUpperCase();
          pair = (key.split('_')[1]).toUpperCase();
          bid = result[key].buy;
          ask = result[key].sell;
          if(bid > 0) {
            prices.push([coin, pair, bid, ask]);
          };
        };
      } catch (e) {}
    });
  };
  return prices;
};
