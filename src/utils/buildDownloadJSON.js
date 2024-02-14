export default function buildDownloadJSON(fileType, sources, simulationParameters, schedulerParameters, taskList, model) {
  switch (fileType) {
    case 'Scenario':
      const { sourceName, baseSource, modelSource, targetSource, pythonSource, outputPath, version } = sources;
      const { startJD, startSeconds, endSeconds, primaryStepSeconds } = simulationParameters;
      const { maxSchedules, cropRatio } = schedulerParameters;
      const parameters = {
        'Sources': {
          'Source Name': sourceName,
          'Base Source': baseSource,
          'Model Source': modelSource,
          'Target Source': targetSource,
          'Python Source': pythonSource,
          'Output Path': outputPath,
          'Version': version
        },
        'Simulation Parameters': {
          'Start JD': startJD,
          'Start Seconds': startSeconds,
          'End Seconds': endSeconds,
          'Primary Step Seconds': primaryStepSeconds
        },
        'Scheduler Parameters': {
          'Max Schedules': maxSchedules,
          'Crop Ratio': cropRatio
        }
      };
      return JSON.stringify(parameters, null, 2);
    case 'Tasks':
      const modifiedTaskList = taskList.map(task => {
        // Filter out the 'id' property
        const { id, ...taskCopy } = task;
        return taskCopy;
      });
      return JSON.stringify(modifiedTaskList, null, 2);
    case 'System Model':
      return JSON.stringify(model, null, 2);
    default:
      return '';
  }
}