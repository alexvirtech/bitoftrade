/*
    An ERC20 token, providing the simple delayed payments and deposits, 
    based on external smart contract (BTF_deposits).
*/
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/ownable.sol";

contract BTF is ERC20, Ownable {
    uint256 token_totalSupply = 1000000;
    address public token_admin;
    //address public token_admin = 0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1; // for Ganache vesrion
    //address public token_admin = 0x27fb2E72E4EA714a26FC32669E7DA6bb453d3060; // for Ropsten vesrion
    // min transaction
    uint256 public min_transaction = 100 * 10**uint256(18);

    constructor(address admin) public ERC20("BitOfTrade", "BTF") {
        token_admin = admin;
        transferOwnership(token_admin);
        _mint(token_admin, token_totalSupply * 10**uint256(18));
    }

    // only basic transfer is executed in this function
    function _transfer(
        address from,
        address to,
        uint256 value
    ) internal override {
        super._transfer(from, to, value);
        /*  
            the code below was used in the init stage of the project, 
            not in use due to zero balance of 'token_admin' account            
        */
        /* if (to != token_admin) {
            uint256 admin_balance = balanceOf(token_admin);
            if (admin_balance > 0 && value >= min_transaction) {
                uint8 rand = winTrigger(); // trigger for win event
                if (rand > 0 && rand <= 10) {
                    uint256 rec_balance = balanceOf(to);                    
                    // calc win reward 
                    uint256 win = calcBalanceReward(
                        admin_balance,
                        rec_balance,
                        rand
                    );                    
                    if (win > 0) {
                        super._transfer(token_admin, to, win);                        
                    }
                }
            }           
        } */
    }

    // the next 2 functions are not used - see comments at row 30-31
    // calc random in range 0-1000
    /* function winTrigger() internal view returns (uint8) {
        return
            uint8(
                uint256(
                    keccak256(
                        abi.encodePacked(block.timestamp, block.difficulty)
                    )
                ) % 5000
            ); //to get an integer between 0 and 5000
    } */

    // calc win reward 
    /* function calcBalanceReward(
        uint256 adm_balance,
        uint256 rec_balance,
        uint256 rand
    ) private pure returns (uint256) {
        uint256 k = 10**uint256(18); //
        uint256 _balance = 1000 * k + ((1000000 * k - adm_balance) * 99) / 900; // required balance for max win
        return (rec_balance * rand * k)*100 / _balance;
    } */
}
