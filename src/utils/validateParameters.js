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

// Returns an error message if the state data components are not numbers
const validateStateData = (parameters) => {
  const { stateData } = parameters;
  const nonNumberComponents = [];
  stateData.forEach((component, index) => {
    if (Number(component) !== parseFloat(component)) {
      nonNumberComponents.push(index);
    }
  });
  if (nonNumberComponents.length > 1) {
    return `State Data components ${nonNumberComponents.join(', ')} are not numbers`;
  } else if (nonNumberComponents.length === 1) {
    return `State Data component ${nonNumberComponents[0]} is not a number`;
  } else {
    return null;
  }
};

const validateIntegratorOption = (key, value) => {
  if (Number(value) !== parseFloat(value)) {
    return `${key} must be a number`;
  } else {
    return null;
  }
};

const validateIntegratorParameter = (parameter) => {
  console.log(`Validating integrator parameter: ${JSON.stringify(parameter)}`)
  const { key, value, type } = parameter;
  switch (type) {
    case 'int':
      if (!Number.isInteger(parseFloat(value))) {
        return `${key} must be an integer`;
      }
      break;
    case 'double':
      if (Number(value) !== parseFloat(value)) {
        return `${key} must be a number`;
      }
      break;
    default: // vector
      const nonNumberComponents = [];
      value.forEach((component, index) => {
        if (Number(component) !== parseFloat(component)) {
          nonNumberComponents.push(index);
        }
      });
      if (nonNumberComponents.length > 1) {
        return `${key} components ${nonNumberComponents.join(', ')} are not numbers`;
      } else if (nonNumberComponents.length === 1) {
        return `${key} component ${nonNumberComponents[0]} is not a number`;
      }
  }
  return null;
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

function validateAssetParameter(name, value, setModelErrors, id) {
  setModelErrors((modelErrors) => {
    const currentNodeErrors = modelErrors[id] ? modelErrors[id] : {};
    const newModelErrors = { ...modelErrors };
    switch (name) {
      case 'name':
        if (value === '' || value === null || value === undefined) {
          return 'Name is required';
        } else {
          return null;
        }
      case 'stateData':
        return validateStateData({ stateData: value });
      case 'integratorOptions':
        const { integratorOptions } = value;
        Object.entries(integratorOptions).forEach(([key, value]) => {
          return validateIntegratorOption(key, value);
        });
        break;
      case 'integratorParameters':
        const { integratorParameters } = value;
        integratorParameters.forEach((parameter) => {
          const errorMessage = validateIntegratorParameter(parameter);
          if (errorMessage) {
            currentNodeErrors[parameter.key] = errorMessage;
          } else {
            delete currentNodeErrors[parameter.key];
          }
        });
        break;
      default:
        break;
    }
  });
}

function validateAllAssetParameters(parameters, setModelErrors) {
  const { id } = parameters;
  setModelErrors((modelErrors) => {
    const currentNodeErrors = modelErrors[id] ? modelErrors[id] : {};
    const newModelErrors = { ...modelErrors };
    Object.entries(parameters).forEach(([name, value]) => {
      switch (name) {
        case 'name':
          if (value === '' || value === null || value === undefined) {
            currentNodeErrors[name] = 'Name is required';
          } else {
            delete currentNodeErrors[name];
          }
          break;
        case 'stateData':
          const errorMessage = validateStateData(parameters);
          if (errorMessage) {
            currentNodeErrors[name] = errorMessage;
          } else {
            delete currentNodeErrors[name];
          }
          break;
        case 'integratorOptions':
          const { integratorOptions } = parameters;
          Object.entries(integratorOptions).forEach(([key, value]) => {
            const errorMessage = validateIntegratorOption(key, value);
            if (errorMessage) {
              currentNodeErrors[key] = errorMessage;
            } else {
              delete currentNodeErrors[key];
            }
          });
          break;
        case 'integratorParameters':
          const { integratorParameters } = parameters;
          integratorParameters.forEach((parameter) => {
            const errorMessage = validateIntegratorParameter(parameter);
            if (errorMessage) {
              currentNodeErrors[parameter.key] = errorMessage;
            } else {
              delete currentNodeErrors[parameter.key];
            }
          });
          break;
        default:
          break;
      }
    });
    console.log('Current node errors:', currentNodeErrors);
    if (Object.keys(currentNodeErrors).length > 0) {
      newModelErrors[id] = { ...currentNodeErrors };
    } else {
      delete newModelErrors[id];
    }
    return newModelErrors;
  });

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

export { validateScenarioParametersAt, validateTaskParametersAt, validateAllScenarioParameters, validateAssetParameter, validateAllAssetParameters };