import * as React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { DrizzleContext } from '@drizzle/react-plugin';
import { Drizzle } from '@drizzle/store';

import Admin from './Admin';
import Match from './Match';
import MatchList from './MatchList';
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
        <Switch>
          <Route path="/admin">
            <Admin />
          </Route>
          <Route path="/matches" exact>
            <MatchList />
          </Route>
          <Route path="/matches/:id">
            <Match />
          </Route>
          <Route path="/">
            <Redirect to="/matches" />
          </Route>
        </Switch>
      </DrizzleContext.Provider>
    </Router>
  );
}

export default App;
