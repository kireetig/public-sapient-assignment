import React from 'react';
import logo from './logo.svg';
import './App.scss';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Home } from './pages/Home/Home';

function App() {
  return (
    <>
      <Router>
        <div className="container">
        <Switch>
          <Route path="/" component={Home} />
        </Switch>
        </div>
      </Router>
    </>
  );
}

export default App;
