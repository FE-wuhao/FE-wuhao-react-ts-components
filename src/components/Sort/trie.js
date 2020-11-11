/*
 * @Author: 吴灏
 * @Date: 2020-11-10 22:42:20
 * @LastEditors: 吴灏
 * @LastEditTime: 2020-11-11 11:37:32
 * @Description: file content
 */
class Node {
  next = {};
  isEnd = false;
}

class Tree {
  root = new Node();
  // 向数组插入字符串
  insert(character) {
    let node = this.root;

    for (let i = 0; i < character.length; i++) {
      if (!node.next[character[i]]) {
        node.next[character[i]] = new Node();
      }
      node = node.next[character[i]];
    }

    node.isEnd = true;
  }
  // 查找数组是否存在某个字符串
  search(character) {
    let node = this.root;
    for (let i = 0; i < character.length; i++) {
      if (!node.next[character[i]]) {
        return false;
      }
      node = node.next[character[i]];
    }

    return node.isEnd;
  }
  // 查找数组中是否存在某个前缀的字符串
  startwith(character) {
    let node = this.root;
    for (let i = 0; i < character.length; i++) {
      if (!node.next[character[i]]) {
        return false;
      }
      node = node.next[character[i]];
    }

    return true;
  }
}

const trie = new Tree();

trie.insert('astre4');
trie.insert('bssfre4');
trie.insert('21312sdfsdf');

console.log(trie);
console.log(trie.search('astre4'));
console.log(trie.search('22312sdfsdf'));
console.log(trie.startwith('bss'));
