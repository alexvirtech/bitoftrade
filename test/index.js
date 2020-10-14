// test utils for smart contract deployed to ganache
const utils = require('./utils');
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545'); 

let a = '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0';   //
let b = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1';   // owner
let c = utils.saverAddress;   // contract address
let d = '0x3E5e9111Ae8eB78Fe1CC3bb8915d5D461F3Ef9A9';

let a1 = '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b';
let d1 = '0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d';

// show all account balances
//utils.showAccounts();

// send init interest fund to contract
const prepareDeposits = () => {
    utils.send(b, c, 200000, () => {
        utils.showAccounts();
        utils.send(b, a, 50000, () => {
            utils.deposit(a, 1000, 1, () => { console.log(1) });
            utils.deposit(b, 5000, 1, () => { console.log(1) });
        });
    });
}

const withdraw = (x) =>{
    utils.withdraw(x, () => {
        utils.depReportAll(console.log);
    });
}

//prepareDeposits();
//utils.depReportAll(console.log);
//withdraw(a);
//withdraw(b);
//utils.deposit(b, 11000, 1, () => { utils.depReportAll(console.log)});

//utils.clearReturned(b,()=>{utils.depReportAll(console.log)})

//utils.sendETH(b,c,10);

//utils.send(b,a,50000,utils.showAccounts); 

// all deposits and dpayments report
//utils.depReportAll(console.log);

utils.depReportAll(ar=>{
    ar.map(d=>{
        let s = 'owner:\t' + d.owner + '\n' +
                'dtime:\t' + (new Date(parseInt(d.dtime)*1000)) + '\n' +
                'amount:\t' + Web3.utils.fromWei(d.amount, 'ether') + '\n' +
                'expiration:\t' + (new Date(parseInt(d.deadline)*1000)) + '\n\n';
                console.log(s);
    })    
});


//utils.deposit(b,5000,3,()=>{console.log(1)});
//utils.deposit(a,1000,1,()=>{console.log(1)});

/* utils.withdraw(b, () => {
    //utils.showAccounts();
    utils.depReportAll(console.log);
}); */

/*
utils.deposit(b,5000,2,()=>{console.log(2)});
utils.deposit(b,5000,12,()=>{console.log(3)}); */

/*
utils.deposit(a,50000,12,()=>{console.log(1)});
utils.deposit(a,50000,12,()=>{console.log(2)});
utils.deposit(a,50000,12,()=>{console.log(3)});
utils.deposit(a,50000,12,()=>{console.log(4)}); */


// send tokens from admin to other accounts 
//utils.send(b,a,50000,()=>{utils.send(b,d,50000,utils.showAccounts);}); 
//utils.send(b,a1,50000,()=>{utils.send(b,d1,50000,utils.showAccounts);}); 

/* utils.deposit(a,10000,3,()=>{console.log(a)});
utils.deposit(b,10000,3,()=>{console.log(b)});
utils.deposit(d,10000,3,()=>{console.log(d)});
utils.deposit(a1,10000,12,()=>{console.log(a1)});
utils.deposit(d1,10000,12,()=>{console.log(d1)}); */


// check token balance in contract
//utils.tokenBalance(console.log);

// create deposit 
//utils.deposit(a,50000,12,()=>{ utils.depReportAll(console.log);}); 
//utils.deposit(b,50000,12,()=>{ utils.depReportAll(console.log);}); 

// delayed payment
//utils.dpayment(a,d,1000.25,6,()=>{ utils.depReportAll(console.log);}); 

// total deposits and delayed payments balance
//utils.depTotalBalance(console.log);

// report for specified account
//utils.depReport(a,console.log);

// report for account sending the request
//utils.depReportA(console.log);

// withdraw (for account - testnet only)
//utils.withdraw(b,utils.showAccounts);

// calc interest
// utils.depRate(50000,12,console.log);
