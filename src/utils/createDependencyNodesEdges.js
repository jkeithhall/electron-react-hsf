import { randomId } from '@mui/x-data-grid-generator';

const nodeSize = 50;
const gap = 5;

const createDependencyNodesEdges = function(componentList, dependencyList) {
  let initialDependencyNodes = [];
  const assetNames = {};
  componentList.forEach((component) => {
    if (!component.parent) {
      assetNames[component.id] = component.name;
    }
  });

  if (!componentList || !dependencyList) return { initialDependencyNodes };

  componentList.forEach((fromComponent, i) => {
    if (fromComponent.parent) {
      const fromName = fromComponent.name;
      const fromClassName = fromComponent.className;
      componentList.forEach((toComponent, j) => {
        if (toComponent.parent) {
          const toName = toComponent.name;
          const toClassName = toComponent.className;
          const toolTipLabel = `${fromName} (${assetNames[fromComponent.parent]}) → ${toName} (${assetNames[toComponent.parent]})`;
          const node = {
            id: randomId(),
            type: 'dependency',
            data: {
              toolTipLabel,
              fromComponentId: fromComponent.id,
              toComponentId: toComponent.id,
              fromName,
              fromClassName,
              toName,
              toClassName,
              fromAsset: assetNames[fromComponent.parent],
              toAsset: assetNames[toComponent.parent],
            },
            position: { x: (nodeSize + gap) * i, y: (nodeSize + gap) * j },
            style: { width: nodeSize, height: nodeSize },
          }
          if (fromComponent.id === toComponent.id) {
            node.style.backgroundColor = '#444444';
            node.data.status = 'inapplicable';
          } else {
            const dependency = dependencyList.find((dependency) =>
              dependency.depSubsystem === fromComponent.id && dependency.subsystem === toComponent.id
            );
            if (dependency) {
              node.data.dependencyId = dependency.id;
              node.data.status = 'dependent';
              node.data.fcnName = null ?? dependency.fcnName;
              node.style.backgroundColor = '#4caf50';
            } else {
              node.data.status = 'independent';
              node.data.fcnName = null;
              node.style.backgroundColor = '#888888';
            }
          }
          initialDependencyNodes.push(node);
        }
      });
    }
  });

  return { initialDependencyNodes };
}

export default createDependencyNodesEdges ;