const { compare, swap } = require('./utils');
/**
 * Selection sort is a simple sorting algorithm. This sorting algorithm is an in-place comparison-based algorithm in which the list is divided into two parts, the sorted part at the left end and the unsorted part at the right end. Initially, the sorted part is empty and the unsorted part is the entire list. The smallest element is selected from the unsorted array and swapped with the leftmost element, and that element becomes a part of the sorted array. This process continues moving unsorted array boundary by one element to the right.
 * Complexity: O(n2)
 * @param {Array} array
 * @param {Boolean} desc true: descrease, false: increase
 * @param {string} sortKey the value to be sorted
 */
const selectionSort = (array, desc, sortKey) => {
  _selectionSort(array, 0, desc, sortKey);
};

const _selectionSort = (array, index, desc, sortKey) => {
  if (index === array.length -1) return;
  let sortedValue = array[index];
  let selectionIndex = index;
  for (let i = index + 1; i < array.length; i++) {
    const comp = compare(sortedValue, array[i], sortKey);
    if (desc && comp === 2 || !desc && comp === 0) {
      sortedValue = array[i];
      selectionIndex = i;
    }
  }
  if (selectionIndex !== index) {
    swap(array, index, selectionIndex);
  }
  _selectionSort(array, index + 1, desc, sortKey);
};

module.exports = {
  selectionSort,
};
