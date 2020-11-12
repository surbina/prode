import React from 'react';
import MatchContract from './contracts/Match.json';
import ProdeContract from './contracts/Prode.json';
import getWeb3 from './getWeb3';
import Match from './Match';
import Prode from './Prode';

import './App.css';

function App() {
  const [state, setState] = React.useState({
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    matchContractAddress: '',
    matchContract: null,
  });

  React.useEffect(() => {
    async function init() {
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
          deployedNetwork && deployedNetwork.address
        );

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        setState({ ...state, web3, accounts, contract: instance });
      } catch (error) {
        // Catch any errors for any of the above operations.
        console.error(error); // eslint-disable-line no-console
      }
    }

    init();
  }, []);

  const getMatchContract = () => {
    const { web3 } = state;
    // const rest = web3.utils.checkAddressChecksum(this.state.matchContractAddress)
    // console.log({ rest });

    const instance = new web3.eth.Contract(
      MatchContract.abi,
      state.matchContractAddress
    );

    setState({ ...state, matchContract: instance });
  };

  if (!state.web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <div className="App">
      <Prode account={state.accounts[0]} contract={state.contract} />

      <div>
        <span>Match contract address</span>
        <input
          type="text"
          value={state.matchContractAddress}
          onChange={({ target: { value } }) =>
            setState({ ...state, matchContractAddress: value })
          }
        />
        <input type="button" onClick={getMatchContract} value="Get Match" />
      </div>

      {state.matchContract && (
        <Match
          web3={state.web3}
          accounts={state.accounts}
          contract={state.matchContract}
        />
      )}
    </div>
  );
}

export default App;
