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
  liqPrices,
  hitPrices,
  cryptPrices,
} = require('./exchanges');

let bit, bin, gdax, kucoin, polo, liqui, hitb, cryptop = [];

let arbArr = [];
let btcArr = [];

const time = 10000;

function getExchanges() {
  bit = bitPrices.bittrexPrices();
  bin = binPrices.binancePrices();
  gdax = gdxPrices.gdaxPrices();
  kucoin = kuPrices.kucoinPrices();
  polo = poloPrices.poloniexPrices();
  liqui = liqPrices.liquiPrices();
  hitb = hitPrices.hitbtcPrices();
  cryptop = cryptPrices.cryptopiaPrices();
};

function sortArbitrage(a, b) {
  if (a.percent === b.percent) {
    return 0;
  } else {
    return (a.percent < b.percent) ? 1 : -1;
  };
};

function sortBtc(a, b) {
  if (a.price === b.price) {
    return 0;
  } else {
    return (a.price < b.price) ? 1 : -1;
  };
};

function duplicates(arr) {
  let uniques = [];
  let itemsFound = {};
  for (let i = 0, l = arr.length; i < l; i++) {
    let stringified = JSON.stringify(arr[i]);
    if (itemsFound[stringified]) {
      continue;
    }
    uniques.push(arr[i]);
    itemsFound[stringified] = true;
  }
  return uniques;
}

function getAllPrices() {

  arbArr = [];
  btcArr = [];

  let newBtcPrice;
  let checkPair;

  let exchanges = [
    ['Bittrex', bit, 'https://bittrex.com'],
    ['Binance', bin, 'https://www.binance.com'],
    ['Gdax', gdax, 'https://www.gdax.com'],
    ['KuCoin', kucoin, 'https://www.kucoin.com'],
    ['Poloniex', polo, 'https://poloniex.com'],
    ['Liqui', liqui, 'https://liqui.io'],
    ['HitBTC', hitb, 'https://hitbtc.com'],
    ['Cryptopia', cryptop, 'https://cryptopia.co.nz'],
  ];

  exchanges.forEach(function(exchange) {
    exchanges.forEach(function(exchange2) {
      if (exchange[0] === exchange2[0]) {
        return;
      };
      for (i = 0; i < exchange[1].length; i++) {
        for (j = 0; j < exchange2[1].length; j++) {
          if(exchange[1][i].coin + exchange[1][i].pair === exchange2[1][j].coin + exchange2[1][j].pair) {
            if (exchange[1][i].coin === "BTC" && exchange[1][i].pair === "USDT") {
              newBtcPrice = +parseFloat(exchange[1][i].ask).toFixed(2);
              btcArr.push({exch: exchange[0], price: newBtcPrice});
            };
            if ((exchange2[1][j].bid / exchange[1][i].ask) > 1.001) {
              percent = Math.round(((exchange2[1][j].bid / exchange[1][i].ask) * 100 - 100) * 100) / 100;
              if (exchange[1][i].pair === "USDT") {
                checkPair = "USD";
              } else {
                checkPair = exchange[1][i].pair;
              }

              if(exchange[1][i].volume > 0 && exchange2[1][j].volume > 0
              && percent < 10000) {

                arbArr.push({
                  coin: exchange[1][i].coin,
                  pair: checkPair,
                  exch1: exchange[0],
                  exch1Vol: exchange[1][i].volume,
                  ask: exchange[1][i].ask,
                  exch2: exchange2[0],
                  exch2Vol: exchange2[1][j].volume,
                  bid: exchange2[1][j].bid,
                  percent: percent,
                  exchUrl1: exchange[2],
                  exchUrl2: exchange2[2],
                });

              };
            };
          };
        };
      };
    });
  });

  arbArr = arbArr.sort(sortArbitrage);
  btcArr = btcArr.sort(sortBtc);
  btcArr = duplicates(btcArr);
  getExchanges();
};

getExchanges();
setInterval(getAllPrices, time);

app.get("/", function(req, res) {
  res.render('index', { arbArr, btcArr });
});

app.listen(3000, function() {
  console.log("server is starting at port 3000...");
});
