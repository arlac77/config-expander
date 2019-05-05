export function createValue(value) {
  return Object.create(null, {
    value: {
      value
    }
  });
}

/**
 * merge from b into a
 * @param {any} a
 * @param {any} b
 * @return {any} merged b into a
 */
export function merge(a, b) {
  if (b !== undefined) {
    if (Array.isArray(a)) {
      if (Array.isArray(b)) {
        return [...a, ...b];
      }
      return [...a, b];
    }

    if (Array.isArray(b)) {
      return b;
    }

    switch (typeof b) {
      case "string":
      case "number":
        return b;
      case "object":
        if (a === undefined) {
          a = {};
        }
        Object.keys(b).forEach(k => (a[k] = merge(a[k], b[k])));
    }
  }
  return a;
}

/**
 * genreates a new object tree by removing sensible values like credentials from it
 * @param {Object} object
 * @return {Object} object tree free of sensible data
 */
export function removeSensibleValues(
  object,
  toBeRemoved = key => key.match(/pass|auth|key|user/)
) {
  if (
    object === undefined ||
    object === null ||
    typeof object === "number" ||
    typeof object === "string" ||
    object instanceof String
  ) {
    return object;
  }

  const result = {};
  for (const key of Object.keys(object)) {
    const value = object[key];

    if (typeof value === "string" || value instanceof String) {
      if (toBeRemoved(key)) {
        result[key] = "...";
        continue;
      }
    }

    result[key] = removeSensibleValues(value);
  }

  return result;
}
