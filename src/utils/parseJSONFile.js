import { flattenTasks } from './parseTasks';
import { parseModel } from './parseModel';

export default function parseJSONFile(fileType, content, setStateMethods) {
  const { setSimulationInput, setTaskList, setComponentList, setDependencyList, setConstraints, setEvaluator } = setStateMethods;
  try {
    const parsedJSON = JSON.parse(content);

    switch (fileType) {
      case 'Scenario':
        setSimulationInput(parsedJSON);
        return parsedJSON;
      case 'Tasks':
        setTaskList(flattenTasks(parsedJSON));
        return parsedJSON;
      case 'System Model':
        let parsedModel = parseModel(parsedJSON);
        setComponentList(parsedModel.systemComponents);
        setDependencyList(parsedModel.systemDependencies);
        setConstraints(parsedModel.systemConstraints);
        setEvaluator(parsedModel.systemEvaluator);
        return parsedModel;
      case 'SIM':
        const { tasks, model, ...rest } = parsedJSON;
        setSimulationInput(rest);
        const flattenedTasks = flattenTasks(tasks);
        setTaskList(flattenedTasks);
        const parsedSimModel = parseModel(model);
        setComponentList(parsedSimModel.systemComponents);
        setDependencyList(parsedSimModel.systemDependencies);
        setConstraints(parsedSimModel.systemConstraints);
        setEvaluator(parsedSimModel.systemEvaluator);
        return { tasks: flattenedTasks, model: parsedSimModel, ...rest };
      default:
        return null;
    }
  } catch (error) {
    console.log(`Error parsing JSON file: ${error.message}`);
    throw new Error(`Error parsing JSON file: ${error.message}`);
  }
}