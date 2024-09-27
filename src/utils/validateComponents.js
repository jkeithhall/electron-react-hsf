import { string, number, object, array, mixed } from 'yup';
import { noInjection, throwErrorIfMissingFields } from './validateScenario';
import { dynStateTypeOptions } from '../components/PaletteComponents/DynamicStateType';
import { eomsOptions } from '../components/PaletteComponents/EomsType';
import { validatePythonFile } from './validatePythonFiles';

// Returns a custom error message if the vector components are not numbers
function vectorError(vector, name) {
  const nonNumberComponents = [];
  if (!Array.isArray(vector)) {
    return `${name} must be an array`;
  }
  vector.forEach((component, index) => {
    if (Number(component) !== parseFloat(component)) {
      nonNumberComponents.push(index);
    }
  });
  if (nonNumberComponents.length > 1) {
    return `${name} components ${nonNumberComponents.join(', ')} are not numbers`;
  } else if (nonNumberComponents.length === 1) {
    return `${name} component ${nonNumberComponents[0]} is not a number`;
  } else {
    return null;
  }
};

// Returns a custom error message if the state or parameter value is not the correct type
function parameterValueError(value, type, key, createError) {
  let error;
  switch (type) {
    case 'Matrix':
    case 'vector':
      if (!Array.isArray(value)) {
        return createError({ message: `${key} must be an array` });
      }
      error = vectorError(value, key);
      break;
    case 'double':
      error = Number(value) !== parseFloat(value) ? `${key} must be a number` : null;
      break;
    case 'int':
      error = Number(value) !== parseInt(value) ? `${key} must be an integer` : null;
      break;
    case 'bool':
      error = typeof value !== 'boolean' ? `${key} must be a boolean` : null;
      break;
    default:
      error = null;
  }
  return error ? createError({ message: error }) : true;
}

const assetSchema = object({
  name: string("Asset Name must be a string")
    // Min test should be before required test so that the required test is not triggered if the string is empty
    // (required test will throw import error rather than allowing formErrors to be set)
    .min(1, 'Asset Name must be at least 1 character')
    .required('Asset Name is required')
    .test('no-injection', 'Asset Name contains invalid characters', noInjection),
  dynamicStateType: string("Dynamic State Type must be a string")
    .uppercase()
    .min(1, 'Dynamic State Type must be at least 1 character')
    .required('Dynamic State Type is required')
    .oneOf(dynStateTypeOptions)
    .test('no-injection', 'Dynamic State Type contains invalid characters', noInjection),
  eomsType: string("EOMS Type must be a string")
    .min(1, 'EOMS Type must be at least 1 character')
    .required('EOMS Type is required')
    .oneOf(eomsOptions)
    .test('no-injection', 'EOMS Type contains invalid characters', noInjection),
  stateData: array("State Data must be an array")
    .of(number("State Data components must be numbers").typeError('State Data components must be numbers'))
    .required('State Data is required')
    .test('state-data', ({value}) => vectorError(value, "State Data"), (value) => vectorError(value, "State Data") === null),
  integratorOptions: object({
      h: number("h must be a number").required('h is required').typeError('h must be a number'),
      rtol: number("rtol must be a number").required('rtol is required').typeError('rtol must be a number'),
      atol: number("atol must be a number").required('atol is required').typeError('atol must be a number'),
      eps: number("eps must be a number").required('eps is required').typeError('eps must be a number'),
      nSteps: number("nSteps must be a number").required('nSteps is required').typeError('nSteps must be a number'),
    }).required('Integrator Options are required'),
  integratorParameters: array("Integrator Parameters must be an array")
    .of(object({
      key: string("Key must be a string")
        .min(1, 'Key must be at least 1 character')
        .required('Key is required')
        .test('no-injection', 'Key contains invalid characters', noInjection),
      type: string("Type must be a string")
        .min(1, 'Type must be at least 1 character')
        .required('Type is required')
        .oneOf(['int', 'double', 'bool', 'vector', 'Matrix'])
        .test('no-injection', 'Type contains invalid characters', noInjection),
      value: mixed()
        .required('Value is required')
        .test({
          name: 'value-test',
          test: function(value, { parent, createError }) {
            const { type, key } = parent;
            return parameterValueError(value, type, key, createError);
          }
        })
      })
  ).required('Integrator Parameters are required')
});

const subsystemSchema = (componentList, pythonSrc) => object({
  name: string('Subsystem Name must be a string')
    .min(1, 'Subsystem Name must be at least 1 character')
    .required('Subsystem Name is required')
    .test('no-injection', 'Subsystem Name contains invalid characters', noInjection),
  parent: string('Parent must be a string')
    .min(1, 'Parent must be at least 1 character')
    .required('Parent is required')
    .test('no-injection', 'Parent contains invalid characters', noInjection)
    .test('parent-exists', 'Parent does not exist', value => {
      return componentList.find((component) => component.id === value) !== undefined;
    }),
  type: string('Subsystem Type must be a string')
    .min(1, 'Subsystem Type must be at least 1 character')
    .required('Subsystem Type is required')
    .oneOf(['scripted', 'unscripted'])
    .test('no-injection', 'Subsystem Type contains invalid characters', noInjection),
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
      is: 'unscripted',
      then: () => string('Class Name must be a string')
        .min(1, 'Class Name must be at least 1 character')
        .required('Class Name is required')
        .matches(/^[a-zA-Z_][a-zA-Z0-9_]*$/, 'Class name must start with a letter or underscore and contain only letters, numbers, and underscores')
        .test('no-injection', 'Class Name contains invalid characters', noInjection),
    }),
  parameters: array('Parameters must be an array')
    .of(object({
      name: string('Name must be a string')
        .min(1, 'Name must be at least 1 character')
        .required('Name is required')
        .test('no-injection', 'Name contains invalid characters', noInjection),
      type: string('Type must be a string')
        .min(1, 'Type must be at least 1 character')
        .required('Type is required')
        .oneOf(['int', 'double', 'bool', 'vector'])
        .test('no-injection', 'Type contains invalid characters', noInjection),
      value: mixed()
        .required('Value is required')
        .test({
          name: 'value-test',
          test: function(value, { parent, createError }) {
            const { type, name } = parent;
            return parameterValueError(value, type, name, createError);
          }
        })
    })),
  states: array('States must be an array')
    .of(object({
      name: string('Name must be a string')
        .min(1, 'Name must be at least 1 character')
        .required('Name is required')
        .test('no-injection', 'Name contains invalid characters', noInjection),
      key: string('Key must be a string')
        .min(1, 'Key must be at least 1 character')
        .required('Key is required')
        .test('no-injection', 'Key contains invalid characters', noInjection),
      type: string('Type must be a string')
        .min(1, 'Type must be at least 1 character')
        .required('Type is required')
        .oneOf(['int', 'double', 'bool', 'vector', 'Matrix'])
        .test('no-injection', 'Type contains invalid characters', noInjection),
      value: mixed()
        .required('Value is required')
        .test({
          name: 'value-test',
          test: function(value, { parent, createError }) {
            const { type, key } = parent;
            return parameterValueError(value, type, key, createError);
          }
        })
    }))
});

function validateComponentAt(component, name, setFormErrors, componentList, pythonSrc, throwable = false) {
  if (name === 'id') return; // Skip id
  setFormErrors((formErrors) => {
    const newFormErrors = { ...formErrors };
    const currErrors = newFormErrors[component.id] || {};

    switch (name) {
      case 'integratorOptions':
        Object.entries(component.integratorOptions).forEach(([key, value]) => {
          try {
            assetSchema.validateSyncAt(`integratorOptions.${key}`, component);
            // Remove error message from the name key of the object
            delete currErrors[`integratorOptions.${key}`];

          } catch (error) {
            console.log(error);
            const { message } = error;
            if (throwable) throwErrorIfMissingFields(message);

            currErrors[`integratorOptions.${key}`] = message;
          }
        });
        break;
      case 'integratorParameters':
        component.integratorParameters.forEach((parameter, index) => {
          try {
            assetSchema.validateSyncAt(`integratorParameters[${index}]`, component);
            // Remove error message from the name key of the object
            delete currErrors[`integratorParameters[${index}]`];

          } catch (error) {
            console.log(error);
            const { message } = error;
            if (throwable) throwErrorIfMissingFields(message);

            currErrors[`integratorParameters[${index}]`] = message;
          }
        });
        break;
      case 'parameters':
        component.parameters.forEach((parameter, index) => {
          try {
            subsystemSchema(componentList, pythonSrc).validateSyncAt(`parameters[${index}]`, component);
            // Remove error message from the name key of the object
            delete currErrors[`parameters[${index}]`];

          } catch (error) {
            console.log(error);
            const { message } = error;
            if (throwable) throwErrorIfMissingFields(message);

            currErrors[`parameters[${index}]`] = message;
          }
        });
        break;
      case 'states':
        component.states.forEach((state, index) => {
          try {
            subsystemSchema(componentList, pythonSrc).validateSyncAt(`states[${index}]`, component);
            // Remove error message from the name key of the object
            delete currErrors[`states[${index}]`];

          } catch (error) {
            console.log(error);
            const { message } = error;
            if (throwable) throwErrorIfMissingFields(message);

            currErrors[`states[${index}]`] = message;
          }
        });
        break;
      default:
        try {
          if (component.parent === undefined) { // Asset
            assetSchema.validateSyncAt(name, component);
          } else { // Subsystem
            subsystemSchema(componentList, pythonSrc).validateSyncAt(name, component);
          }
          // Remove error message from the name key of the object
          delete currErrors[name];

        } catch (error) {
          console.log(error);
          const { message } = error;
          if (throwable) throwErrorIfMissingFields(message);

          currErrors[name] = message;
        }
    }

    if (Object.keys(currErrors).length > 0) {
      newFormErrors[component.id] = currErrors;
    } else {
      delete newFormErrors[component.id];
    }
    return newFormErrors;
  });
}

function validateComponent(component, setFormErrors, componentList, pythonSrc, throwable = false) {
  setFormErrors((formErrors) => {
    const newFormErrors = { ...formErrors };
    const currErrors = newFormErrors[component.id] || {};

    Object.entries(component).forEach(([name, value]) => {
      switch (name) {
        case 'id':
          break; // Skip id
        case 'integratorOptions':
          Object.entries(value).forEach(([key, value]) => {
            try {
              assetSchema.validateSyncAt(`integratorOptions.${key}`, component);
              // Remove error message from the name key of the object
              delete currErrors[`integratorOptions.${key}`];

            } catch (error) {
              console.log(error);
              const { message } = error;
              if (throwable) throwErrorIfMissingFields(message);

              currErrors[`integratorOptions.${key}`] = message;
            }
          });
          break;
        case 'integratorParameters':
          value.forEach((parameter, index) => {
            try {
              assetSchema.validateSyncAt(`integratorParameters[${index}]`, component);
              // Remove error message from the name key of the object
              delete currErrors[`integratorParameters[${index}]`];

            } catch (error) {
              console.log(error);
              const { message } = error;
              if (throwable) throwErrorIfMissingFields(message);

              currErrors[`integratorParameters[${index}]`] = message;
            }
          });
          break;
        case 'parameters':
          value.forEach((parameter, index) => {
            try {
              subsystemSchema(componentList, pythonSrc).validateSyncAt(`parameters[${index}]`, component);
              // Remove error message from the name key of the object
              delete currErrors[`parameters[${index}]`];

            } catch (error) {
              console.log(error);
              const { message } = error;
              if (throwable) throwErrorIfMissingFields(message);

              currErrors[`parameters[${index}]`] = message;
            }
          });
          break;
        case 'states':
          value.forEach((state, index) => {
            try {
              subsystemSchema(componentList, pythonSrc).validateSyncAt(`states[${index}]`, component);
              // Remove error message from the name key of the object
              delete currErrors[`states[${index}]`];

            } catch (error) {
              console.log(error);
              const { message } = error;
              if (throwable) throwErrorIfMissingFields(message);

              currErrors[`states[${index}]`] = message;
            }
          });
          break;
        default:
          try {
            if (component.parent === undefined) { // Asset
              assetSchema.validateSyncAt(name, component);
            } else { // Subsystem
              subsystemSchema(componentList, pythonSrc).validateSyncAt(name, component);
            }
            // Remove error message from the name key of the object
            delete currErrors[name];

          } catch (error) {
            console.log(error);
            const { message } = error;
            if (throwable) throwErrorIfMissingFields(message);

            currErrors[name] = message;
          }
      }
    });

    if (Object.keys(currErrors).length > 0) {
      newFormErrors[component.id] = currErrors;
    } else {
      delete newFormErrors[component.id];
    }
    return newFormErrors;
  });
}

function validateAllComponents(componentList, setFormErrors, pythonSrc, throwable = false) {
  // Validate each component and update formErrors if there are errors
  setFormErrors((formErrors) => {
    const newFormErrors = { ...formErrors };
    componentList.forEach(component => {
      const currErrors = newFormErrors[component.id] || {};

      Object.entries(component).forEach(([name, value]) => {
        switch (name) {
          case 'id':
            break; // Skip id
          case 'integratorOptions':
            Object.entries(value).forEach(([key, value]) => {
              try {
                assetSchema.validateSyncAt(`integratorOptions.${key}`, component);
                // Remove error message from the name key of the object
                delete currErrors[`integratorOptions.${key}`];

              } catch (error) {
                console.log(error);
                const { message } = error;
                if (throwable) throwErrorIfMissingFields(message);

                currErrors[`integratorOptions.${key}`] = message;
              }
            });
            break;
          case 'integratorParameters':
            value.forEach((parameter, index) => {
              try {
                assetSchema.validateSyncAt(`integratorParameters[${index}]`, component);
                // Remove error message from the name key of the object
                delete currErrors[`integratorParameters[${index}]`];

              } catch (error) {
                console.log(error);
                const { message } = error;
                if (throwable) throwErrorIfMissingFields(message);

                currErrors[`integratorParameters[${index}]`] = message;
              }
            });
            break;
          case 'parameters':
            value.forEach((parameter, index) => {
              try {
                subsystemSchema(componentList, pythonSrc).validateSyncAt(`parameters[${index}]`, component);
                // Remove error message from the name key of the object
                delete currErrors[`parameters[${index}]`];

              } catch (error) {
                console.log(error);
                const { message } = error;
                if (throwable) throwErrorIfMissingFields(message);

                currErrors[`parameters[${index}]`] = message;
              }
            });
            break;
          case 'states':
            value.forEach((state, index) => {
              try {
                subsystemSchema(componentList, pythonSrc).validateSyncAt(`states[${index}]`, component);
                // Remove error message from the name key of the object
                delete currErrors[`states[${index}]`];

              } catch (error) {
                console.log(error);
                const { message } = error;
                if (throwable) throwErrorIfMissingFields(message);

                currErrors[`states[${index}]`] = message;
              }
            });
            break;
          default:
            try {
              if (component.parent === undefined) { // Asset
                assetSchema.validateSyncAt(name, component);
              } else { // Subsystem
                subsystemSchema(componentList, pythonSrc).validateSyncAt(name, component);
              }
              // Remove error message from the name key of the object
              delete currErrors[name];

            } catch (error) {
              console.log(error);
              const { message } = error;
              if (throwable) throwErrorIfMissingFields(message);

              currErrors[name] = message;
            }
        }
      });
      if (Object.keys(currErrors).length > 0) {
        newFormErrors[component.id] = currErrors;
      } else {
        delete newFormErrors[component.id];
      }
    });
    return newFormErrors;
  });
}

export { validateComponentAt, validateComponent, validateAllComponents };