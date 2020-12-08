import * as React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { DrizzleContext } from '@drizzle/react-plugin';
import { Drizzle } from '@drizzle/store';

import { Admin, MatchAdminDetail } from './Admin';
import Match from './Match';
import MatchList from './MatchList';
import SplashScreen from './SplashScreen';
import Prode from './contracts/Prode.json';

const drizzleOptions = {
  contracts: [Prode],
  web3: {
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:7545',
    },
  },
};
const drizzle = new Drizzle(drizzleOptions);

function App() {
  return (
    <Router>
      <DrizzleContext.Provider drizzle={drizzle}>
        <DrizzleContext.Consumer>
          {({ initialized, drizzleState }) => {
            const isLoaded =
              initialized && drizzleState.contracts.Prode.initialized;

            if (!isLoaded) {
              return null;
            }

            return (
              <Switch>
                <Route path="/admin" exact>
                  <Admin />
                </Route>
                <Route path="/admin/:matchAddress">
                  <MatchAdminDetail />
                </Route>
                <Route path="/matches" exact>
                  <MatchList />
                </Route>
                <Route path="/matches/:matchAddress">
                  <Match />
                </Route>
                <Route path="/">
                  <SplashScreen />
                </Route>
              </Switch>
            );
          }}
        </DrizzleContext.Consumer>
      </DrizzleContext.Provider>
    </Router>
  );
}

export default App;
