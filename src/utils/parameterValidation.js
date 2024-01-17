import { string, number } from 'yup';
// import fs from 'fs';

const validationSchema = {
  sourceName: { schema: string().required(), isFileName: false },
  baseSource: { schema: string().required(), isFileName: true },
  modelSource: { schema: string().required(), isFileName: true },
  targetSource: { schema: string().required(), isFileName: true },
  pythonSource: { schema: string().required(), isFileName: true },
  outputPath: { schema: string().required(), isFileName: true },
  version: { schema: number().required(), isFileName: false },
  startJD: { schema: number().required(), isFileName: false },
  startSeconds: { schema: number().required().min(0, 'Start Seconds must be greater than or equal to 0'), isFileName: false },
  endSeconds: { schema: number().required().min(0, 'End Seconds must be greater than 0'), isFileName: false },
  primaryStepSeconds: { schema: number().required().min(0, 'Primary Step Seconds must be greater than 0'), isFileName: false },
  maxSchedules: { schema: number().required().min(0, 'Max Schedules must be greater than 0'), isFileName: false },
  cropRatio: { schema: number().required().min(0, 'Crop Ratio must be greater than 0'), isFileName: false },
}

export default async function validateParameter(name, value) {
  try {
    await validationSchema[name].schema.validate(value);
    // if (validationSchema[name].isFileName) {
    //   await fs.promises.access(value);
    // }
    return true;
  } catch (error) {
    return error.message;
  }
}