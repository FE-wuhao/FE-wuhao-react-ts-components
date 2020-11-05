import React, { useState, useEffect } from 'react';
import classnames from 'classnames';

export type IDirect = 'NONE' | 'ASC' | 'DESC';

export enum EDirect {
  'NONE',
  'ASC',
  'DESC',
}

export interface IProps<T> {
  columnKey: keyof T;
  handleSort: (curColumnKey: keyof T, direct: IDirect) => void;
}

function Sort<T>(props: IProps<T>) {
  const { columnKey, handleSort } = props;

  const [dir, setDir] = useState(0);

  const up = classnames('table-sort', {
    'table-sort-fill': dir === 1,
  });

  const down = classnames('table-sort', {
    'table-sort-fill': dir === 2,
  });

  return (
    <div
      className="table-sort-container"
      onClick={() => {
        setDir(pre => (pre === 2 ? 0 : pre + 1));
        handleSort(columnKey, EDirect[dir] as IDirect);
      }}
    >
      <svg
        className="table-sort-svg"
        width="7"
        height="14"
        viewBox="0 0 10 20"
        onClick={() => {
          setDir(pre => (pre === 2 ? 0 : pre + 1));
          handleSort(columnKey, EDirect[dir] as IDirect);
        }}
      >
        <polyline points="0 8,5 0,10 8,0 8" className={up} />
        <polyline points="0 12,5 20,10 12,0 12" className={down} />
      </svg>
    </div>
  );
}

export default Sort;
