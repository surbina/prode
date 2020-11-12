import * as React from 'react';
import { drizzleReactHooks } from '@drizzle/react-plugin';

import MatchItem from './MatchItem';
import Match from '../contracts/Match.json';

const { useDrizzle, useDrizzleState } = drizzleReactHooks;

function Admin() {
  const [homeTeamName, setHomeTeamName] = React.useState('river');
  const [awayTeamName, setAwayTeamName] = React.useState('boca');
  const account = useDrizzleState(({ accounts }) => accounts[0]);

  const { useCacheSend, useCacheCall, drizzle } = useDrizzle();

  const { send } = useCacheSend('Prode', 'createMatch');
  const matchesIds = useCacheCall('Prode', 'getMatches') || [];

  // const ProdeContract = useDrizzleState(({ contracts: { Prode } }) => Prode);

  const state = useDrizzleState((s) => s);

  React.useEffect(() => {
    // const { Prode, ...matches } = state.contracts;
    const { contracts, web3 } = state;

    // console.log({ contracts, web3 });

    console.log('sfsdfsdf', web3);

    // if (!web3 || !web3.eth) {
    //   return;
    // }

    (matchesIds || []).forEach((matchId) => {
      if (!contracts[matchId]) {
        console.log('hola: ', matchId);
        const contractName = matchId;
        // const web3Contract = new web3.eth.Contract(Match.abi, contractName); // second argument is new contract's address

        // const { abi, networks, deployedBytecode } = contractConfig
        const contractConfig = {
          ...Match,
          contractName,
        };

        drizzle.addContract(contractConfig);

        // const contractConfig = { contractName, web3Contract };
        // const events = [];

        // drizzle.store.dispatch({
        //   type: 'ADD_CONTRACT',
        //   contractConfig,
        //   events,
        // });

        // drizzle.store.dispatch({
        //   type: 'ADD_CONTRACT',
        //   contractConfig,
        //   events,
        // });
      }
    });
  }, [drizzle, matchesIds, state]);

  console.log({ matchesIds, state, account });

  const createMatch = () => {
    send(homeTeamName, awayTeamName, {
      from: account,
      gas: 300000,
    });
  };

  return (
    <div>
      <h3>Admin page</h3>
      <div>
        <div>
          <span>Home team name</span>
          <input
            type="text"
            value={homeTeamName}
            onChange={({ target: { value } }) => setHomeTeamName(value)}
          />
        </div>
        <div>
          <span>Away team name</span>
          <input
            type="text"
            value={awayTeamName}
            onChange={({ target: { value } }) => setAwayTeamName(value)}
          />
        </div>
        <input type="button" onClick={createMatch} value="Create match" />
      </div>
      <div>
        <h4>List of matches</h4>
        {matchesIds.map((matchAddress) => (
          <MatchItem key={matchAddress} matchAddress={matchAddress} />
        ))}
      </div>
    </div>
  );
}

function Loaded() {
  const isLoaded = useDrizzleState(
    ({
      contracts: {
        Prode: { initialized },
      },
      web3,
    }) => initialized && web3.status === 'initialized'
  );

  if (!isLoaded) {
    return null;
  }

  return <Admin />;
}

export default Loaded;
