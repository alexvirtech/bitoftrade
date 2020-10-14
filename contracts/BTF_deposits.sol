/*
    The contract implements simple deposits, 
    providing to depositor interest according to amount, expiration period 
    and availible interest fund. 
    MainNet Version (14/10/2020)
*/
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BTFDepositPool {
    bool public IsFree = true;
    address public contractOwner;
    address public tokenAddress;
    uint256 public minDeposit = 1000 * 10**18;
    uint256 public maxDeposit = 50000 * 10**18;
    uint256 public maxNumberOfMonths = 12; // 360;
    uint256 public minNumberOfMonths = 1; // 1;
    uint256 private maxInterestCoef = 5;

    struct Deposit {
        address owner;
        uint256 dtime; // deposit time
        uint256 amount; // deposit amount
        uint256 balance; // amount to withdrawal
        uint256 deadline; // expiration
        bool closed;
    }    

    // array of active deposits
    Deposit[] public deposits;

    constructor(address _tokenAddress) public payable {
        contractOwner = msg.sender;
        tokenAddress = _tokenAddress;
    }   

    // depositor actions
    function deposit(uint256 amount, uint256 numberOfMonths) public payable {
        // init access to the basic token
        ERC20 token = ERC20(tokenAddress);
        // min, max, interval constrains
        require(
            amount >= minDeposit,
            "btf_error: [amount must be not less than minDeposit]"
        );
        require(
            amount <= maxDeposit,
            "btf_error: [amount must be not greater than maxDeposit]"
        );
        require(
            numberOfMonths >= minNumberOfMonths,
            "btf_error: [interval must be not less than minNumberOfDays]"
        );
        require(
            numberOfMonths <= maxNumberOfMonths,
            "btf_error: [interval must be not not greater than maxNumberOfDays]"
        );
        // the owner balance must be not less than amount
        require(
            token.balanceOf(msg.sender) >= amount,
            "btf_error: [insufficient balance]"
        );
        
        uint256 deadline = now + (numberOfMonths * 30 * 1 days);       
        uint256 depositBalance = amount + depRate(amount, numberOfMonths);

        bool isNotMoved = true;
        for (uint i = 0; i < deposits.length; i++) {
            if (isNotMoved && deposits[i].closed) 
            {
                deposits[i].owner = msg.sender;
                deposits[i].dtime = now;
                deposits[i].amount = amount;
                deposits[i].balance = depositBalance;
                deposits[i].deadline = deadline;
                deposits[i].closed = false;
                isNotMoved = false;
            }
        }                
        if(isNotMoved){
            deposits.push(Deposit(msg.sender, now, amount, depositBalance, deadline,false));
        }

        // try to send the tokens from sender to contract
        token.transferFrom(msg.sender, address(this), amount);

    }

    // withdraw - to deposit owner address
    function withdraw() public payable {
        ERC20 token = ERC20(tokenAddress);
        for (uint256 i = 0; i < deposits.length; i++) {
            if (
                deposits[i].owner == msg.sender &&
                now >= deposits[i].deadline &&
                (!deposits[i].closed)
            ) {
                token.transfer(msg.sender, deposits[i].balance);
                deposits[i].closed = true;
            }
        }
    }

    // get deposit reports for the sender
    function depReport(address a) public view returns (Deposit[] memory) {
        Deposit[] memory deps = new Deposit[](deposits.length);
        uint256 n = 0;
        for (uint256 i = 0; i < deposits.length; i++) {
            if (deposits[i].owner == a && deposits[i].balance > uint256(0)) {
                deps[n] = Deposit(
                    deposits[i].owner,
                    deposits[i].dtime,
                    deposits[i].amount,
                    deposits[i].balance,
                    deposits[i].deadline,
                    deposits[i].closed
                );
                n++;
            }
        }
        return deps;
    }

    // get msg.sender deposits
    function depReportA() public view returns (Deposit[] memory) {
        return depReport(msg.sender);
    }

    // check total deposits & delayed payments balance
    function depTotalBalance() public view returns (uint256) {
        uint256 res = 0;
        for (uint256 i = 0; i < deposits.length; i++) {
            if (!deposits[i].closed) {
                res += deposits[i].balance;
            }
        }
        return res;
    }

    // check pool balance
    function balance() public view returns (uint256) {
        ERC20 token = ERC20(tokenAddress);
        return token.balanceOf(address(this));
    }

    // get deposit reports for all users
    function depReportAll() public view returns (Deposit[] memory) {
        return deposits;
    }

    // math
    // maximal bonus
    function maxBonus(uint256 amount) internal view returns (uint256) {
        uint256 b = (balance() - depTotalBalance()) / maxInterestCoef; // max bonus must be <= 1/maxInteresrCoef of free balance
        require(b > 0, "btf_error: [sorry, the deposit fund is empty...]");
        uint256 max = 50000 * 10**18; // abs max bonus
        if (b > max) return amount;
        else return (b * amount) / max;
    }

    // deposit interest rate
    function depRate(uint256 amount, uint256 numberOfDays)
        public
        view
        returns (uint256)
    {
        uint256 a1 = 673;
        uint256 a2 = 1304;
        uint256 a3 = 1276;
        uint256 am = amount / (1000 * 10**18);
        return
            (maxBonus(amount) *
                (am * a1 + am * numberOfDays * a2 + a3 * numberOfDays**2)) /
            1000000;
    }
}
