const fs = require('fs');
const path = require('path');
import React from 'react';
import { renderToString } from 'react-dom/server';
import { renderRoutes } from 'react-router-config';
import Routes from '../src/Routes';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';

export default (req, res, store) => {
  const state = store.getState();
  try {
    // Convert the React App to String
    const app = renderToString(
      <Provider store={store}>
        <StaticRouter location={req.path}>
          <div>{renderRoutes(Routes)}</div>
        </StaticRouter>
      </Provider>
    );

    // read the final HTML from build folder (index.html)
    fs.readFile(path.resolve('build/index.html'), 'utf8', (err, data) => {
      if (!err) {
        const html = data
          .replace('<div id="root"></div>', `<div id="root">${app}</div>`)
          .replace(
            '<script></script>',
            `<script>window.__REDUX_STATE__=${JSON.stringify(state)}</script>`
          );
        res.send(html);
      }
    });
  } catch (err) {
    console.log('3');
    fs.readFile(path.resolve('build/index.html'), 'utf8', (err, data) => {
      if (!err) {
        const html = data;
        res.send(html);
      }
    });
  }
};
