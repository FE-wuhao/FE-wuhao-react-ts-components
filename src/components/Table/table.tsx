import React from 'react';
import classnames from 'classnames';

type TAlign = 'left' | 'center' | 'right';

export interface IColumn<T> {
  title: string;
  key: keyof T;
  width?: number;
  align?: TAlign;
}

export interface ITableProps<T> {
  columns: IColumn<T>[];
  dataSource: T[];
  tabelClassName?: string;
  border?: boolean;
  rowBorder?: boolean;
  rowClassName?: string;
}

function Table<T extends Object>(props: ITableProps<T>) {
  const {
    columns,
    dataSource,
    tabelClassName,
    border,
    rowBorder,
    rowClassName,
  } = props;
  const rowStyle = classnames(rowClassName, { [`tb-row-border`]: rowBorder });
  const tableStyle = classnames('tb', tabelClassName, {
    [`tb-border`]: border,
  });

  const renderColumn = (
    <tr className="tb-header">
      {columns?.map(column => (
        <td
          style={{ width: column.width, textAlign: column.align }}
          key={column.key as string}
        >
          {column.title}
        </td>
      ))}
    </tr>
  );
  const renderDataSource = dataSource?.map(row => (
    <tr className={rowStyle}>
      {columns?.map(column => (
        <td style={{ textAlign: column.align }}>{row[column.key]}</td>
      ))}
    </tr>
  ));

  return (
    <table className={tableStyle}>
      <thead>{renderColumn}</thead>
      <tbody>{renderDataSource}</tbody>
    </table>
  );
}

export default Table;
