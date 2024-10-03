import { string, number, object, boolean } from 'yup';
import { noInjection } from './validateScenario';
import { assetType, subcomponentType, modelEdgeConfig } from './createModelNodesEdges';

function isValidRGBColor(string) {
  return /rgba?\((\d{1,3}), (\d{1,3}), (\d{1,3})(, \d?(\.\d{1,2})?)?\)/.test(string);
}

const assetNodeSchema = (componentList) => object({
  id: string('ID must be a string')
    .required('ID is required')
    .test('no-injection', 'ID contains invalid characters', noInjection),
  type: string('Type must be a string')
    .test('asset-type', 'Type must be an asset', (value) => value === assetType),
  position: object({
    x: number('X must be a number')
      .required('X is required')
      .typeError('X must be a number'),
    y: number('Y must be a number')
      .required('Y is required')
      .typeError('Y must be a number'),
  }),
  style: object({
    width: number('Width must be a number')
      .required('Width is required')
      .min(1, 'Width must be greater than or equal to 1')
      .typeError('Width must be a number'),
    height: number('Height must be a number')
      .required('Height is required')
      .min(1, 'Height must be greater than or equal to 1')
      .typeError('Height must be a number'),
  }),
  data: object({
    backgroundColor: string('Background Color must be a string')
      .required('Background Color is required')
      .test('valid-rgb-color', 'Background Color must be a valid RGB color', isValidRGBColor),
    label: string('Label must be a string')
      .required('Label is required')
      .test('no-injection', 'Label contains invalid characters', noInjection)
      .test('matching-name', 'Label must match the name', function(value) {
        const { data } = this.parent;
        return value === data.name;
      }),
    data: object()
      .test('deep-equal', 'Data must equal component in componentList', function(value) {
        const { id } = value;
        const component = componentList.find((component) => component.id === id && component.parent === undefined);
        return component && JSON.stringify(value) === JSON.stringify(component);
      }),
  }),
});

const subsystemNodeSchema = (modelNodes, componentList) => object({
  id: string('ID must be a string')
    .required('ID is required')
    .test('no-injection', 'ID contains invalid characters', noInjection),
  type: string('Type must be a string')
    .test('subcomponent-type', 'Type must be a subcomponent', (value) => value === subcomponentType),
  position: object({
    x: number('X must be a number')
      .required('X is required')
      .typeError('X must be a number'),
    y: number('Y must be a number')
      .required('Y is required')
      .typeError('Y must be a number'),
  }),
  style: object({
    width: number('Width must be a number')
      .required('Width is required')
      .min(1, 'Width must be greater than or equal to 1')
      .typeError('Width must be a number'),
    height: number('Height must be a number')
      .required('Height is required')
      .min(1, 'Height must be greater than or equal to 1')
      .typeError('Height must be a number'),
  }),
  extent: string('Extent must be a string')
    .required('Extent is required')
    .oneOf(['parent']),
  parentNode: string('Parent Node must be a string')
    .required('Parent Node is required')
    .test('parent-node-exists', 'Parent Node does not exist', function(value) {
      return modelNodes.find((node) => node.id === value && node.type === 'asset') !== undefined;
    }),
  data: object({
    label: string('Label must be a string')
      .required('Label is required')
      .test('no-injection', 'Label contains invalid characters', noInjection)
      .test('matching-name', 'Label must match the name', function(value) {
        const { data } = this.parent;
        return value === data.name;
      }),
    data: object()
      .test('deep-equal', 'Data must equal component in componentList', function(value) {
        const { id } = value;
        const component = componentList.find((component) => component.id === id && component.parent);
        return component && JSON.stringify(value) === JSON.stringify(component);
      }),
  })
});

// Validate all model nodes and throw error if any are invalid
function validateModelNodes(modelNodes, componentList) {
  modelNodes.forEach((node) => {
    try {
      if (node.type === assetType) {
        assetNodeSchema(componentList).validateSync(node);
      } else if (node.type === subcomponentType) {
        subsystemNodeSchema(modelNodes, componentList).validateSync(node);
      } else {
        throw new Error('Invalid node type');
      }
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  });
}

const edgeSchema = (modelNodes) => object({
  id: string('ID must be a string')
    .required('ID is required')
    .test('no-injection', 'ID contains invalid characters', noInjection),
  data: string('Data must be a string')
    .test('no-injection', 'Data contains invalid characters', noInjection),
  source: string('Source must be a string')
    .required('Source is required')
    .test('source-exists', 'Source does not exist', function(value) {
      return modelNodes.find((node) => node.id === value) !== undefined;
    }),
  target: string('Target must be a string')
    .required('Target is required')
    .test('target-exists', 'Target does not exist', function(value) {
      return modelNodes.find((node) => node.id === value) !== undefined;
    }),
  markerEnd: object()
    .test('valid-marker-end', 'Marker End must be a valid marker end', function(value) {
      return JSON.stringify(value) === JSON.stringify(modelEdgeConfig.markerEnd);
    }),
  selected: boolean('Selected must be a boolean'),
  style: object()
    .test('valid-style', 'Style must be a valid style', function(value) {
      return JSON.stringify(value) === JSON.stringify(modelEdgeConfig.style);
    }),
  type: string('Type must be a string')
    .test('valid-type', 'Type must be a valid type', function(value) {
      return value === modelEdgeConfig.type;
    }),
});

// Validate all model edges and throw error if any are invalid
function validateModelEdges(modelEdges, modelNodes) {
  modelEdges.forEach((edge) => {
    try {
      edgeSchema(modelNodes).validateSync(edge);
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  });
}

export { validateModelNodes, validateModelEdges };