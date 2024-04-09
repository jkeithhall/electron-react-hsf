import getLayoutedElements from './getLayoutedElements';

const assetColors = [
  'rgba(2, 136, 209, 0.4)',
  'rgb(2,209,75, 0.4)',
  'rgb(209,2,136, 0.4)',
  'rgb(209,75,2, 0.4)',
];

const assetHeight = 400;
const assetWidth = 500;

// Somewhat hacky function to initialize nodes and edges for the graph
// TO DO: Refactor this function to be more robust to changes in the data structure
const createNodesEdges = function(componentList, dependencyList) {
  let nodes = [];
  let edges = [];
  let assetCount = 0;
  const subsystemCount = {};

  if (!componentList || !dependencyList) return { initialNodes: nodes, initialEdges: edges };

  componentList.forEach((component, i) => {

    const node = {
      id: component.id,
      data: { label: component.name, data: component },
    }
    if (component.className === 'asset') {
      node.position = { x: assetCount * (assetWidth + 50), y: 0 };
      node.style = { backgroundColor: assetColors[assetCount], width: assetWidth, height: assetHeight };
      assetCount++;
      subsystemCount[component.id] = 0;
    } else {
      const subsystemNum = subsystemCount[component.parent];
      // node.position = component.name === 'Power' ? { x: 0, y: -100 * subsystemNum + assetSize } : { x: 90 * subsystemNum, y: -90 * subsystemNum + (assetSize - 40) };
      node.position = { x: 87 * subsystemNum, y: -90 * subsystemNum + (assetHeight - 40) };
      node.extent = 'parent';
      node.parentNode = component.parent;
      subsystemCount[component.parent]++;
    };

    nodes.push(node);
  });

  dependencyList.forEach((dependency) => {
    edges.push({
      id: dependency.id,
      source: dependency.subsystem,
      target: dependency.depSubsystem,
      data: dependency.fcnName,
      type: 'smoothstep',
    });
  });

  // const { nodes: initialNodes, edges: initialEdges } = getLayoutedElements(nodes, edges, { direction: 'TB' });
  // return { initialNodes, initialEdges };
  return { initialNodes: nodes, initialEdges: edges };
}

export default createNodesEdges;