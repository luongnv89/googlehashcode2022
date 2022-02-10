const { compare, swap } = require('./utils');
/**
 * Merge sort:
 * - O(nlogn) time
 * - O(n) space
 */

const mergeSort = (array, desc, sortKey) => {
  const tempArray = Array(array.length);
  _mergeSort(array, 0, array.length -1, tempArray, desc, sortKey);
};

const _mergeSort = (array, left, right, tempArray, desc, sortKey) => {
  if (left >= right) return;
  const mid = Math.ceil((right + left) /2);
  _mergeSort(array, left, mid -1, tempArray, desc, sortKey);
  _mergeSort(array, mid, right, tempArray, desc, sortKey);
  mergeHalves(array, left, right, tempArray, desc, sortKey);
};

const mergeHalves = (array, _left, _right, tempArray, desc, sortKey) => {
  const mid = Math.ceil((_right + _left) /2);
  const leftStart = _left;
  const leftEnd = mid - 1;
  const rightStart = mid;
  const rightEnd = _right;
  let left = leftStart;
  let right = rightStart;
  let index = leftStart;

  while( left <= leftEnd && right <= rightEnd) {
    const comp = compare(array[left], array[right], sortKey);
    if (desc && comp === 0) {
      // Left go first
      tempArray[index] = array[left];
      left++;
    } else {
      // Right go first
      tempArray[index] = array[right];
      right++;
    }
    index++;
  }

  if(left > leftEnd) {
    // Feed remain of right to the list
    while(right <= rightEnd) {
      tempArray[index] = array[right];
      right++;
      index++;
    }
  }

  if(right > rightEnd) {
    // Feed remain of left to the list
    while(left <= leftEnd) {
      tempArray[index] = array[left];
      left++;
      index++;
    }
  }

  // Update the array;
  for (let i = _left; i <= _right; i++) {
    array[i] = tempArray[i];
  }
};

module.exports = {
  mergeSort,
};
