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
  rowKey?: keyof T;
  rowSelection?: {
    type?: 'checkbox' | 'radio';
    onChange?: (selectedRowKeys: keyof T, selectedRows: T[]) => void;
    onSelectedAll?: (select: boolean, selectedRows: T[]) => void;
  };
}

function Table<T extends Object>(props: ITableProps<T>) {
  const {
    columns,
    dataSource,
    tabelClassName,
    border,
    rowBorder,
    rowClassName,
    rowSelection,
  } = props;

  const tableStyle = classnames(tabelClassName, {
    [`tb-border`]: border,
  });

  const rowStyle = classnames(rowClassName, 'tb-row', {
    [`tb-row-border`]: rowBorder,
  });
  const tableRowSelectDisabled = classnames({
    'tb-select': rowSelection?.type,
    'tb-select-disabled': !rowSelection?.type,
  });
  const tableHeaderSelectDisabled = classnames({
    'tb-select': rowSelection?.type === 'checkbox',
    'tb-select-disabled': rowSelection?.type !== 'checkbox',
  });

  const renderColumn = columns?.map(column => (
    <div
      className="tb-header-item"
      style={{ width: column.width, textAlign: column.align }}
      key={column.key as string}
    >
      {column.title}
    </div>
  ));
  const renderDataSource = dataSource?.map((row, index) => (
    <div key={index} className={rowStyle}>
      <div className={tableRowSelectDisabled}>
        {rowSelection?.type && <input type={rowSelection?.type} />}
      </div>
      {columns?.map(column => (
        <div
          className="tb-row-item"
          key={column.key as string}
          style={{ textAlign: column.align }}
        >
          {row[column.key]}
        </div>
      ))}
    </div>
  ));

  return (
    <div className={tableStyle}>
      <div className="tb-inner-container">
        <div className="tb-header">
          <div className={tableHeaderSelectDisabled}>
            {rowSelection?.type && <input type={rowSelection?.type} />}
          </div>
          {renderColumn}
        </div>
        <div className="tb-body">{renderDataSource}</div>
      </div>
    </div>
  );
}
export default Table;
