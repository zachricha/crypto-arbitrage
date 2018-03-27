const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.use('/assets', express.static('assets'));

const {
  bitPrices,
  binPrices,
  gdxPrices,
  kuPrices,
  poloPrices,
} = require('./exchanges');

var bit, bin, gdax, kucoin, polo = [];

var arbOpp = [];
var btcArr = [];

const time = 16000; // time for data to update

function getExchanges() {
  bit = bitPrices.bittrexPrices();
  bin = binPrices.binancePrices();
  gdax = gdxPrices.gdaxPrices();
  kucoin = kuPrices.kucoinPrices();
  polo = poloPrices.poloniexPrices();
};

function sorted(a, b) {
  if (a[6] === b[6]) {
    return 0;
  } else {
    return (a[6] < b[6]) ? -1 : 1;
  };
};

function sorted2(a, b) {
  if (a[1] === b[1]) {
    return 0;
  } else {
    return (a[1] < b[1]) ? -1 : 1;
  };
};

function duplicates(arr) {
  var uniques = [];
  var itemsFound = {};
  for (var i = 0, l = arr.length; i < l; i++) {
    var stringified = JSON.stringify(arr[i]);
    if (itemsFound[stringified]) {
      continue;
    }
    uniques.push(arr[i]);
    itemsFound[stringified] = true;
  }
  return uniques;
}

function getAllPrices() {
  arbOpp = [];
  btcArr = [];
  var exchanges = [
    ['Bittrex', bit, 'https://bittrex.com'],
    ['Binance', bin, 'https://www.binance.com'],
    ['Gdax', gdax, 'https://www.gdax.com'],
    ['KuCoin', kucoin, 'https://www.kucoin.com'],
    ['Poloniex', polo, 'https://poloniex.com'],
  ];

  exchanges.forEach(function(exchange) {
    for (i = 0; i < exchange[1].length; i++) {
      exchanges.forEach(function(exchange2) {
        for (j = 0; j < exchange2[1].length; j++) {
          if (exchange[0] === exchange2[0]) {
            break;
          } else if (exchange[1][i][0] + exchange[1][i][1] === exchange2[1][j][0] + exchange2[1][j][1]) {
            if (exchange[1][i][0] === "BTC") {
              btcArr.push([exchange[0], exchange[1][i][3]]);
            };
            if ((exchange2[1][j][2] / exchange[1][i][3]) > 1.01) { //bid-ask or exchange2[1][j][1] / exchange[1][i][2]
              percent = Math.round(((exchange2[1][j][2] / exchange[1][i][3]) * 100 - 100) * 100) / 100; // bid-ask
              if (exchange[1][i][1] === "USDT") {
                exchange[1][i][1] = "USD";
              };
              arbOpp.push([exchange[1][i][0], exchange[1][i][1], exchange[0], exchange[1][i][3], exchange2[0], exchange2[1][j][2], percent, exchange[2], exchange2[2]]); // ask-bid
            };
          };
        };
      });
    };
  });
  arbOpp = arbOpp.sort(sorted);
  btcArr = btcArr.sort(sorted2);
  btcArr = btcArr.reverse();
  btcArr = duplicates(btcArr);
  arbOpp = arbOpp.reverse();
  getExchanges();
  setTimeout(getAllPrices, time);
};

getExchanges();
setTimeout(getAllPrices, time);

app.get("/", function(req, res) {
  res.render('index', {
    arbOpp: arbOpp,
    btcArr: btcArr,
  });
});

app.listen(3000, function() {
  console.log("server is starting at port 3000...");
});