import randomColor from 'randomcolor';
import { MarkerType } from 'reactflow';

const BASE_COLORS = [ 'blue', 'green', 'red', 'purple', 'orange', 'yellow', 'pink' ];

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
    if (!component.className) { // Asset
      node.position = { x: assetCount * (assetWidth + 50), y: 0 };
      const backgroundColor = randomColor({
        hue: BASE_COLORS[assetCount % BASE_COLORS.length],
        luminosity: 'light',
        format: 'rgba',
        alpha: 0.5,
     });
      node.style = { backgroundColor, width: assetWidth, height: assetHeight };
      assetCount++;
      subsystemCount[component.id] = 0;
    } else { // Subcomponent
      const subsystemNum = subsystemCount[component.parent];
      node.position = { x: 87 * subsystemNum, y: -90 * subsystemNum + (assetHeight - 40) };
      node.extent = 'parent';
      // parentNode has been renamed to parentId in in version 11.11.0 and will be removed in version 12
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
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 15,
        height: 15,
        color: '#000',
      },
      style: {
        strokeWidth: 2,
        stroke: '#000',
      },
    });
  });

  return { initialNodes: nodes, initialEdges: edges };
}

export default createNodesEdges;