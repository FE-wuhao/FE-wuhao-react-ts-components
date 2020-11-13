/* eslint-disable indent */
import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  ReactElement,
} from 'react';
import classnames from 'classnames';
import Loading from '../Loading/loading';
import Sort, { TDirect, TSortKey } from '../Sort/sort';
import Scroll from '../Scroll/scroll';

export type TAlign = 'left' | 'center' | 'right';
export type TRowSelectElement = 'checkbox' | 'radio';
export type TSelectedRowKey<T> = T[keyof T];
export type TSortFunc<T> = (a: T, b: T) => number;
export interface IColumn<T> {
  title: string;
  key: keyof T;
  width?: number;
  align?: TAlign;
  sort?: {
    enabled: boolean;
  };
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
  virtualScroll?: {
    enable: boolean;
    tableHeight?: number;
    itemHeight?: number;
  };
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
    virtualScroll,
  } = props;

  const [dataSource, setDataSource] = useState(ds);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<TSelectedRowKey<T>[]>(
    []
  );
  const sortKeys = useRef<TSortKey<T>[]>([]);
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

    console.time('handleRowChecked');
    if (inputType === 'checkbox') {
      if (selected) {
        setSelectedRows([...selectedRows, row]);
        setSelectedRowKeys([...selectedRowKeys, row[rowKey]]);
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
    console.timeEnd('handleRowChecked');
  };
  // 整行点击选中事件
  const handleRowClickSelect = (row: T, type: TRowSelectElement) => {
    // console.log('父事件触发了');
    console.time('handleRowClickSelect');
    if (rowSelection?.rowClickSelect) {
      if (selectedRowKeys.includes(row[rowKey])) {
        handleRowChecked(false, row, type);
      } else {
        handleRowChecked(true, row, type);
      }
    }
    console.timeEnd('handleRowClickSelect');
  };
  // 排序函数
  const sortFunction = (
    a: T,
    b: T,
    keys: TSortKey<T>[],
    priority: number
  ): number => {
    if (priority === keys.length) {
      return 0;
    }

    const currentKey = keys[priority].key;
    const currentDirection = keys[priority].direction;
    const dirToNum = (currentDirection: TDirect) => {
      switch (currentDirection) {
        case 'ASC':
          return 1;
        case 'DESC':
          return -1;
        case 'NONE':
          return 0;
        default:
          return 0;
      }
    };

    if (a[currentKey] > b[currentKey]) {
      return dirToNum(currentDirection);
    }
    if (a[currentKey] < b[currentKey]) {
      return -dirToNum(currentDirection);
    }
    if (a[currentKey] === b[currentKey]) {
      return sortFunction(a, b, keys, priority + 1);
    }

    return 0;
  };
  // 排序按钮点击处理函数
  const handleSort = (sortKey: TSortKey<T>) => {
    const { key, direction } = sortKey;
    // 该排序列是否已存储过
    const keyAlreadyExist =
      sortKeys.current.filter(sortKey => sortKey.key === key).length > 0;
    // 没有则添加至数组
    if (!keyAlreadyExist) {
      sortKeys.current.push({ key, direction });
    } else if (direction === 'NONE') {
      // 删除key
      sortKeys.current = sortKeys.current.filter(
        sortKey => sortKey.key !== key
      );
    } else {
      // 更新数组
      sortKeys.current = sortKeys.current.map(sortKey => {
        if (sortKey.key === key) {
          return { key, direction };
        }
        return sortKey;
      });
    }
    // 排序
    if (sortKeys.current.length) {
      const sortedDS = [...dataSource].sort((a, b) =>
        sortFunction(a, b, sortKeys.current, 0)
      );
      // 更新排序后的数组
      setDataSource(sortedDS);
    } else {
      setDataSource(ds);
    }
  };
  // 全选事件处理函数
  const handleSelectAll = (selected: boolean) => {
    console.time('handleSelectAll');
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
    console.timeEnd('handleSelectAll');
  };
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
  // 根据传入的数据的改变更新datasource
  useEffect(() => {
    let isNextRender = false;

    if (!isNextRender) {
      setDataSource(ds);
    }

    return () => {
      isNextRender = true;
    };
  }, [ds]);
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
          <Sort columnKey={column.key} handleSort={handleSort} />
        </div>
      ))}
    </>
  );
  // 渲染表格行
  const renderDataSource = (() => {
    console.time('renderDataSource');
    const formattedDS = dataSource?.map((row, index) => (
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
    console.timeEnd('renderDataSource');
    if (virtualScroll?.enable) {
      return (
        <Scroll
          height={virtualScroll.tableHeight}
          itemHeight={virtualScroll.itemHeight}
          dataSource={formattedDS}
        />
      );
    }

    return formattedDS;
  })();
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
