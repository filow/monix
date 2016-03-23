const left = [
  11, 12, 13, 14, 15,
  21, 22, 23,
  31, 32, 33, 34, 35, 36, 37,
  41, 42, 43, 44, 45, 46,
  50, 51, 52, 53, 54,
  61, 65, 71, 81, 82,
];
export function zipCode() {
  const middle = this.natural({ min: 0, max: 60 })();
  const right = this.natural({ min: 0, max: 50 })();
  return `${this.pickone(left)}${this.pad(middle, 2)}${this.pad(right, 2)}`;
}
