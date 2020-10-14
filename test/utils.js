const Web3 = require('web3');
const { setupLoader } = require('@openzeppelin/contract-loader');
const web3 = new Web3('http://localhost:8545'); 
const saverAddress = '0xCfEB869F69431e42cdB54A4F4f105C19C080A601'; 
const BtfAddress = '0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab';
const loader = setupLoader({ provider: web3 }).web3;
const tkn = loader.fromArtifact('BTF', BtfAddress);
const saver = loader.fromArtifact('BtfDepositPool', saverAddress);
//var Tx = require('ethereumjs-tx');

function showAccounts() {
    web3.eth.getAccounts().then(accounts => {
        accounts.map(async (a) => {
            const val = await tkn.methods.balanceOf(a).call();
            let am = Web3.utils.fromWei(val, 'ether');
            console.log(`${a} balance = ${am}`);
        })
    })
} 

function send(from, to, amount, callback) {
    let am = Web3.utils.toWei(amount.toString(), 'ether');
    tkn.methods.transfer(to, am)
        .send({ from: from, gas: 500000, gasPrice: 1e6 })
        .then(t => {
            console.log(t.transactionHash);
            callback();
        })
}

function deposit(from, amount, days, callback) {
    let am = Web3.utils.toWei(amount.toString(), 'ether');
    tkn.methods.approve(saverAddress, am).send({ from: from }, (err, transactionHash) => {
        saver.methods
            .deposit(am,days)
            .send({ from: from, gas: 500000, gasPrice: 1e6 })
            .then(t => {
                console.log(t.transactionHash);
                callback();
            })
    })
}

function dpayment(from, to, amount, days, callback) {
    let am = Web3.utils.toWei(amount.toString(), 'ether');
    tkn.methods.approve(saverAddress, am).send({ from: from }, (err, transactionHash) => {
        saver.methods
            .dpayment(to,am,days)
            .send({ from: from, gas: 500000, gasPrice: 1e6 })
            .then(t => {
                console.log(t.transactionHash);
                callback();
            })
    })
}

function withdraw(addr,callback){
    saver.methods.withdraw()
       .send({ from: addr, gas: 300000, gasPrice: 1e6 })
       .then(t => {
           console.log(t.transactionHash);
           callback();
           /* saver.methods.balance().call()
               .then(t => {
                   let am = Web3.utils.fromWei(t, 'ether');
                   console.log(am);
                   callback();
               }) */
       })  
   }

function clearReturned(addr, callback){
    saver.methods.clearReturnedDeposits()
       .send({ from: addr, gas: 300000, gasPrice: 1e6 })
       .then(t => {
           console.log(t.transactionHash);
           callback();          
       })  
}

function tokenBalance(callback){ // in contract
    saver.methods.balance().call().then((b)=>{
        let am = Web3.utils.fromWei(b.toString(), 'ether');
        callback(am);
    });
}

function depReportAll(callback){  //depReportAll
    saver.methods.depReportAll().call()
        .then((b)=>{
            callback(b);
        });
}

function depReportA(callback){ 
    saver.methods.depReportA().call()       
        .then((b)=>{
            callback(b);
        });
}

function depReport(a,callback){
    saver.methods.depReport(a).call()       
        .then((b)=>{
            callback(b);
        });
}

// calc interest based on amount and interval
function depRate(amount,numberOfDays,callback){ 
    let am = Web3.utils.toWei(amount.toString(), 'ether');
    saver.methods.depRate(am,numberOfDays).call()       
        .then((b)=>{
            let a = Web3.utils.fromWei(b.toString(), 'ether');
            callback(a);
        });
}

function depTotalBalance(callback){ 
    saver.methods.depTotalBalance().call().then((b)=>{
        let am = Web3.utils.fromWei(b.toString(), 'ether');
        callback(am);
    });
}

module.exports = {
    saver,
    tkn,
    showAccounts,
    send,
    deposit,
    withdraw,
    tokenBalance,
    depTotalBalance,        
    saverAddress,
    depReportAll,
    depReport,
    depReportA,
    depRate,
    dpayment,
    clearReturned
}