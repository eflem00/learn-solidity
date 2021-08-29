pragma solidity ^0.4.17;

contract Inbox {
    string public message;

    function Inbox(string initialMessage) public {
        message = initialMessage;
    }

    function setMessage(string newMessage) public {
        message = newMessage;
    }

    // each underlying op has a fixed gas price
    function doMath(int256 a, int256 b) {
        a + b;
        b - a;
        a * b;
        a == 0;
    }
}
