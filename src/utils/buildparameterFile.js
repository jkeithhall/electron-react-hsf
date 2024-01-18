import { promises } from 'fs';

export default async function buildScenarioFile (sources, simulationParameters, schedulerParameters) {
  const { sourceName, baseSource, modelSource, targetSource, pythonSource, outputPath, version } = sources;
  const { startJD, startSeconds, endSeconds, primaryStepSeconds } = simulationParameters;
  const { maxSchedules, cropRatio } = schedulerParameters;

  // FILL IN WITH DESIRED PATH
  const writeDirectory = './samples';

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

  try {
    await promises.writeFile(`${writeDirectory}/${sourceName}.json`, JSON.stringify(parameters, null, 2));
  } catch (error) {
    console.error(`Error writing file: ${error}`);
  }
}