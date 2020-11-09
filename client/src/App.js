import React, { Component } from "react";
import MatchContract from "./contracts/Match.json";
import ProdeContract from './contracts/Prode.json';
import getWeb3 from "./getWeb3";
import Match from './Match';
import Prode from './Prode';

import "./App.css";

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    matchContractAddress: '',
    matchContract: null,
  };

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
      const deployedNetwork = ProdeContract.networks[networkId];
      const instance = new web3.eth.Contract(
        ProdeContract.abi,
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

  getMatchContract() {
    const { web3 } = this.state;
    // const rest = web3.utils.checkAddressChecksum(this.state.matchContractAddress)
    // console.log({ rest });

    const instance = new web3.eth.Contract(
      MatchContract.abi,
      this.state.matchContractAddress,
    );

    this.setState({ matchContract: instance });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    const { web3, accounts, contract, matchContract, matchContractAddress } = this.state;

    return (
      <div className="App">
        <Prode account={accounts[0]} contract={contract} />

        <div>
          <span>Match contract address</span>
          <input
            type="text"
            value={matchContractAddress}
            onChange={({ target: { value }}) => this.setState({ matchContractAddress: value })}
          />
          <input
            type="button"
            onClick={() => this.getMatchContract()}
            value="Get Match"
          />
        </div>

        {matchContract && <Match web3={web3} accounts={accounts} contract={matchContract} />}
      </div>
    );
  }
}

export default App;
