import React, { useState, useEffect, ChangeEvent, ReactElement } from 'react';
import classnames from 'classnames';
import Loading from '../Loading/loading';
import Sort, { TDirect } from '../Sort/sort';

export type TAlign = 'left' | 'center' | 'right';

export type TRowSelectElement = 'checkbox' | 'radio';

export type TSelectedRowKey<T> = T[keyof T];

export type TSortFunc<T> = (a: T, b: T) => number;

export interface IColumn<T> {
  title: string;
  key: keyof T;
  width?: number;
  align?: TAlign;
  sort?: boolean;
  sortFunction?: TSortFunc<T>;
  render?: (record: T) => ReactElement | string;
}

export interface ITableProps<T> {
  rowKey: keyof T;
  columns: IColumn<T>[];
  dataSource: T[];
  loading?: boolean;
  border?: boolean;
  rowBorder?: boolean;
  rowClassName?: string;
  rowSelection?: {
    type?: TRowSelectElement;
    rowClickSelect?: boolean;
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
  tabelClassName?: string;
}

function Table<T extends Object>(props: ITableProps<T>) {
  const {
    rowKey,
    columns,
    dataSource: ds,
    loading = false,
    border,
    rowBorder,
    rowClassName,
    rowSelection,
    tabelClassName,
  } = props;

  const [dataSource, setDataSource] = useState(ds);

  type TSortKey<T> = {
    key: keyof T;
    direction: TDirect;
  };

  interface IInfo {
    id: number;
    name: string;
    age: number;
  }

  const sortKeys: TSortKey<IInfo>[] = [
    { key: 'id', direction: 'DESC' },
    { key: 'name', direction: 'DESC' },
  ];

  const info: IInfo[] = [
    { id: 1, name: 'wuhao', age: 25 },
    { id: 1, name: 'majian', age: 25 },
    { id: 3, name: 'xiaohong', age: 25 },
    { id: 2, name: 'zhouxin', age: 25 },
  ];

  function sortFunc<T>(
    a: T,
    b: T,
    keys: TSortKey<T>[],
    priority: number
  ): number {
    const currentKey = keys[priority].key;
    const currentDirection = keys[priority].direction;

    if (priority === keys.length) {
      return 0;
    }

    if (a[currentKey] > b[currentKey]) {
      // return -1;
      return currentDirection === 'ASC' ? 1 : -1;
    }
    if (a[currentKey] < b[currentKey]) {
      return currentDirection === 'ASC' ? -1 : 1;
      // return 1;
    }
    if (a[currentKey] === b[currentKey]) {
      return sortFunc(a, b, keys, priority + 1);
    }
    return 0;
  }

  console.log(info.sort((a, b) => sortFunc<IInfo>(a, b, sortKeys, 0)));

  useEffect(() => {
    let isNextRender = false;

    if (!isNextRender) {
      setDataSource(ds);
    }

    return () => {
      isNextRender = true;
    };
  }, [ds]);

  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<TSelectedRowKey<T>[]>(
    []
  );
  // 表格样式控制
  const tableStyle = classnames(tabelClassName, {
    [`tb-border`]: border,
  });
  // 表格行样式控制
  const rowStyle = classnames(rowClassName, 'tb-row', {
    [`tb-row-border`]: rowBorder,
  });
  // 表格行勾选框样式控制
  const tableRowSelectDisabled = classnames({
    'tb-select': rowSelection?.type,
    'tb-select-disabled': !rowSelection?.type,
  });
  // 表头勾选框样式控制
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
    // console.log('子事件触发了');
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
  // 整行点击选中事件
  const handleRowClickSelect = (row: T, type: TRowSelectElement) => {
    // console.log('父事件触发了');
    if (rowSelection?.rowClickSelect) {
      if (selectedRowKeys.includes(row[rowKey])) {
        handleRowChecked(false, row, type);
      } else {
        handleRowChecked(true, row, type);
      }
    }
  };

  // 排序处理函数
  const handleSort = (
    direct: TDirect,
    restProps: [key: keyof T, sortFunc: TSortFunc<T>]
  ) => {
    const [key, sortFunc] = restProps;

    if (direct === 'ASC') {
      setDataSource(
        sortFunc
          ? [...dataSource].sort(sortFunc)
          : [...dataSource].sort((a, b) => (a[key] > b[key] ? 1 : -1))
      );
    } else if (direct === 'DESC') {
      setDataSource(
        sortFunc
          ? [...dataSource].sort(sortFunc).reverse()
          : [...dataSource].sort((a, b) => (a[key] > b[key] ? 1 : -1)).reverse()
      );
    } else {
      setDataSource(ds);
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
            onClick={e => e.stopPropagation()}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              e.stopPropagation();
              handleSelectAll(e.target.checked);
            }}
          />
        </div>
      )}
      {columns?.map(column => (
        <div
          className="tb-header-item"
          style={{
            width: column.width || 0,
            textAlign: column.align,
          }}
          key={column.key as string}
        >
          <div className="tb-header-item-font">{column.title}</div>
          <Sort
            handleSort={handleSort}
            handleSortRestProps={[column.key, column.sortFunction]}
          />
        </div>
      ))}
    </>
  );

  // 渲染表格行
  const renderDataSource = dataSource?.map((row, index) => (
    <div
      key={index}
      className={rowStyle}
      onClick={e => {
        e.stopPropagation();
        handleRowClickSelect(row, rowSelection?.type as TRowSelectElement);
      }}
    >
      {rowSelection?.type && (
        <div className={tableRowSelectDisabled}>
          <input
            type={rowSelection.type}
            checked={selectedRowKeys.includes(row[rowKey])}
            onClick={e => e.stopPropagation()}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              e.stopPropagation();
              handleRowChecked(
                e.target.checked,
                row,
                rowSelection.type as TRowSelectElement
              );
            }}
          />
        </div>
      )}

      {columns?.map(column => (
        <div
          className="tb-row-item"
          key={column.key as string}
          style={{
            width: column.width || 0,
            textAlign: column.align,
          }}
        >
          {column?.render?.(row) || row[column.key]}
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
    <>
      <Loading display={loading} size="md" innerMode />
      <div className={tableStyle}>
        <div className="tb-inner-container">
          <div className="tb-header">{renderColumn}</div>
          <div className="tb-body">{renderDataSource}</div>
        </div>
      </div>
    </>
  );
}
export default Table;
