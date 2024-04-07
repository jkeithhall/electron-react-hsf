import { flattenTasks } from './parseTasks';
import { parseModel } from './parseModel';

export default function parseJSONFile(fileType, content, setStateMethods) {
  const { setSimulationInput, setTaskList, setComponentList, setDependencyList, setConstraints, setEvaluator } = setStateMethods;
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
        let parsedModel = parseModel(model);
        setComponentList(parsedModel.systemComponents);
        setDependencyList(parsedModel.systemDependencies);
        setConstraints(parsedModel.systemConstraints);
        setEvaluator(parsedModel.systemEvaluator);
        break;
      case 'SIM':
        setSimulationInput(rest);
        setTaskList(flattenTasks(tasks));
        parsedModel = parseModel(model);
        setComponentList(parsedModel.systemComponents);
        setDependencyList(parsedModel.systemDependencies);
        setConstraints(parsedModel.systemConstraints);
        setEvaluator(parsedModel.systemEvaluator);
        break;
      default:

    }
    return parsedJSON;
  } catch (error) {
    console.log(`Error parsing JSON file: ${error.message}`);
    throw new Error(`Error parsing JSON file: ${error.message}`);
  }
}