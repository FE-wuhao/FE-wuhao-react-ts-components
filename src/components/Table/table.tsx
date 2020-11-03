import React, { useState, useEffect, ChangeEvent } from 'react';
import classnames from 'classnames';

export type TAlign = 'left' | 'center' | 'right';

export type TRowSelectElement = 'checkbox' | 'radio';

export type TSelectedRowKey<T> = T[keyof T];

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
  rowKey: keyof T;
  rowSelection?: {
    type?: TRowSelectElement;
    onChange?: (
      selectedRowKeys: TSelectedRowKey<T>[],
      selectedRows: T[]
    ) => void;
    onSelectedAll?: (
      select: boolean,
      selectedRows: T[],
      selectedRowKeys: TSelectedRowKey<T>[]
    ) => void;
  };
}

function Table<T extends Object>(props: ITableProps<T>) {
  const {
    columns,
    dataSource,
    tabelClassName,
    border,
    rowKey,
    rowBorder,
    rowClassName,
    rowSelection,
  } = props;

  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<TSelectedRowKey<T>[]>(
    []
  );

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
  // 行勾选事件处理函数
  const handleRowChecked = (
    selected: boolean,
    row: T,
    inputType: TRowSelectElement
  ) => {
    if (inputType === 'checkbox') {
      if (selected) {
        setSelectedRows([...selectedRows, row]);
        setSelectedRowKeys([...selectedRows, row].map(row => row[rowKey]));
      } else {
        setSelectedRows(
          selectedRows.filter(
            selectedRow => selectedRow[rowKey] !== row[rowKey]
          )
        );
        setSelectedRowKeys(selectedRowKeys.filter(key => key !== row[rowKey]));
      }
    }
    if (inputType === 'radio') {
      if (selected) {
        setSelectedRows([row]);
        setSelectedRowKeys([row[rowKey]]);
      } else {
        setSelectedRows([]);
        setSelectedRowKeys([]);
      }
    }
  };

  // 全选事件处理函数
  const handleSelectAll = (selected: boolean) => {
    const dataSourceKeys = dataSource.map(row => row[rowKey]);
    if (selected) {
      setSelectedRows(dataSource);
      setSelectedRowKeys(dataSourceKeys);
      rowSelection?.onSelectedAll?.(selected, dataSource, dataSourceKeys);
    } else {
      setSelectedRows([]);
      setSelectedRowKeys([]);
      rowSelection?.onSelectedAll?.(selected, [], []);
    }
  };

  // 渲染表头
  const renderColumn = (
    <>
      {rowSelection?.type && (
        <div className={tableHeaderSelectDisabled}>
          <input
            type={rowSelection?.type}
            checked={selectedRowKeys.length === dataSource.length}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleSelectAll(e.target.checked);
            }}
          />
        </div>
      )}
      {columns?.map(column => (
        <div
          className="tb-header-item"
          style={{ width: column.width, textAlign: column.align }}
          key={column.key as string}
        >
          {column.title}
        </div>
      ))}
    </>
  );

  // 渲染表格行
  const renderDataSource = dataSource?.map((row, index) => (
    <div key={index} className={rowStyle}>
      {rowSelection?.type && (
        <div className={tableRowSelectDisabled}>
          <input
            type={rowSelection.type}
            checked={selectedRowKeys.includes(row[rowKey])}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleRowChecked(
                e.target.checked,
                row,
                rowSelection.type as TRowSelectElement
              )
            }
          />
        </div>
      )}

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

  // 监听行选中
  useEffect(() => {
    let isNextRender = false;
    if (!isNextRender) {
      rowSelection?.onChange?.(selectedRowKeys, selectedRows);
    }
    return () => {
      isNextRender = true;
    };
  }, [selectedRows, selectedRowKeys, rowSelection]);

  return (
    <div className={tableStyle}>
      <div className="tb-inner-container">
        <div className="tb-header">{renderColumn}</div>
        <div className="tb-body">{renderDataSource}</div>
      </div>
    </div>
  );
}
export default Table;
