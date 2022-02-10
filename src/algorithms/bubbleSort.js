const { compare, swap } = require('./utils');
/**
 * Bubble sort - O(n^2)
 * @param {Array} data Array of data
 * @param {Boolean} desc true - desc, false - inscrease
 * @param {Strign||null} sortKey sorted attribute
 */
const bubbleSort = (array, desc, sortKey = null) => {
  let isSorted = false;
  let lastUnsortedIndex = array.length - 1;
  while(!isSorted) {
    isSorted = true;
    for (let index = 0; index < lastUnsortedIndex; index++) {
      const comp = compare(array[index], array[index + 1], sortKey);
      if (desc && comp === 2 || !desc && comp === 0) {
        swap(array, index, index + 1);
        isSorted = false;
      }
    }
    lastUnsortedIndex--;
  }
};

// const bubbleSort2 = (array, desc, sortKey = null) => {
//   for (let index1 = 0; index1 < array.length - 1; index1 += 1) {
//     for (let index = index1 + 1; index < array.length; index += 1) {
//       const comp = compare(array[index1], array[index], sortKey);
//       if ((desc && comp === 2) || (!desc && comp === 0)) {
//         swap(array, index, index1);
//       }
//     }
//   }
// }

module.exports = {
  bubbleSort,
};
