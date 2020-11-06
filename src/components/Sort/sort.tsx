import React, { useState } from 'react';
import classnames from 'classnames';

export type IDirect = 'NONE' | 'ASC' | 'DESC';

export enum EDirect {
  'NONE',
  'ASC',
  'DESC',
}

export interface IProps<T> {
  handleSort: (direct: IDirect, ...[...restProps]) => void;
  handleSortRestProps?: T; // 可扩展自定义参数
}

function Sort<T>(props: IProps<T>) {
  const { handleSort, handleSortRestProps } = props;

  const [dir, setDir] = useState(0);

  const up = classnames('sort', {
    'sort-fill': dir === 1,
  });

  const down = classnames('sort', {
    'sort-fill': dir === 2,
  });

  return (
    <div
      className="sort-container"
      onClick={() => {
        setDir(pre => (pre === 2 ? 0 : pre + 1));
        handleSort(EDirect[dir] as IDirect, handleSortRestProps);
      }}
    >
      <svg className="sort-svg" width="7" height="14" viewBox="0 0 10 20">
        <polyline points="0 8,5 0,10 8,0 8" className={up} />
        <polyline points="0 12,5 20,10 12,0 12" className={down} />
      </svg>
    </div>
  );
}

export default Sort;
