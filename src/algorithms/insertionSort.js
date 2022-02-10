const { compare, swap } = require('./utils');
/**
 * Insertion sort - O(n^2)
 * @param {Array} data Array of data
 * @param {Boolean} desc true - desc, false - inscrease
 * @param {Strign||null} sortKey sorted attribute
 */
const insertionSort = (array, desc, sortKey = null) => {
  for (let index = 1; index < array.length; index += 1) {
    _insert(array, index, desc, sortKey);
  }
};

const _insert = (array, index, desc, sortKey) => {
  if (index === 0 ) return;
  const comp0 = compare(array[index], array[index - 1], sortKey);
  if ((desc && comp0 === 0) || (!desc && comp0 === 2)) {
    // Move each element 1 step
    swap(array, index, index - 1);
    _insert(array, index - 1, desc, sortKey);
  }
};

module.exports = {
  insertionSort,
};
