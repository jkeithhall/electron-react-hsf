import { string, number, object } from 'yup';

const scenarioSchema = object({
  name: string().required('Simulation name is required'),
  pythonSrc: string().required('Python Source is required'),
  outputPath: string().required('Output Path is required'),
  version: number().required('Version is required'),
  startJD: number().required('Start Julian Date is required'),
  startSeconds: number().required().min(0, 'Start Seconds must be greater than or equal to 0'),
  // End Seconds must be greater than Start Seconds
  endSeconds: number().required().when('startSeconds', (startSeconds, schema) => {
    return schema.min(startSeconds, 'End Seconds must be greater than Start Seconds');
  }),
  stepSeconds: number().required().min(0, 'Step Seconds must be greater than 0'),
  maxSchedules: number().required().min(0, 'Max Schedules must be greater than 0'),
  cropTo: number().required().min(0, 'Crop To must be greater than 0'),
});

const taskSchema = object({
  taskName: string().required('Task Name is required'),
  type: string().required('Task Type is required'),
  latitude: number().required().min(-90, 'Latitude must be ≥-90').max(90, 'Latitude must be ≤90'),
  longitude: number().required().min(-180, 'Longitude must be ≥-180').max(180, 'Longitude must be ≤180'),
  altitude: number().required().min(0, 'Altitude must be ≥0'),
  priority: number().required().min(0, 'Priority must be ≥0'),
  value: number().required('Value is required'),
  minQuality: number().required().min(0, 'Min Quality must be ≥0'),
  desiredCapTime: number().required().min(0, 'Desired Cap Time must be ≥0'),
  nonzeroValCapTime: number().required().positive('Nonzero Value Cap Time must be ≥0'),
});

async function validateScenarioParametersAt(parameters, name) {
  try {
    await scenarioSchema.validateAt(name, parameters);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function validateTaskParametersAt(parameters, name) {
  try {
    await taskSchema.validateAt(name, parameters);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function validateAllScenarioParameters(parameters) {
  try {
    await scenarioSchema.validate(parameters);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export { validateScenarioParametersAt, validateTaskParametersAt, validateAllScenarioParameters };