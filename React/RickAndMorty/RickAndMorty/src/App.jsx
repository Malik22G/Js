import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./Home";
import Profile from "./Profile";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/profile/:characterId" component={Profile} />
      </Switch>
    </Router>
  );
}

export default App;
