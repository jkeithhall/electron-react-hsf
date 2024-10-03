import { string, object, array } from 'yup';
import { noInjection, throwErrorIfMissingFields } from './validateScenario';
import { evaluatorTypeOptions } from '../components/Evaluator';
import { validatePythonFile } from './validatePythonFiles';

const evaluatorSchema = (componentList, pythonSrc) => object({
  type: string('Type must be a string')
    .min(1, 'Type must be at least 1 character')
    .required('Type is required')
    .oneOf(evaluatorTypeOptions),
  src: string('Source must be a string')
    .when('type', {
      is: 'scripted',
      then: () => string('Source must be a string')
        .min(1, 'Source must be at least 1 character')
        .required('Source is required')
        .test('valid-python-source', 'Source must be in the Python source directory listed in the scenario parameters.', function(value) {
          return validatePythonFile(pythonSrc, value);
        })
        .test('no-injection', 'Source contains invalid characters', noInjection),
    }),
  className: string('Class Name must be a string')
    .when('type', {
      is: 'scripted',
      then: () => string('Class Name must be a string'),
      otherwise: () => string('Class Name must be a string') // type is TargetValueEvaluator or default
        .min(1, 'Class Name must be at least 1 character')
        .required('Class Name is required')
        .matches(/^[a-zA-Z_][a-zA-Z0-9_]*$/, 'Class name must start with a letter or underscore and contain only letters, numbers, and underscores')
        .test('no-injection', 'Class Name contains invalid characters', noInjection),
    }),
  keyRequests: array('Key Requests must be an array')
    .of(object({
      asset: string('Asset must be a string')
        .min(1, 'Asset must be at least 1 character')
        .required('Asset is required')
        .test('no-injection', 'Asset contains invalid characters', noInjection)
        .test('asset-exists', 'Asset does not exist', value => {
          return componentList.find((component) => component.id === value) !== undefined;
        }),
      subsystem: string('Subsystem must be a string')
        .min(1, 'Subsystem must be at least 1 character')
        .required('Subsystem is required')
        .test('no-injection', 'Subsystem contains invalid characters', noInjection)
        .test('subsystem-exists', 'Subsystem does not exist', (value, { parent: keyRequest }) => {
          const { asset } = keyRequest;
          return componentList.find((component) => component.id === value && component.parent === asset) !== undefined;
        }),
      type: string('Type must be a string')
        .min(1, 'Type must be at least 1 character')
        .required('Type is required')
        .oneOf(['int', 'double', 'float']),
    })),
});

function validateEvaluator(evaluator, setFormErrors, componentList, pythonSrc, throwable = false) {
  let importError = null;
  setFormErrors((formErrors) => {
    try {
      const newFormErrors = { ...formErrors };

      Object.entries(evaluator).forEach(([name, value]) => {
        if (name === 'keyRequests') {
          value.forEach((keyRequest, index) => {
            try {
              // validateEvaluatorAt(keyRequest, `keyRequests[${index}]`, componentList, pythonSrc);
              evaluatorSchema(componentList, pythonSrc).validateSyncAt(`keyRequests[${index}]`, evaluator);
              // Remove error message from the name key of the object
              delete newFormErrors[`keyRequests[${index}]`];

            } catch (error) {
              console.log(error);
              const { message } = error;

              if (throwable) throwErrorIfMissingFields(message);
              newFormErrors[`keyRequests[${index}]`] = message;
            }
          });
        } else {
          try {
            evaluatorSchema(componentList, pythonSrc).validateSyncAt(name, evaluator);
            // Remove error message from the name key of the object
            delete newFormErrors[name];

          } catch (error) {
            console.log(error);
            const { message } = error;

            // Throw error during import if the missing field is required
            if (throwable) throwErrorIfMissingFields(message);
            newFormErrors[name] = message;
          }
        }
      });
      return newFormErrors;
    } catch (thrownImportError) {
      importError = thrownImportError;
      return formErrors;
    }
  });

  if (importError) throw importError;
}

export { validateEvaluator };