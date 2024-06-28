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
      componentList.forEach((toComponent, j) => {
        if (toComponent.parent) {
          const node = {
            id: `${fromComponent.id}-${toComponent.id}`,
            type: 'dependency',
            data: {
              fromComponent,
              fromComponentId: fromComponent.id,
              fromAsset: assetNames[fromComponent.parent],
              toComponent,
              toComponentId: toComponent.id,
              toAsset: assetNames[toComponent.parent],
            },
            position: { x: (nodeSize + gap) * i, y: (nodeSize + gap) * j },
            style: { width: nodeSize, height: nodeSize },
          }
          if (fromComponent.id === toComponent.id) {
            node.data.status = 'inapplicable';
          } else {
            const dependency = dependencyList.find((dependency) =>
              dependency.depSubsystem === fromComponent.id && dependency.subsystem === toComponent.id
            );
            if (dependency) {
              node.data.dependencyId = dependency.id;
              node.data.status = 'dependent';
            } else {
              node.data.dependencyId = null;
              node.data.status = 'independent';
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