import React from 'react';

export interface IColumn<T> {
  title: string;
  key: keyof T;
  width: number;
}

export interface ITableProps<T> {
  columns: IColumn<T>[];
  dataSource: T[];
  border?: boolean;
}

function Table<T extends Object>(props: ITableProps<T>) {
  const { columns, dataSource, border } = props;

  const renderColumn = (
    <tr>
      {columns?.map(column => (
        <td style={{ width: column.width }} key={column.key as string}>
          {column.title}
        </td>
      ))}
    </tr>
  );
  const renderDataSource = dataSource?.map(row => (
    <tr>
      {columns?.map(column => (
        <td>{row[column.key]}</td>
      ))}
    </tr>
  ));

  return (
    <table style={border ? { border: '1px solid' } : undefined}>
      <thead>{renderColumn}</thead>
      <tbody>{renderDataSource}</tbody>
    </table>
  );
}

export default Table;
