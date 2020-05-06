import React from 'react';
import './App.scss';
import { Redirect, Route } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import Routes from './Routes';

function App() {
  return (
    <div className="container">
      <div>{renderRoutes(Routes)}</div>
      <Route exact path="/">
        <Redirect to={'/0/page'} />
      </Route>
    </div>
  );
}

export default App;
