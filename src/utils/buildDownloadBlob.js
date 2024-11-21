// Currently deprecated: no download button on the frontend
export default function buildDownloadBlob(fileType, activeStepState) {
  switch (fileType) {
    case "Scenario":
      const {
        name,
        version,
        dependencies,
        simulationParameters,
        schedulerParameters,
      } = activeStepState;
      const modifiedScenario = {
        name,
        version,
        dependencies,
        simulationParameters,
        schedulerParameters,
      };
      return new Promise((resolve, reject) => {
        const blob = new Blob([JSON.stringify(modifiedScenario, null, 2)], {
          type: "application/json",
        });
        resolve(blob);
      });
    case "Tasks":
      const modifiedTaskList = activeStepState.map((task) => {
        // Filter out the 'id' property
        const { id, ...taskCopy } = task;
        return taskCopy;
      });
      return new Promise((resolve, reject) => {
        const blob = new Blob([JSON.stringify(modifiedTaskList, null, 2)], {
          type: "application/json",
        });
        resolve(blob);
      });
    default:
      return new Promise((resolve, reject) => {
        const blob = new Blob([JSON.stringify(activeStepState, null, 2)], {
          type: "application/json",
        });
        resolve(blob);
      });
  }
}
