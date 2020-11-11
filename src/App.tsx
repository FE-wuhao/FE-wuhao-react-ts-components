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
            render: record => {
              return '测试render:' + record.col1;
            },
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
          { col1: '王家', col2: 13, col3: 180 },
          { col1: '王家话', col2: 10, col3: 168 },
          { col1: '王家话', col2: 15, col3: 175 },
          { col1: '王家城', col2: 19, col3: 165 },
          { col1: '王嘉诚', col2: 12, col3: 180 },
          { col1: '湖人', col2: 22, col3: 180 },
          { col1: '王家话', col2: 15, col3: 172 },
          { col1: 'amy', col2: 15, col3: 172 },
          { col1: '湖人', col2: 22, col3: 185 },
          { col1: 'amy', col2: 23, col3: 190 },
        ]}
      />
    </div>
  );
}

export default App;
