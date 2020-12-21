/*
    The contract implements exchange BTF-ETH
*/
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract BTF_ETH is Ownable {
    bool public IsActive = true;
    address public contractOwner;
    address public tokenAddress;
    //
    uint256 public Price; // BTF/ETH current price

    using SafeMath for uint256;

    modifier onlyContractOwner() {
        require(
            msg.sender == contractOwner,
            "error account - must be contract owner"
        );
        _;
    }

    constructor(address _tokenAddress) public payable {
        contractOwner = msg.sender;
        tokenAddress = _tokenAddress;
    }

    function SetPrice(uint256 _price) public onlyContractOwner {
        //
        Price = _price;
    }

    // withdraw - to owner address
    function WithdrawBTF(uint256 _amount) public payable onlyContractOwner {
        ERC20 token = ERC20(tokenAddress);
        require(
            token.balanceOf(address(this)) >= _amount,
            "insufficient BTF balance for withdrawal"
        );
        token.transfer(contractOwner, _amount);
    }

    function WithdrawETH(uint256 _amount) public payable onlyContractOwner {
        ERC20 token = ERC20(tokenAddress);
        require(
            address(this).balance >= _amount,            
            "insufficient ETH balance for withdrawal"
        );
        address payable rec = payable(contractOwner);
        rec.transfer(_amount);        
    }

    function Change() public payable {
        ERC20 token = ERC20(tokenAddress);       
        uint256 amountTobuy = (msg.value*10**18).div(Price); 
        uint256 curBalance = token.balanceOf(address(this));
        require(amountTobuy > 0, "You need to send some ether");
        require(amountTobuy <= curBalance, "Not enough tokens in the reserve");
        token.transfer(msg.sender, amountTobuy);         
    }
}
