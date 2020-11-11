import React, { useState } from 'react';
import classnames from 'classnames';

export type TDirect = 'NONE' | 'ASC' | 'DESC';

export enum EDirect {
  'NONE',
  'ASC',
  'DESC',
}

export type TSortKey<T> = {
  key: keyof T;
  direction: TDirect;
};

export type TSortFunc<T> = (sortKey: TSortKey<T>) => void;

export interface IProps<T> {
  columnKey: keyof T;
  handleSort: TSortFunc<T>;
}

function Sort<T>(props: IProps<T>) {
  const { columnKey, handleSort } = props;

  const [dir, setDir] = useState(0);

  const up = classnames('sort', {
    'sort-fill': dir === 1,
  });

  const down = classnames('sort', {
    'sort-fill': dir === 2,
  });

  return (
    <svg
      className="sort-svg"
      width="7"
      height="14"
      viewBox="0 0 10 20"
      onClick={() => {
        setDir(pre => (pre === 2 ? 0 : pre + 1));
        handleSort({
          key: columnKey,
          direction: EDirect[dir === 2 ? 0 : dir + 1] as TDirect,
        });
      }}
    >
      <polyline points="0 8,5 0,10 8,0 8" className={up} />
      <polyline points="0 12,5 20,10 12,0 12" className={down} />
    </svg>
  );
}

export default Sort;
