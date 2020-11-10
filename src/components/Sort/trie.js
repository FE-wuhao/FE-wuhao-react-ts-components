/*
 * @Author: 吴灏
 * @Date: 2020-11-10 22:42:20
 * @LastEditors: 吴灏
 * @LastEditTime: 2020-11-10 22:57:07
 * @Description: file content
 */
class Node {
  next = {};
  isEnd = false;
}

class Tree {
  root = new Node();

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
}

const trie = new Tree();

trie.insert('astre4');
trie.insert('bssfre4');
trie.insert('21312sdfsdf');

console.log(trie);
