import * as React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { drizzleReactHooks } from '@drizzle/react-plugin';
import { Drizzle } from '@drizzle/store';

import Admin from './Admin';
import Match from './Match';
import MatchList from './MatchList';
import Prode from './contracts/Prode.json';

const { DrizzleProvider } = drizzleReactHooks;

const drizzleOptions = {
  contracts: [Prode],
};
const drizzle = new Drizzle(drizzleOptions);

function App() {
  return (
    <Router>
      <DrizzleProvider drizzle={drizzle}>
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
      </DrizzleProvider>
    </Router>
  );
}

export default App;
