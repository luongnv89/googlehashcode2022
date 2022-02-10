const swap = (array, left, right) => {
  const leftItem = array[left];
  array[left] = array[right];
  array[right] = leftItem;
};


const compare = (a, b, sortKey = null) => {
  let ca = a;
  let cb = b;
  if (sortKey) {
    ca = a[sortKey];
    cb = b[sortKey];
  }
  if (ca > cb) return 0;
  if (ca == cb) return 1;
  if (ca < cb) return 2;
};

module.exports = {
  compare,
  swap,
};
