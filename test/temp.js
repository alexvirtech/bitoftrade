window.addEventListener('load', function () {
    // Check if Web3 has been injected by the browser:
    if (typeof web3 !== 'undefined') {
        // You have a web3 browser! Continue below!
        startApp(web3);
    } else {
        // Warn the user that they need to get a web3 browser
        // Or install MetaMask, maybe with a nice graphic.
    }
});

const contract_address = '0xf035755df96ad968a7ad52c968dbe86d52927f5b';
var eth = null;
function startApp(web3) {
    //alert("entro");
    document.getElementById("etherlog").innerHTML = "Enterng web3<br>";
    eth = new Eth(web3.currentProvider);
    //alert("llego");
    web3.eth.getBalance(contract_address, function (error, result) {
        try {
            if (!error) {
                console.log('Ether:', web3.fromWei(result, 'ether'));
                document.getElementById("etherlog").innerHTML += web3.fromWei(result, 'ether') + " ETH Account Balance<br>";
            } else
                console.log('Error: ', error);
        } catch (err) {
            console.log('Error: ', err.message);
        }
    });

    var addr = ('0xf035755df96ad968a7ad52c968dbe86d52927f5b');
    var contractAddr = ('0xf035755df96ad968a7ad52c968dbe86d52927f5b');
    // Get the address ready for the call, substring removes the '0x', as its not required
    var tknAddress = (addr).substring(2);
    // '0x70a08231' is the contract 'balanceOf()' ERC20 token function in hex. A zero buffer is required and then we add the previously defined address with tokens
    var contractData = ('0x70a08231000000000000000000000000' + tknAddress);
    web3.eth.call({
        to: contractAddr, // Contract address, used call the token balance of the address in question
        data: contractData // Combination of contractData and tknAddress, required to call the balance of an address 
    }, function (err, result) {
        if (result) {
            console.log('Tokens Owned: ' + web3.fromWei(result, 'ether')); // Change the string to be in Ether not Wei, and show it in the console
            document.getElementById("etherlog").innerHTML += web3.fromWei(result, 'ether') + " Tokens Account Balance<br>";
        } else {
            console.log(err); // Dump errors here
        }
    });

    var ethTx = ('0x20037a996e83b5ba3dd9e75e6e6af6d50e60b6ee73c2a706df2172f80a18c34b');
    web3.eth.getTransaction(ethTx, function (err, result) {
        if (!err) {
            document.getElementById("etherlog").innerHTML += 'Tx 0x20037a996e83b5ba3dd9e75e6e6af6d50e60b6ee73c2a706df2172f80a18c34b' + "<br>";
            console.log('From Address: ' + result.from);
            document.getElementById("etherlog").innerHTML += 'From Address: ' + result.from + "<br>";
            console.log('To Address: ' + result.to);
            document.getElementById("etherlog").innerHTML += 'To Address: ' + result.to + "<br>";
            console.log('Ether Transacted: ' + (web3.fromWei(result.value, 'ether')));
            document.getElementById("etherlog").innerHTML += 'Ether Transacted: ' + (web3.fromWei(result.value, 'ether')) + "<br>";
        } else {
            console.log('Error!', err);
        }
    });

}
