var db = require('monk')('localhost/evcon');

var accounts = db.get('accounts');
var transactions = db.get('transactions');

function atRandom(list) {
  var position = Math.round(Math.random() * (list.length - 1));
  return list[position]
}

function updateBalance(id, delta) {
  accounts.update({_id:id}, {'$inc': {balance: delta}});
}

function recordTransaction(accountId, amount) {
  transactions.insert({accountId: accountId, amount: amount});
}

var amountProcessed =  0;

var deltas = [1, -1, 100, 2000, 300, -10, -600, -25, 150, -40]

function withAmount(amount, f) {
  f(amount);
  amountProcessed += amount;
}

var interval = setInterval(function() {
  withAmount( atRandom(deltas), function(amount){
    console.log('Perform op with amount '+ amount );
    updateBalance(1, amount);
    recordTransaction(1, amount);
  })
}, 100);

process.on('SIGINT', function() {
  clearInterval(interval);
  console.log("Amount processed " + amountProcessed);
  process.exit(0);
});

