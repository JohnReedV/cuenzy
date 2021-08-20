// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract DappToken {
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    string public name = "Cuenzy";
    string public symbol = "CNZ";
    string public standard = "Cuenzy V1.0";
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    constructor() public {
        totalSupply = 10000000;
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success){
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        
        return true;
    }
}