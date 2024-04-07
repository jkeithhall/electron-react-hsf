import { reformatTasks } from './parseTasks';
import reformatModel from './reformatModel';

function getModifiedScenario(currentState) {
  const { name, version, dependencies, simulationParameters, schedulerParameters } = currentState;
  const { outputPath, pythonSrc } = dependencies;
  return {
    name,
    version,
    dependencies: {
      outputPath,
      baseSrc: outputPath + '/builds/simulationParameters.json',
      targetSrc: outputPath + '/builds/targets.json',
      modelSrc: outputPath + '/builds/model.json',
      pythonSrc,
    },
    simulationParameters,
    schedulerParameters
  };
}

function getModifiedTasks(currentState) {
  return reformatTasks(currentState.map(task => {
    // Filter out the 'id' property
    const { id, ...taskCopy } = task;
    return taskCopy;
  }));
}

function getCurrentState(stateSetters) {
  let currentStates = [];
  for (const setState of stateSetters) {
    setState(currentState => {
      currentStates.push(currentState);
      return currentState;
    });
  }
  return currentStates;
}

export default function buildDownloadJSON(fileType, setStateMethods) {
  const {
    setSimulationInput,
    setTaskList,
    setComponentList,
    setDependencyList,
    setEvaluator,
    setConstraints } = setStateMethods;

  let currSimulationInput, currTaskList, currComponentList, currDependencyList, currConstraints, currEvaluator;

  switch (fileType) {
    case 'Scenario':
      [currSimulationInput] = getCurrentState([setSimulationInput]);
      return JSON.stringify(getModifiedScenario(currSimulationInput), null, 2);
    case 'Tasks':
      [currTaskList] = getCurrentState([setTaskList]);
      return JSON.stringify(getModifiedTasks(currTaskList), null, 2);
    case 'System Model':
      [currComponentList, currDependencyList, currConstraints, currEvaluator] = getCurrentState([setComponentList, setDependencyList, setConstraints, setEvaluator]);
      const model = reformatModel(currComponentList, currDependencyList, currConstraints, currEvaluator);
      return JSON.stringify(model, null, 2);
    case 'SIM':
      [ currSimulationInput,
        currTaskList,
        currComponentList,
        currDependencyList,
        currConstraints,
        currEvaluator ] = getCurrentState(Object.values(setStateMethods));
      const simFileData = {
        ...getModifiedScenario(currSimulationInput),
        tasks: getModifiedTasks(currTaskList),
        model: reformatModel(currComponentList, currDependencyList, currConstraints, currEvaluator),
      }
      // Sim File is a json in compact format (no indentation)
      return JSON.stringify(simFileData);
    default:
      return;
  }
}