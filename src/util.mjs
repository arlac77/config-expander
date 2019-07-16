export function createValue(value) {
  return Object.create(null, {
    value: {
      value
    }
  });
}

/**
 * merge from b into a
 * When a and b are arrays of values only the none duplaces are appendend to a
 * @param {any} a
 * @param {any} b
 * @return {any} merged b into a
 */
export function merge(a, b) {
  if (b === undefined || b === null) {
    return a;
  }

  if (Array.isArray(a)) {
    if (Array.isArray(b)) {
      return [...a, ...b.filter(x => !a.find(e => equal(e, x)))];
    }
    return [...a, b];
  }

  if (Array.isArray(b)) {
    return b;
  }

  if(b instanceof Buffer) {
    return b;
  }

  switch (typeof b) {
    case "function":
    case "string":
    case "number":
    case "boolean":
      return b;
    case "object":
      if (a === undefined || a === null) {
        a = {};
      }
      Object.keys(b).forEach(k => (a[k] = merge(a[k], b[k])));
  }

  return a;
}

export function equal(x, y) {
  const xType = typeof x;
  const yType = typeof y;

  if (xType === "object" && yType === "object" && (x !== null && y !== null)) {
    const xKeys = Object.keys(x);
    const yKeys = Object.keys(y);
    const xValues = Object.values(x);
    const yValues = Object.values(y);

    if (xKeys.length !== yKeys.length) return false;

    for (let i = 0; i < xKeys.length; i++)
      if (xKeys[i] !== yKeys[i]) return false;

    for (let i = 0; i < xValues.length; i++)
      if (!equal(xValues[i], yValues[i])) return false;
  } else {
    if (x !== y) return false;
  }
  return true;
}
