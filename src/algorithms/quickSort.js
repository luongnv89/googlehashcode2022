const { compare, swap } = require('./utils');

const quickSort = (array, desc, sortKey) => {
  return _quick(array, desc, 0, array.length - 1, sortKey);
};

const _quick = (array, desc, left, right, sortKey) => {
  if (left >= right) return;
  const pivot = array[Math.floor((right + left) / 2)];
  const pivotIndex = partition(array, desc, left, right, pivot, sortKey);
  _quick(array, desc, left, pivotIndex - 1, sortKey);
  _quick(array, desc, pivotIndex, right, sortKey);
};

const partition = (array, desc, _left, _right, pivot, sortKey) => {
  if (_left === _right) return _left;
  let left = _left;
  let right = _right;
  if (desc) {
    while (left <= right) {
      while(compare(array[left], pivot, sortKey) === 0 ) {
        left++;
      }
      while(compare(array[right], pivot, sortKey) === 2 ) {
        right--;
      }
      if (left <= right) {
        swap(array, left, right);
        left++;
        right--;
      }
    }
  } else {
    while (left <= right) {
      while(compare(array[left], pivot, sortKey) === 2 ) {
        left++;
      }
      while(compare(array[right], pivot, sortKey) === 0 ) {
        right--;
      }
      if (left <= right) {
        swap(array, left, right);
        left++;
        right--;
      }
    }
  }
  return left;
};

module.exports = {
  quickSort,
};