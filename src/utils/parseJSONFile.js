import { flattenTasks } from './parseTasks';

export default function parseJSONFile(fileType, content, setStateMethods) {
  const { setSimulationInput, setTaskList, setModel } = setStateMethods;
  try {
    const parsedJSON = JSON.parse(content);
    const { tasks, model, ...rest } = parsedJSON;

    switch (fileType) {
      case 'Scenario':
        setSimulationInput(parsedJSON);
        break;
      case 'Tasks':
        setTaskList(flattenTasks(tasks));
        break;
      case 'System Model':
        setModel(model);
        break;
      case 'SIM':
        setSimulationInput(rest);
        setTaskList(flattenTasks(tasks));
        setModel(model);
        break;
      default:

    }
    return parsedJSON;
  } catch (error) {
    console.log(`Error parsing JSON file: ${error.message}`);
    throw new Error(`Error parsing JSON file: ${error.message}`);
  }
}