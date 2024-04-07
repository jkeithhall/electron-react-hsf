import { string, number, object } from 'yup';
import { findInvalidPythonFiles } from './validatePythonFiles';

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

const assetSchema = object({
  name: string().required('Name is required'),
  className: string().required('Class Name is required').oneOf(['asset'], 'Class Name must be "asset"'),
  dynamicStateType: string().required('Dynamic State Type is required').oneOf(['STATIC_LLA', 'STATIC_ECI', 'PREDETERMINED_LLA', 'PREDETERMINED_ECI', 'DYNAMIC_LLA', 'DYNAMIC_ECI', 'STATIC_LVLH', 'NULL_STATE'], 'Dynamic State Type is invalid'),
  eomsType: string().required('EOMS Type is required').oneOf(['orbitalEOMS', 'EarthPerts', 'scriptedEOMS'], 'EOMS Type must be one of ["orbitalEOMS", "EarthPerts", "scriptedEOMS"]', 'EOMS Type is invalid'),
});

const validateStateData = (stateData) => {
  stateData.forEach((element) => {
    if (typeof element !== 'number') {
      throw new Error('State Data components must be numbers');
    }
  });
};

const validateIntegratorOptions = (integratorOptions) => {
  Object.entries(integratorOptions).forEach(([key, value]) => {
    if (typeof value !== 'number') {
      throw new Error(`${key} must be a number`);
    }
  });
};

const validateIntegratorParameters = (integratorParameters) => {
  integratorParameters.forEach((parameter) => {
    const { key, value, type } = parameter;
    if (type === 'int' && !Number.isInteger(value)) {
      throw new Error(`${key} must be an number`);
    } else if (type === 'double' && typeof value !== 'number') {
      throw new Error(`${key} must be a number`);
    } else { // vector (array of doubles)
      value.forEach((element) => {
        if (typeof element !== 'number') {
          throw new Error(`${key} components must be numbers`);
        }
      });
    }
  });
};

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

async function validateAssetParametersAt(parameters, name) {
  try {
    switch (name) {
      case 'stateData':
        validateStateData(parameters);
        break;
      case 'integratorOptions':
        validateIntegratorOptions(parameters);
        break;
      case 'integratorParameters':
        validateIntegratorParameters(parameters);
        break;
      default:
        await assetSchema.validateAt(name, parameters);
        break;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function validateAllScenarioParameters(parameters, setFormErrors, pythonSourceFiles) {
  setFormErrors((formErrors) => {
    const newFormErrors = { ...formErrors };
    Object.entries(parameters).forEach(async ([name, value]) => {
      if (name === 'pythonSrc') {
        try {
          if (value === '' || value === null || value === undefined) throw new Error('Python Source is required');

          const invalidSources = findInvalidPythonFiles(value, pythonSourceFiles);
          if (invalidSources.length > 0) throw new Error('Python source files for one or more system components not found in the selected directory.');

          // Remove error message from the name key of the object
          delete newFormErrors[name];
        } catch (error) {
          const { message } = error;
          newFormErrors[name] = message;
        }
       } else {
          try {
            await validateScenarioParametersAt(parameters, name);
            // Remove error message from the name key of the object
            delete newFormErrors[name];
          } catch (error) {
            const { message } = error;
            newFormErrors[name] = message;
          }
        }
    });
    return newFormErrors;
  });
}

export { validateScenarioParametersAt, validateTaskParametersAt, validateAllScenarioParameters, validateAssetParametersAt };