import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <div
      style={{
        backgroundColor: 'gray',
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
