export default function buildDownloadBlob(fileType, activeStepState) {
  switch (fileType) {
    case 'Scenario':
      // TO DO: Add validation of outputPath and pythonSrc
      const { name, version, dependencies, simulationParameters, schedulerParameters } = activeStepState;
      const { outputPath, pythonSrc } = dependencies;
      const modifiedScenario = {
        name,
        version,
        dependencies: {
          outputPath,
          baseSrc: outputPath + 'builds/simulationParameters.json',
          targetSrc: outputPath + 'builds/targets.json',
          modelSrc: outputPath + 'builds/model.json',
          pythonSrc,
        },
        simulationParameters,
        schedulerParameters
      };
      return new Promise((resolve, reject) => {
        const blob = new Blob([JSON.stringify(modifiedScenario, null, 2)], { type: 'application/json' });
        resolve(blob);
      });
    case 'Tasks':
      const modifiedTaskList = activeStepState.map(task => {
        // Filter out the 'id' property
        const { id, ...taskCopy } = task;
        return taskCopy;
      });
      return new Promise((resolve, reject) => {
        const blob = new Blob([JSON.stringify(modifiedTaskList, null, 2)], { type: 'application/json' });
        resolve(blob);
      });
    default:
      return new Promise((resolve, reject) => {
        const blob = new Blob([JSON.stringify(activeStepState, null, 2)], { type: 'application/json' });
        resolve(blob);
      });
  }
}