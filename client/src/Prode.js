import * as React from 'react';
import PropTypes from 'prop-types';

function Prode({ account, contract }) {
  const [homeTeamName, setHomeTeamName] = React.useState('river');
  const [awayTeamName, setAwayTeamName] = React.useState('boca');

  const createMatch = () => {
    contract.methods
      .createMatch(homeTeamName, awayTeamName)
      .send({ from: account, gas: 5000000 });
  };

  const getMatches = async () => {
    const result = await contract.methods.getMatches().call();
    console.log({ result });
  };

  return (
    <div
      className="prode"
      style={{ display: 'flex', flexDirection: 'column', width: '60%' }}>
      <h4>Create match</h4>
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
      <div>
        <input type="button" onClick={createMatch} value="Create match" />
        <input type="button" onClick={getMatches} value="Get matches" />
      </div>
    </div>
  );
}

Prode.propTypes = {
  account: PropTypes.any,
  contract: PropTypes.any,
};

export default Prode;
