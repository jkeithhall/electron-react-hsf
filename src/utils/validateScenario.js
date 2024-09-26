import { string, number, object } from 'yup';
import { findInvalidPythonFiles } from './validatePythonFiles';

// Custom method to check for dirty inputs/injections
function noInjection(value) {
  const injectionPattern = /[;`&|<>]/;
  return !injectionPattern.test(value);
};

// Throws error rather than allowing for formErrors to be set for certain errors during import
function throwErrorIfMissingFields(errorMessage) {
  if (errorMessage.includes('is required')) {
    throw new Error(errorMessage);
  }
}

// Scenario schema
const scenarioSchema = (pythonSourceFiles) => object({
  name: string('Simulation name must be a string')
    // Min test should be before required test so that the required test is not triggered if the string is empty
    // (required test will throw import error rather than allowing formErrors to be set)
    .min(1, 'Simulation name must be at least 1 character')
    .required('Simulation name is required')
    .test('no-injection', 'Simulation name contains invalid characters', noInjection),
  pythonSrc: string('Python Source must be a string')
    .min(1, 'Python Source must be at least 1 character')
    .required('Python Source is required')
    .test('no-injection', 'Python Source contains invalid characters', noInjection)
    .test('valid-component-sources', 'Python source files for one or more system components not found in the selected directory.', function (value) {
      const invalidFiles = findInvalidPythonFiles(value, pythonSourceFiles);
      return invalidFiles.length === 0;
    }),
  outputPath: string('Output Path must be a string')
    .min(1, 'Output Path must be at least 1 character')
    .required('Output Path is required')
    .test('no-injection', 'Output Path contains invalid characters', noInjection),
  version: number('Version must be a number').required('Version is required').min(0, 'Version must be greater than or equal to 0'),
  startJD: number('Start JD must be a number').required('Start JD is required'),
  startSeconds: number('Start Seconds must be a number')
    .required('Start Seconds is required')
    .min(0, 'Start Seconds must be greater than or equal to 0')
    .test('is-less-than-endSeconds', 'Start Seconds must be less than End Seconds', function(value) {
      const { endSeconds } = this.parent;
      return endSeconds === undefined || value < endSeconds;
    }),
  endSeconds: number('End Seconds must be a number')
    .required('End Seconds is required')
    .min(0, 'End Seconds must be greater than or equal to 0')
    .test('is-greater-than-startSeconds', 'End Seconds must be greater than Start Seconds', function(value) {
      const { startSeconds } = this.parent;
      return startSeconds === undefined || value > startSeconds;
    }),
  stepSeconds: number('Step Seconds must be a number').required('Step Seconds is required').min(0, 'Step Seconds must be greater than 0'),
  maxSchedules: number('Max Schedules must be a number').required('Max Seconds is required').min(1, 'Max Schedules must be greater than 0'),
  cropTo: number('Crop To must be a number').required('Crop To is required').min(1, 'Crop To must be greater than 0'),
});

function validateScenarioAt(parameters, name, setFormErrors, pythonSourceFiles, throwable = false) {
  setFormErrors((formErrors) => {
    const newFormErrors = { ...formErrors };

    try {
      scenarioSchema(pythonSourceFiles).validateSyncAt(name, parameters);
      // Remove error message from the name key of the object
      delete newFormErrors[name];

    } catch (error) {
      console.log(error);
      const { message } = error;

      // Throw error during import if the missing field is required
      if (throwable) throwErrorIfMissingFields(message);
      newFormErrors[name] = message;
    }
    return newFormErrors;
  });
}

// Validate each parameter and update formErrors if there are errors or throw an error if a required field is missing
function validateScenario(parameters, setFormErrors, pythonSourceFiles, throwable = false) {
  setFormErrors((formErrors) => {
    const newFormErrors = { ...formErrors };
    Object.entries(parameters).forEach(([name, value]) => {
      try {
        // validateScenarioParametersAt(parameters, name, pythonSourceFiles);
        scenarioSchema(pythonSourceFiles).validateSyncAt(name, parameters);
        // Remove error message from the name key of the object
        delete newFormErrors[name];
      } catch (error) {
        console.log(error);
        const { message } = error;

        // Throw error during import if the missing field is required
        if (throwable) throwErrorIfMissingFields(message);
        newFormErrors[name] = message;
      }
    });
    return newFormErrors;
  });
}

export { noInjection, throwErrorIfMissingFields, validateScenarioAt, validateScenario };