function buildScenarioBlob (sources, simulationParameters, schedulerParameters) {
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
  }

  return new Promise((resolve, reject) => {
    const blob = new Blob([JSON.stringify(parameters, null, 2)], { type: 'application/json' });
    resolve(blob);
  });
}

function buildTaskBlob (taskList) {
  const taskListCopy = taskList.map(task => {
    // Filter out the 'id' property
    const { id, ...taskCopy } = task;
    return taskCopy;
  });

  return new Promise((resolve, reject) => {
    const blob = new Blob([JSON.stringify(taskListCopy, null, 2)], { type: 'application/json' });
    resolve(blob);
  });
}

export { buildScenarioBlob, buildTaskBlob };