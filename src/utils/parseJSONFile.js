import { flattenTasks } from './parseTasks';
import { parseModel } from './parseModel';
import { validateScenario } from './validateScenario';
import { validateAllTasks } from './validateTasks';
import { validateAllConstraints } from './validateConstraints';
import { validateAllComponents } from './validateComponents';
import { validateAllDependencies } from './validateDependencies';
import { validateEvaluator} from './validateEvaluator';
import { validateModelNodes, validateModelEdges } from './validateNodesEdges';

 const flattenScenario = (scenario) => {
    const { name, version, dependencies, simulationParameters, schedulerParameters } = scenario;
    const { pythonSrc, outputPath } = dependencies;
    return { name, version, pythonSrc, outputPath, ...simulationParameters, ...schedulerParameters };
  }

function setScenario(parsedScenario, setSimulationInput, componentList, setScenarioErrors) {
  const pythonSourceFiles = componentList
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
  setAppStateMethods,
  setValidationErrors) {
  let { systemComponents, systemDependencies, systemConstraints, systemEvaluator } = parsedModel;
  const { setComponentList, setDependencyList, setConstraints, setEvaluator } = setAppStateMethods;
  const { setModelErrors, setDependencyErrors, setConstraintErrors, setScenarioErrors } = setValidationErrors

  if (!systemComponents) { // Check for components
    throw new Error('Components field is missing');
  }
  if (!systemDependencies) { // Check for dependencies
    throw new Error('Dependencies field is missing');
  }
  if (!systemConstraints) { // Check for constraints
    throw new Error('Constraints field is missing');
  }
  if (!systemEvaluator) { // Check for evaluator
    throw new Error('Evaluator field is missing');
  }
  const throwable = true; // Throw error if required fields are missing rather than setting validation errors in state

  validateAllComponents(systemComponents, setModelErrors, pythonSrc, throwable);
  validateAllDependencies(systemDependencies, setDependencyErrors, systemComponents, throwable);
  validateAllConstraints(systemConstraints, setConstraintErrors, systemComponents, throwable);
  validateEvaluator(systemEvaluator, setScenarioErrors, systemComponents, pythonSrc, throwable);

  setComponentList(systemComponents);
  setDependencyList(systemDependencies);
  setConstraints(systemConstraints);
  setEvaluator(systemEvaluator);
  return { systemComponents, systemDependencies };
}

function setAppState(parsedJSON, setAppStateMethods, setValidationErrors) {
  const {
    simulationInput,
    taskList,
    componentList,
    dependencyList,
    evaluator,
    constraints,
    modelNodes,
    modelEdges,
  } = parsedJSON;
  const {
    setSimulationInput,
    setTaskList,
    setComponentList,
    setDependencyList,
    setEvaluator,
    setConstraints,
    setModelNodes,
    setModelEdges,
  } = setAppStateMethods;
  const {
    setScenarioErrors,
    setTaskErrors,
    setModelErrors,
    setDependencyErrors,
    setConstraintErrors,
  } = setValidationErrors;

  const throwable = true; // Throw error if required fields are missing rather than setting validation errors in state

  const flattenedScenario = flattenScenario(simulationInput);
  const pythonSourceFiles = componentList
    .filter((component) => component.parent && component.type.toLowerCase() === 'scripted')
    .map((component) => component.src);

  validateScenario(flattenedScenario, setScenarioErrors, pythonSourceFiles, throwable);
  validateAllTasks(taskList, setTaskErrors, throwable);
  validateAllComponents(componentList, setModelErrors, pythonSourceFiles, throwable);
  validateAllDependencies(dependencyList, setDependencyErrors, componentList, throwable);
  validateAllConstraints(constraints, setConstraintErrors, componentList, throwable);
  validateEvaluator(evaluator, setScenarioErrors, componentList, pythonSourceFiles, throwable);

  // All errors in the model graph are thrown during import
  validateModelNodes(modelNodes, componentList);
  validateModelEdges(modelEdges, modelNodes);

  setSimulationInput(simulationInput);
  setTaskList(taskList);
  setComponentList(componentList);
  setDependencyList(dependencyList);
  setEvaluator(evaluator);
  setConstraints(constraints);
  setModelNodes(modelNodes);
  setModelEdges(modelEdges);
}

export default function parseJSONFile(
  fileType,
  content,
  setAppStateMethods,
  setValidationErrors,
  componentList,
  pythonSrc,
  updateModelGraph) {
  const { setSimulationInput, setTaskList } = setAppStateMethods;
  const { setScenarioErrors, setTaskErrors } = setValidationErrors;
  try {
    const parsedJSON = JSON.parse(content);

    switch (fileType) {
      case 'Scenario':
        setScenario(parsedJSON, setSimulationInput, componentList, setScenarioErrors);
        return;
      case 'Tasks':
        setTasks(parsedJSON, setTaskList, setTaskErrors);
        return;
      case 'System Model':
        const { systemComponents, systemDependencies } = setModel(
          parseModel(parsedJSON.model),
          pythonSrc,
          setAppStateMethods,
          setValidationErrors);
        updateModelGraph(systemComponents, systemDependencies);
        return;
      case 'SIM':
        setAppState(parsedJSON, setAppStateMethods, setValidationErrors);
        return;
      default:
        return null;
    }
  } catch (error) {
    console.log(`Error parsing JSON file: ${error.message}`);
    throw new Error(`Error parsing JSON file: ${error.message}`);
  }
}