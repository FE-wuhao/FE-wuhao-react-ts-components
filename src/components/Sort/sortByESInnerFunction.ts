/*
 * @Author: 吴灏
 * @Date: 2020-11-10 13:59:25
 * @LastEditors: 吴灏
 * @LastEditTime: 2020-11-10 16:58:57
 * @Description: file content
 */
import { TDirect } from '../Sort/sort';

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
  { id: 1, name: 'wuhao', age: 25 },
  { id: 1, name: 'majian', age: 25 },
  { id: 3, name: 'xiaohong', age: 25 },
  { id: 2, name: 'zhouxin', age: 25 },
  { id: 1, name: 'wuhao', age: 25 },
  { id: 1, name: 'majian', age: 25 },
];

let a = [];

for (let i = 0; i < 10000; i++) {
  a.push(...info);
}

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
    return currentDirection === 'ASC' ? 1 : -1;
  }
  if (a[currentKey] < b[currentKey]) {
    return currentDirection === 'ASC' ? -1 : 1;
  }
  if (a[currentKey] === b[currentKey]) {
    return sortFunc(a, b, keys, priority + 1);
  }
  return 0;
}

console.time();
console.log(info.sort((a, b) => sortFunc(a, b, sortKeys, 0)));
console.timeEnd();
