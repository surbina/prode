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
