import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { rootReducer } from './store/reducer';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const preloadState = window.__REDUX_STATE__;
delete window.__REDUX_STATE__;

const store = createStore(rootReducer, preloadState, applyMiddleware(thunk));

ReactDOM.hydrate(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
