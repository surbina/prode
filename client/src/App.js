import * as React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import Admin from './Admin';
import Match from './Match';
import MatchList from './MatchList';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
