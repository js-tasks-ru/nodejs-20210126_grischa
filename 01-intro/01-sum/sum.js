function sum(a, b) {
  if (typeof a !== 'number') {
    throw new TypeError(`First param invalid: number expected but ${typeof a} given`);
  }
  if (typeof b !== 'number') {
    throw new TypeError(`Second param invalid: number expected but ${typeof b} given`);
  }
  return a + b;
}

module.exports = sum;
