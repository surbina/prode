import React, { Component } from "react";
import MatchContract from "./contracts/Match.json";
import getWeb3 from "./getWeb3";
import Match from './Match';

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // const balance0 = await web3.eth.getBalance(accounts[0]);
      // const balance1 = await web3.eth.getBalance(accounts[1]);
      // const balance2 = await web3.eth.getBalance(accounts[2]);

      // console.log({balance0, balance1, balance2});

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MatchContract.networks[networkId];
      const instance = new web3.eth.Contract(
        MatchContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  // runExample = async () => {
  //   const { accounts, contract } = this.state;

  //   // Stores a given value, 5 by default.
  //   // TODO: how can I send money with this?
  //   // const web3 = await getWeb3();
  //   // const balance = await web3.eth.getBalance(accounts[0]);
  //   const estimate = await contract.methods.placeBet(1, 3).estimateGas({from: accounts[0], gas: 5000000});
  //   const estimate2 = await contract.methods.setFinalResult(1, 1).estimateGas({ from: accounts[1], gas: 5000000});
  //   const estimate3 = await contract.methods.claimBet().estimateGas({ from: accounts[1], gas: 5000000 })
  //   console.log({ estimate, estimate2, estimate3});

  //   const tx0 = await contract.methods.placeBet(1, 3).send({ from: accounts[0], value: '1', gas: 5000000 });
  //   const tx1 = await contract.methods.placeBet(1, 1).send({ from: accounts[1], value: '1', gas: 5000000 });
  //   const tx2 = await contract.methods.setFinalResult(1, 1).send({ from: accounts[2], gas: 5000000 });

  //   // Get the value from the contract to prove it worked.
  //   // const response = await contract.methods.get().call();
  //   const response = await contract.methods.claimBet().send({ from: accounts[1], gas: 5000000 });

  //   console.log({ response, tx0, tx1, tx2 });

  //   // Update state with the result.
  //   this.setState({ storageValue: `${response.status}` });
  // };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    const { web3, accounts, contract } = this.state;

    return (
      <div className="App">
        <Match web3={web3} accounts={accounts} contract={contract} />
      </div>
    );
  }
}

export default App;
