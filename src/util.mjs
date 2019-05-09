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
      return [...a, ...a.filter(x => !b.includes(x))];
    }
    return [...a, b];
  }

  if (Array.isArray(b)) {
    return b;
  }

  switch (typeof b) {
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

/**
 * genereates a new object tree by removing sensible values like credentials from it
 * @param {Object} object
 * @return {Object} object tree free of sensible data
 */
export function removeSensibleValues(
  object,
  toBeRemoved = key => key.match(/pass|auth|key|user|secret/)
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
