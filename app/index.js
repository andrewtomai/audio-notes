import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import './app.global.css';
import './components/AudioBar/VolumeVisualization.css';
import Home from './components/Home';

render(
  <AppContainer>
    <Home />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./components/Home', () => {
    // eslint-disable-next-line global-require
    const NextRoot = require('./components/Home').default;
    render(
      <AppContainer>
        <NextRoot />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
