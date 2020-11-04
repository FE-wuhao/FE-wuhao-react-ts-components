import React from 'react';
// import Button from './components/Button/button';
import './styles/index.scss';
import Table from './components/Table/table';

function App() {
  return (
    <div
      style={{
        margin: '20px 20px',
        position: 'relative',
        backgroundColor: 'white',
      }}
    >
      <Table
        border
        rowKey="col1"
        rowBorder
        // loading={true}
        rowSelection={{ type: 'checkbox', rowClickSelect: true }}
        columns={[
          {
            key: 'col1',
            width: 150,
            title: '列1',
            align: 'left',
          },
          {
            key: 'col2',
            width: 150,
            title: '列2',
            align: 'center',
          },
          {
            key: 'col3',
            width: 150,
            title: '列3',
            align: 'right',
          },
        ]}
        dataSource={[
          { col1: '数据1', col2: '数据1', col3: '数据1' },
          { col1: '数据2', col2: '数据2', col3: '数据2' },
          { col1: '数据3', col2: '数据3', col3: '数据3' },
        ]}
      />
    </div>
  );
}

export default App;
