import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import background from './assets/backgroud.svg';

ReactDOM.render(
  <React.StrictMode>
    <div
      style={{
        backgroundColor: 'gray',
        backgroundImage: 'url(' + background + ')',
        backgroundRepeat: 'repeat',
        position: 'fixed',
        width: '100%',
        height: '100%',
      }}
    >
      <App />
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);
