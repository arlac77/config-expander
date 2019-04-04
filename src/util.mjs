export function createValue(value) {
  return Object.create(null, {
    value: {
      value
    }
  });
}

/**
 * merge from b into a
 */
export function merge(a, b) {
  if (b !== undefined) {

    if(Array.isArray(a)) {
        if(Array.isArray(b)) {
          return [...a,...b];
        }
        return [...a,b];
    }

    if(Array.isArray(b)) {
      return b;
    }

    switch (typeof b) {
      case "string":
      case "number":
        return b;
      case "object":
        Object.keys(b).forEach(k => (a[k] = merge(a[k], b[k])));
    }
  }
  return a;
}
