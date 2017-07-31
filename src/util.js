export function createValue(value) {
  return Object.create(null, {
    value: {
      value
    }
  });
}
