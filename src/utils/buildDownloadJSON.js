import { reformatTasks } from './parseTasks';
import reformatModel from './reformatModel';
import typecastNumbers from './typecastNumbers';

function getModifiedScenario(currentState) {
  if (!window.electronApi) return;

  let { name, version, dependencies, simulationParameters, schedulerParameters } = currentState;
  let { outputPath, pythonSrc } = dependencies;

  const baseSrcAbs = window.electronApi.baseSrc;
  let baseSrcRel = './output';
  outputPath = outputPath ?? baseSrcAbs;

  // Python source files should be given relative to baseSrc
  pythonSrc = window.electronApi.getRelativePath(baseSrcAbs, pythonSrc);

  // path-browserify module only uses POSIX separators; for Windows, replace all forward slashes with backslashes
  if (window.electronApi.directorySeparator === '\\') {
    baseSrcRel = baseSrcRel.replace(/\//g, '\\');
    outputPath = outputPath?.replace(/\//g, '\\');
    pythonSrc = pythonSrc?.replace(/\//g, '\\');
  }
  return {
    name,
    version: Number(version),
    dependencies: {
      outputPath,
      baseSrc: baseSrcRel,
      targetSrc: 'targets.json',
      modelSrc: 'model.json',
      pythonSrc,
    },
    simulationParameters: typecastNumbers(simulationParameters),
    schedulerParameters: typecastNumbers(schedulerParameters),
  };
}

function getModifiedTasks(currentState) {
  const reformattedTasks = reformatTasks(currentState.map(task => {
    // Filter out the 'id' property
    const { id, ...taskCopy } = task;
    return taskCopy;
  }));
  return {
    tasks: reformattedTasks
  };
}

function getCurrentState(stateSetters) {
  let currentStates = {};
  Object.entries(stateSetters).forEach(([methodName, setState]) => {
    setState(currentState => {
      const key = methodName.replace('set', 'curr');
      currentStates[key] = currentState;
      return currentState;
    });
  });
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

  switch (fileType) {
    case 'Scenario':
      let { currSimulationInput } = getCurrentState({ setSimulationInput });
      return JSON.stringify(getModifiedScenario(currSimulationInput), null, 2);
    case 'Tasks':
      let { currTaskList } = getCurrentState({ setTaskList });
      return JSON.stringify(getModifiedTasks(currTaskList), null, 2);
    case 'System Model':
      let { currComponentList, currDependencyList, currConstraints, currEvaluator } = getCurrentState({ setComponentList, setDependencyList, setConstraints, setEvaluator });
      const model = reformatModel(currComponentList, currDependencyList, currConstraints, currEvaluator);
      return JSON.stringify(model, null, 2);
    case 'SIM':
      const currentData = getCurrentState(setStateMethods);
      const simFileData = {
        ...getModifiedScenario(currentData.currSimulationInput),
        tasks: getModifiedTasks(currentData.currTaskList),
        model: reformatModel(currentData.currComponentList, currentData.currDependencyList, currentData.currConstraints, currentData.currEvaluator),
      }
      // Sim File is a json in compact format (no indentation)
      return JSON.stringify(simFileData);
    default:
      return;
  }
}