function getCurrentState(stateSetters) {
  let currentStates = {};
  Object.entries(stateSetters).forEach(([methodName, setState]) => {
    setState(currentState => {
      // Remove 'set' and make the first letter lowercase
      const key = methodName.slice(3, 4).toLowerCase() + methodName.slice(4);
      currentStates[key] = currentState;
      return currentState;
    });
  });
  return currentStates;
}

export default function buildSimFile(savedStateMethods) {
  return JSON.stringify(getCurrentState(savedStateMethods), null, 2);
}