export default function parseSimFile(newState, savedStateMethods) {
  try {
    const parsedJSON = JSON.parse(newState);
    Object.entries(parsedJSON).forEach(([key, value]) => {
      const methodName = `set${key[0].toUpperCase()}${key.slice(1)}`;
      const setState = savedStateMethods[methodName];
      setState(value);
    });
    return parsedJSON;
  } catch (error) {
    console.log(`Error parsing sim file: ${error.message}`);
    throw new Error(`Error parsing sim file: ${error.message}`);
  }
}