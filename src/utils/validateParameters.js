import { string, number, object } from 'yup';

const scenarioSchema = object({
  sourceName: string().required(),
  baseSource: string().required(),
  modelSource: string().required(),
  targetSource: string().required(),
  pythonSource: string().required(),
  outputPath: string().required(),
  version: number().required(),
  startJD: number().required(),
  startSeconds: number().required().min(0, 'Start Seconds must be greater than or equal to 0'),
  // End Seconds must be greater than Start Seconds
  endSeconds: number().required().when('startSeconds', (startSeconds, schema) => {
    return schema.min(startSeconds, 'End Seconds must be greater than Start Seconds');
  }),
  primaryStepSeconds: number().required().min(0, 'Primary Step Seconds must be greater than 0'),
  maxSchedules: number().required().min(0, 'Max Schedules must be greater than 0'),
  cropRatio: number().required().min(0, 'Crop Ratio must be greater than 0'),
});

async function validateParametersAt(parameters, name) {
  try {
    await scenarioSchema.validateAt(name, parameters);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function validateAllParameters(parameters) {
  try {
    await scenarioSchema.validate(parameters);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export { validateParametersAt, validateAllParameters };