import { reformatTasks } from "./parseTasks";
import reformatModel from "./reformatModel";
import typecastNumbers from "./typecastNumbers";

function getModifiedScenario(currentState) {
  if (!window.electronApi) return;

  let {
    name,
    version,
    dependencies,
    simulationParameters,
    schedulerParameters,
  } = currentState;

  let { outputPath, pythonSrc } = dependencies;
  let baseSrc = window.electronApi.baseSrc;
  outputPath = outputPath ?? baseSrc;

  // For Windows, replace all forward slashes with backslashes
  if (window.electronApi.directorySeparator === "\\") {
    baseSrc = baseSrc.replace(/\//g, "\\");
    outputPath = outputPath?.replace(/\//g, "\\");
    pythonSrc = pythonSrc?.replace(/\//g, "\\");
  }

  return {
    name,
    version: Number(version),
    dependencies: {
      outputPath,
      baseSrc,
      targetSrc: "targets.json",
      modelSrc: "model.json",
      pythonSrc,
    },
    simulationParameters: typecastNumbers(simulationParameters),
    schedulerParameters: typecastNumbers(schedulerParameters),
  };
}

function getModifiedTasks(currentState) {
  const reformattedTasks = reformatTasks(
    currentState.map((task) => {
      // Filter out the 'id' property
      const { id, ...taskCopy } = task;
      return taskCopy;
    }),
  );
  return {
    tasks: reformattedTasks,
  };
}

export default function buildDownloadJSON(fileType, appState) {
  const {
    simulationInput,
    taskList,
    componentList,
    dependencyList,
    constraints,
    evaluator,
  } = appState;

  switch (fileType) {
    case "Scenario":
      return JSON.stringify(getModifiedScenario(simulationInput), null, 2);
    case "Tasks":
      return JSON.stringify(getModifiedTasks(taskList), null, 2);
    case "System Model":
      const model = reformatModel(
        componentList,
        dependencyList,
        constraints,
        evaluator,
      );
      return JSON.stringify(model, null, 2);
    default:
      return;
  }
}
