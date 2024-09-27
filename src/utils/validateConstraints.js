import { string, number, object } from 'yup';
import { noInjection, throwErrorIfMissingFields } from './validateScenario';
import { constraintTypeOptions } from '../components/PaletteComponents/Constraints';

// Constraints schema
const constraintSchema = (componentList) => object({
  name: string("Constraint Name must be a string")
    .min(1, 'Constraint Name must be at least 1 character')
    .required('Constraint Name is required')
    .test('no-injection', 'Constraint Name contains invalid characters', noInjection),
  subsystem: string("Subsystem must be a string")
    .min(1, 'Subsystem must be at least 1 character')
    .required('Subsystem is required')
    .test('no-injection', 'Subsystem contains invalid characters', noInjection)
    .test('subsystem-exists', 'Subsystem does not exist', function(value) {
      return componentList.find((component) => component.id === value) !== undefined;
    }),
  stateKey: string("State Key must be a string")
    .min(1, 'State Key must be at least 1 character')
    .required('State Key is required')
    .test('no-injection', 'State Key contains invalid characters', noInjection)
    .test('state-key-exists', 'State Key does not exist', function(value) {
      const { subsystem } = this.parent;
      const component = componentList.find((component) => component.id === subsystem);
      return component && component.states.find((state) => state.key === value) !== undefined;
    }),
  type: string("Constraint Type must be a string")
    .min(1, 'Constraint Type must be at least 1 character')
    .required('Constraint type is required')
    .oneOf(constraintTypeOptions)
    .test('no-injection', 'Constraint Type contains invalid characters', noInjection),
  stateType: string("State Type must be a string")
    .min(1, 'State Type must be at least 1 character')
    .required('State Type is required')
    .oneOf(['int', 'double'])
    .test('no-injection', 'State Type contains invalid characters', noInjection),
  value: number("Value must be a number")
    .required('Value is required')
    .typeError('Value must be a number')
});

function validateConstraintAt(constraint, name, setFormErrors, componentList, throwable = false) {
  if (name === 'id') return; // Skip id
  let importError = null;

  setFormErrors((formErrors) => {
    try {
      const newFormErrors = { ...formErrors };
      const currErrors = newFormErrors[constraint.id] || {};

      try {
        constraintSchema(componentList).validateSyncAt(name, constraint);
        // Remove error message from the name key of the object
        delete currErrors[name];

      } catch (error) {
        console.log(error);
        const { message } = error;

        // Throw error during import if the missing field is required
        if (throwable) throwErrorIfMissingFields(message);
        currErrors[name] = message;
      }

      if (Object.keys(currErrors).length > 0) {
        newFormErrors[constraint.id] = currErrors;
      } else {
        delete newFormErrors[constraint.id];
      }
      console.log(newFormErrors);
      return newFormErrors;
    } catch (thrownImportError) {
      importError = thrownImportError;
      return formErrors;
    }
  });

  if (importError) throw importError;
}

function validateConstraint(constraint, setFormErrors, componentList, throwable = false) {
  let importError = null;

  setFormErrors((formErrors) => {
    try {
      const newFormErrors = { ...formErrors };
      const currErrors = newFormErrors[constraint.id] || {};

      Object.entries(constraint).forEach(([name, value]) => {
        if (name === 'id') return; // Skip id

        try {
          constraintSchema(componentList).validateSyncAt(name, constraint);
          // Remove error message from the name key of the object
          delete currErrors[name];

        } catch (error) {
          console.log(error);
          const { message } = error;

          // Throw error during import if the missing field is required
          if (throwable) throwErrorIfMissingFields(message);
          currErrors[name] = message;
        }
      });

      if (Object.keys(currErrors).length > 0) {
        newFormErrors[constraint.id] = currErrors;
      } else {
        delete newFormErrors[constraint.id];
      }
      return newFormErrors;
    } catch (thrownImportError) {
      importError = thrownImportError;
      return formErrors;
    }
  });

  if (importError) throw importError;
}

// Validate each constraint and update formErrors if there are errors or throw an error if a required field is missing
function validateAllConstraints(constraints, setFormErrors, componentList, throwable = false) {
  let importError = null;

  setFormErrors((formErrors) => {
    try {
      const newFormErrors = { ...formErrors };
      constraints.forEach(constraint => {
        const currErrors = newFormErrors[constraint.id] || {};

        Object.entries(constraint).forEach(([name, value]) => {
          if (name === 'id') return; // Skip id

          try {
            constraintSchema(componentList).validateSyncAt(name, constraint);
            // Remove error message from the name key of the object
            delete currErrors[name];

          } catch (error) {
            console.log(error);
            const { message } = error;

            // Throw error during import if the missing field is required
            if (throwable) throwErrorIfMissingFields(message);
            currErrors[name] = message;
          }
        });

        if (Object.keys(currErrors).length > 0) {
          newFormErrors[constraint.id] = currErrors;
        } else {
          delete newFormErrors[constraint.id];
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

export { validateConstraintAt, validateConstraint, validateAllConstraints };