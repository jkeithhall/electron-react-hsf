import { flattenTasks } from './parseTasks';
import { parseModel } from './parseModel';
import { validateScenario } from './validateScenario';
import { validateAllTasks } from './validateTasks';
import { validateAllConstraints } from './validateConstraints';
import { validateAllComponents } from './validateComponents';
import { validateAllDependencies } from './validateDependencies';
import { validateEvaluator} from './validateEvaluator';

 const flattenScenario = (scenario) => {
    const { name, version, dependencies, simulationParameters, schedulerParameters } = scenario;
    const { pythonSrc, outputPath } = dependencies;
    return { name, version, pythonSrc, outputPath, ...simulationParameters, ...schedulerParameters };
  }

function setScenario(parsedScenario, setSimulationInput, setComponentList, setScenarioErrors) {
  // TODO: Import updated componentList using useEffect
  let componentList;
  setComponentList((currentComponentList) => {
    componentList = currentComponentList;
    return currentComponentList;
  });

  let pythonSourceFiles = componentList
    .filter((component) => component.parent && component.type.toLowerCase() === 'scripted')
    .map((component) => component.src);

  // Validate parameters
  const flattenedScenario = flattenScenario(parsedScenario);
  const throwable = true; // Throw error if required fields are missing rather than setting validation errors in state
  validateScenario(flattenedScenario, setScenarioErrors, pythonSourceFiles, throwable);

  setSimulationInput(parsedScenario);
  return parsedScenario;
}

function setTasks(parsedTasks, setTaskList, setTaskErrors) {
  const flattenedTasks = flattenTasks(parsedTasks);
  const throwable = true; // Throw error if required fields are missing rather than setting validation errors in state

  validateAllTasks(flattenedTasks, setTaskErrors, throwable);
  setTaskList(flattenedTasks);
  return parsedTasks;
}

function setModel(
  parsedModel,
  pythonSrc,
  setComponentList,
  setDependencyList,
  setConstraints,
  setEvaluator,
  setScenarioErrors,
  setModelErrors,
  setConstraintErrors) {
  let { systemComponents, systemDependencies, systemConstraints, systemEvaluator } = parsedModel;
  if (!systemComponents) { // Check for components
    throw new Error('Components field is missing');
  }
  if (!systemComponents.find(c => c.parent === undefined)) { // Check for at least one asset
    throw new Error('At least one asset must be defined');
  }
  if (!systemComponents.find(c => c.parent !== undefined)) { // Check for at least one subsystem
    throw new Error('At least one subsystem must be defined');
  }
  if (!systemDependencies) { // Check for dependencies
    throw new Error('Dependencies field is missing');
  }
  const throwable = true; // Throw error if required fields are missing rather than setting validation errors in state

  validateAllComponents(systemComponents, setModelErrors, pythonSrc, throwable);
  setComponentList(systemComponents);

  // Currently any dependency errors will be thrown during import: any errors result in a failed import
  // There is no dependency error state to set
  validateAllDependencies(systemDependencies, systemComponents);
  setDependencyList(systemDependencies);

  validateAllConstraints(systemConstraints, setConstraintErrors, systemComponents, throwable);
  setConstraints(systemConstraints);

  validateEvaluator(systemEvaluator, setScenarioErrors, systemComponents, pythonSrc, throwable);
  setEvaluator(systemEvaluator);
  return { systemComponents, systemDependencies, systemConstraints, systemEvaluator };
}

export default function parseJSONFile(fileType, content, setStateMethods, setValidationErrors, pythonSrc) {
  const { setSimulationInput, setTaskList, setComponentList, setDependencyList, setConstraints, setEvaluator } = setStateMethods;
  const { setScenarioErrors, setTaskErrors, setModelErrors, setConstraintErrors } = setValidationErrors;
  try {
    const parsedJSON = JSON.parse(content);

    switch (fileType) {
      case 'Scenario':
        return setScenario(parsedJSON, setSimulationInput, setComponentList, setScenarioErrors);
      case 'Tasks':
        return setTasks(parsedJSON, setTaskList, setTaskErrors);
      case 'System Model':
        return setModel(
          parseModel(parsedJSON),
          pythonSrc,
          setComponentList,
          setDependencyList,
          setConstraints,
          setEvaluator,
          setScenarioErrors,
          setModelErrors,
          setConstraintErrors);
      case 'SIM':
        const { tasks, model, ...scenario } = parsedJSON;
        const parsedModel = parseModel(model);

        setScenario(scenario, setSimulationInput, setComponentList, setScenarioErrors);
        setTasks(tasks, setTaskList, setTaskErrors);
        setModel(
          parsedModel,
          pythonSrc,
          setComponentList,
          setDependencyList,
          setConstraints,
          setEvaluator,
          setScenarioErrors,
          setModelErrors,
          setConstraintErrors
        );

        return { tasks: flattenTasks(tasks), model: parsedModel, ...scenario };
      default:
        return null;
    }
  } catch (error) {
    console.log(`Error parsing JSON file: ${error.message}`);
    throw new Error(`Error parsing JSON file: ${error.message}`);
  }
}