import { string, object } from 'yup';
import { noInjection } from './validateScenario';

const dependencySchema = (componentList) => object({
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
    .test('subsystem-exists', 'Subsystem does not exist', (value, { parent: dependency }) => {
      const { asset } = dependency;
      return componentList.find((component) => component.id === value && component.parent === asset) !== undefined;
    }),
  depAsset: string('Asset must be a string')
    .min(1, 'Asset must be at least 1 character')
    .required('Asset is required')
    .test('no-injection', 'Asset contains invalid characters', noInjection)
    .test('asset-exists', 'Asset does not exist', value => {
      return componentList.find((component) => component.id === value) !== undefined;
    }),
  depSubsystem: string('Subsystem must be a string')
    .min(1, 'Subsystem must be at least 1 character')
    .required('Subsystem is required')
    .test('no-injection', 'Subsystem contains invalid characters', noInjection)
    .test('subsystem-exists', 'Subsystem does not exist', (value, { parent: dependency }) => {
      const { depAsset } = dependency;
      return componentList.find((component) => component.id === value && component.parent === depAsset) !== undefined;
    }),
  fcnName: string('Function Name must be a string')
    .optional()
    .test('no-injection', 'Function Name contains invalid characters', noInjection)
});

// Currently all errors are thrown during import
function validateDependency(dependency, setFormErrors, componentList, throwable = false) {
  let importError = null;

  setFormErrors((formErrors) => {
    try {
      const newFormErrors = { ...formErrors };
      const currErrors = newFormErrors[dependency.id] || {};

      Object.entries(dependency).forEach(([name, value]) => {
        if (name === 'id') return; // Skip id

        try {
          dependencySchema(componentList).validateSyncAt(name, dependency);
          // Remove error message from the name key of the object
          delete currErrors[name];

        } catch (error) {
          console.log(error);
          const { message } = error;

          // Throw error if the missing fields are required
          if (throwable) throw new Error(message);
          currErrors[name] = message;
        }
      });

      if (Object.keys(currErrors).length > 0) {
        newFormErrors[dependency.id] = currErrors;
      } else {
        delete newFormErrors[dependency.id];
      }
      return newFormErrors;
    } catch (thrownImportError) {
      importError = thrownImportError;
    }
  });

  if (importError) throw importError;
}

// Currently all errors are thrown during import
function validateAllDependencies(dependencies, setFormErrors, componentList, throwable = false) {
  let importError = null;

  setFormErrors((formErrors) => {
    try {
      const newFormErrors = { ...formErrors };
      dependencies.forEach((dependency, index) => {
        const currErrors = newFormErrors[dependency.id] || {};

        Object.entries(dependency).forEach(([name, value]) => {
          if (name === 'id') return; // Skip id

          try {
            dependencySchema(componentList).validateSyncAt(name, dependency);
            // Remove error message from the name key of the object
            delete currErrors[name];

          } catch (error) {
            console.log(error);
            const { message } = error;

            // Throw error if the missing fields are required
            if (throwable) throw new Error(message);
            currErrors[name] = message;
          }
        });

        if (Object.keys(currErrors).length > 0) {
          newFormErrors[dependency.id] = currErrors;
        } else {
          delete newFormErrors[dependency.id];
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

export { validateDependency, validateAllDependencies };