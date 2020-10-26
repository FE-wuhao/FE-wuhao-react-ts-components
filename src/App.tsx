import React from 'react';
import Button from './components/Button/button';
import './styles/index.scss';

function App() {
  return (
    <div style={{ margin: '20px 20px' }}>
      <Button btnType='primary'>顶层组件</Button>
    </div>
  );
}

export default App;
