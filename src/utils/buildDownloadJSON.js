export default function buildDownloadJSON(fileType, setStateMethods) {
  const { setSimulationInput, setTaskList, setModel } = setStateMethods;
  let jsonString;

  switch (fileType) {
    case 'Scenario':
      setSimulationInput(currentState => {
        const { name, version, dependencies, simulationParameters, schedulerParameters } = currentState;
        const { outputPath, pythonSrc } = dependencies;
        const modifiedScenario = {
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
        jsonString = JSON.stringify(modifiedScenario, null, 2);
        return currentState;
      });
      break;
    case 'Tasks':
      setTaskList(currentState => {
        const modifiedTaskList = currentState.map(task => {
          // Filter out the 'id' property
          const { id, ...taskCopy } = task;
          return taskCopy;
        });
        jsonString = JSON.stringify(modifiedTaskList, null, 2);
        return currentState;
      });
      break;
    case 'System Model':
      setModel(currentState => {
        jsonString = JSON.stringify(currentState, null, 2);
        return currentState;
      });
      break;
    case 'SIM':
      let simulationData, tasksData, modelData;
      setSimulationInput(currentState => {
        const { name, version, dependencies, simulationParameters, schedulerParameters } = currentState;
        const { outputPath, pythonSrc } = dependencies;
        simulationData = {
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
        return currentState;
      });
      setTaskList(currentState => {
        tasksData = currentState.map(task => {
          // Filter out the 'id' property
          const { id, ...taskCopy } = task;
          return taskCopy;
        });
        return currentState;
      });
      setModel(currentState => {
        modelData = currentState;
        return currentState;
      });
      const simFileData = {
        ...simulationData,
        tasks: tasksData,
        model: modelData
      }
      // Sim File is a json in compact format (no indentation)
      jsonString = JSON.stringify(simFileData);
      break;
    default:
      return;
  }
  return jsonString;
}