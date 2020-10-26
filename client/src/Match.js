import * as React from 'react';

function Match({ web3, accounts, contract }) {
  const admin = accounts[1];
  const playerA = accounts[2];
  const playerB = accounts[3];

  const [aPlayerResult, setAPlayerResult] = React.useState({
    home: 2,
    away: 4,
  });

  const [bPlayerResult, setBPlayerResult] = React.useState({
    home: 1,
    away: 1,
  });

  const [finalResult, setFinalResult] = React.useState({
    home: 1,
    away: 1,
  });

  const [matchData, setMatchData] = React.useState({
    homeTeamId: '',
    awayTeamId: '',
  });

  React.useEffect(() => {
    async function getMatchData() {
      const homeTeamId = await contract.methods.homeTeamId().call();
      const awayTeamId = await contract.methods.awayTeamId().call();

      setMatchData({
        homeTeamId,
        awayTeamId,
      });
    }

    getMatchData();
  }, [contract]);

  React.useEffect(() => {
    async function getContractData() {
      const finalResult = await contract.methods.finalResult().call();

      console.log({ finalResult });
    }

    getContractData();
  });

  const getPlaceBetHandler = (address, result) => async () => {
    const placeBetReceipt = await contract.methods
      .placeBet(result.home, result.away)
      .send({ from: address, value: web3.utils.toWei('1', "ether"), gas: 5000000 });

    console.log({placeBetReceipt});
  };
  const getClaimBetHandler = address => async () => {
    const claimBetReceipt = await contract.methods
      .claimBet()
      .send({ from: address, gas: 5000000 });

    console.log({ claimBetReceipt });
  };

  const setFinalResultHandler = () => contract.methods.setFinalResult(finalResult.home, finalResult.away).send({ from: admin, gas: 5000000 });

  return (
    <div className="match" style={{display: 'flex', flexDirection: 'column', width: '60%'}}>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <h4>Player A ({playerA})</h4>
        <div>
          <span>{matchData.homeTeamId}</span>
          <input
            type="text"
            value={aPlayerResult.home}
            onChange={({ target: { value }}) => setAPlayerResult({...aPlayerResult, home: parseInt(value)})}
          />
        </div>
        <div>
          <span>{matchData.awayTeamId}</span>
          <input
            type="text"
            value={aPlayerResult.away}
            onChange={({ target: { value }}) => setAPlayerResult({...aPlayerResult, away: parseInt(value)})}
          />
        </div>
        <div>
          <input type="button" onClick={getPlaceBetHandler(playerA, aPlayerResult)} value="Place Bet Player A" />
          <input type="button" onClick={getClaimBetHandler(playerA)} value="Claim Bet Player A" />
        </div>
      </div>


      <div style={{marginTop: 20, display: 'flex', flexDirection: 'column'}}>
        <h4>Player B ({playerB})</h4>
        <div>
          <span>{matchData.homeTeamId}</span>
          <input
            type="text"
            value={bPlayerResult.home}
            onChange={({ target: { value }}) => setBPlayerResult({...bPlayerResult, home: parseInt(value)})}
          />
        </div>
        <div>
          <span>{matchData.awayTeamId}</span>
          <input
            type="text"
            value={bPlayerResult.away}
            onChange={({ target: { value }}) => setBPlayerResult({...bPlayerResult, away: parseInt(value)})}
          />
        </div>
        <div>
          <input type="button" onClick={getPlaceBetHandler(playerB, bPlayerResult)} value="Place Bet Player B" />
          <input type="button" onClick={getClaimBetHandler(playerB)} value="Claim Bet Player B" />
        </div>
      </div>

      <div style={{marginTop: 20, display: 'flex', flexDirection: 'column'}}>
        <h4>Admin ({admin})</h4>
        <div>
          <span>{matchData.homeTeamId}</span>
          <input
            type="text"
            value={finalResult.home}
            onChange={({ target: { value }}) => setFinalResult({...finalResult, home: parseInt(value)})}
          />
        </div>
        <div>
          <span>{matchData.awayTeamId}</span>
          <input
            type="text"
            value={finalResult.away}
            onChange={({ target: { value }}) => setFinalResult({...finalResult, away: parseInt(value)})}
          />
        </div>
        <div>
          <input type="button" onClick={setFinalResultHandler} value="Set Final Score" />
        </div>
      </div>
      
    </div>
  );
}

export default Match;
