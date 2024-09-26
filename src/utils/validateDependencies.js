import { string, object } from 'yup';
import { noInjection, throwErrorIfMissingFields } from './validateScenario';

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
    .min(1, 'Function Name must be at least 1 character')
    .test('no-injection', 'Function Name contains invalid characters', noInjection),
});

// Currently dependencies are validated only on import; no errors are set in state and all errors are thrown during import
function validateDependency(dependency, componentList) {
  Object.entries(dependency).forEach(([name, value]) => {
    dependencySchema(componentList).validateSyncAt(name, dependency);
  });
}

// Currently dependencies are validated only on import; no errors are set in state and all errors are thrown during import
function validateAllDependencies(dependencies, componentList) {
  dependencies.forEach(dependency => {
    validateDependency(dependency, componentList);
  });
}

export { validateDependency, validateAllDependencies };