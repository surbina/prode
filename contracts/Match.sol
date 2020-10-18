// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract Match {
  uint storedData;

  function set(uint x) public {
    storedData = x;
  }

  function get() public view returns (uint) {
    return storedData;
  }
}
