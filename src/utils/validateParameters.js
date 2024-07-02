import { string, number, object } from 'yup';
import { validatePythonFile, findInvalidPythonFiles } from './validatePythonFiles';

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
  maxSchedules: number().required().min(1, 'Max Schedules must be greater than 0'),
  cropTo: number().required().min(1, 'Crop To must be greater than 0'),
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
const validateStateData = (stateData) => {
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

// Returns an error message if the integrator option is not a number
const validateIntegratorOption = (key, value) => {
  if (Number(value) !== parseFloat(value)) {
    return `${key} must be a number`;
  } else {
    return null;
  }
};

// Returns an error message if the integrator parameter is not a number
const validateParameter = (parameter, label) => {
  const { value, type } = parameter;
  let { key } = parameter;
  if (label === 'name') {
    const { name } = parameter;
    key = name;
  }
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
    case 'bool':
      if (value !== 'true' && value !== 'false' && value !== true && value !== false) {
        return `${key} must be true or false`;
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

const validateClassName = (className) => {
  if (!className.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
    return 'Class name must start with a letter or underscore and contain only letters, numbers, and underscores';
  } else {
    return null;
  }
}

const validateSrc = (src, pythonSrc) => {
  if (!validatePythonFile(pythonSrc, src)) {
    return 'Source File must be in the Python source directory listed in the scenario parameters.';
  } else {
    return null;
  }
}

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

// TO DO: Add validation for other fields (id, className, dynamicStateType, eomsType, type, parent)
function validateAssetParameters(assetParameters, setModelErrors, pythonSrc) {
  const { id } = assetParameters;
  setModelErrors((modelErrors) => {
    const currentNodeErrors = modelErrors[id] ? modelErrors[id] : {};
    const newModelErrors = { ...modelErrors };
    Object.entries(assetParameters).forEach(([name, value]) => {
      let errorMessage;
      switch (name) {
        case 'name':
          if (value === '' || value === null || value === undefined) {
            currentNodeErrors[name] = 'Name is required';
          } else {
            delete currentNodeErrors[name];
          }
          break;
        case 'stateData':
          errorMessage = validateStateData(value);
          if (errorMessage) {
            currentNodeErrors[name] = errorMessage;
          } else {
            delete currentNodeErrors[name];
          }
          break;
        case 'integratorOptions':
          Object.entries(value).forEach(([key, value]) => {
            const errorMessage = validateIntegratorOption(key, value);
            if (errorMessage) {
              currentNodeErrors[key] = errorMessage;
            } else {
              delete currentNodeErrors[key];
            }
          });
          break;
        case 'integratorParameters':
          value.forEach((parameter) => {
            const errorMessage = validateParameter(parameter, 'key');
            if (errorMessage) {
              currentNodeErrors[parameter.key] = errorMessage;
            } else {
              delete currentNodeErrors[parameter.key];
            }
          });
          break;
        case 'type':
          if (value === 'scripted') {
            const { src } = assetParameters;
            errorMessage = validateSrc(src, pythonSrc);
            if (errorMessage) {
              currentNodeErrors['src'] = errorMessage;
            } else {
              delete currentNodeErrors['src'];
            }
          } else {
            const { className } = assetParameters;
            errorMessage = validateClassName(className);
            if (errorMessage) {
              currentNodeErrors['className'] = errorMessage;
            } else {
              delete currentNodeErrors['className'];
            }
          }
          break;
        case 'states':
          value.forEach((state) => {
            const errorMessage = validateParameter(state, 'key');
            if (errorMessage) {
              currentNodeErrors[state.key] = errorMessage;
            } else {
              delete currentNodeErrors[state.key];
            }
          });
          break;
        case 'parameters':
          value.forEach((parameter) => {
            const errorMessage = validateParameter(parameter, 'name');
            if (errorMessage) {
              currentNodeErrors[parameter.name] = errorMessage;
            } else {
              delete currentNodeErrors[parameter.name];
            }
          });
          break;
        default:
          break;
      }
    });

    if (Object.keys(currentNodeErrors).length > 0) {
      newModelErrors[id] = { ...currentNodeErrors };
    } else {
      delete newModelErrors[id];
    }
    return newModelErrors;
  });

}

function validateEvaluator(evaluator, pythonDirectorySrc, setFormErrors) {
  setFormErrors((formErrors) => {
    const newFormErrors = { ...formErrors };
    Object.entries(evaluator).forEach(([name, value]) => {
      let errorMessage;
      switch (name) {
        case 'type':
          if (value === 'scripted') {
            const { src } = evaluator;
            errorMessage = validateSrc(src, pythonDirectorySrc);
            if (errorMessage) {
              newFormErrors['src'] = errorMessage;
            } else {
              delete newFormErrors['src'];
            }
          } else if (value === 'TargetValueEvaluator') {
            const { className } = evaluator;
            console.log({ className });
            errorMessage = validateClassName(className);
            console.log({ errorMessage });
            if (errorMessage) {
              newFormErrors['className'] = errorMessage;
            } else {
              delete newFormErrors['className'];
            }
          }
          break;
        case 'keyRequests':
          value.forEach((keyRequest, index) => {
            if (keyRequest === '') {
              newFormErrors[`keyRequests[${index}]`] = 'Key Request is required';
            } else {
              delete newFormErrors[`keyRequests[${index}]`];
            }
          });
          break;
        default:
          break;
      }
    });
    return newFormErrors;
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

export { validateScenarioParametersAt, validateTaskParametersAt, validateAllScenarioParameters, validateAssetParameters, validateEvaluator };