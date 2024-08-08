// Typecasts string primitive numbers to number type in an object, array, or primitive
export default function typecastNumbers(obj) {
  if (typeof obj === 'string' && !isNaN(obj)) {
    return Number(obj);
  } else if (Array.isArray(obj)) {
    return obj.map((item) => typecastNumbers(item));
  } else if (typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      newObj[key] = typecastNumbers(obj[key]);
    }
    return newObj;
  }
  return obj;
}