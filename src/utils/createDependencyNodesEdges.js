const nodeSize = 50;

const createDependencyNodesEdges = function(componentList, dependencyList) {
  let initialDependencyNodes = [];
  let initialDependencyEdges = [];

  if (!componentList) return { initialDependencyNodes, initialDependencyEdges};

  // Cluster components by asset
  let assetClusters = {};
  componentList.forEach((component) => {
    if (!component.parent) {
      if (!assetClusters[component.id]) {
        assetClusters[component.id] = { assetName: null, components: [] }
      }
      assetClusters[component.id]['assetName'] = component.name;
    } else {
      if (!assetClusters[component.parent]) {
        assetClusters[component.parent] = { assetName: null, components: [] }
      }
      assetClusters[component.parent]['components'].push(component);
    }
  });

  let subcomponentCount = 0;
  Object.values(assetClusters).forEach(({ assetName, components }) => {
    components.forEach((component) => {
      initialDependencyNodes.push({
        id: component.id,
        type: 'dependency',
        data: { component, assetName },
        position: { x: nodeSize * subcomponentCount, y: nodeSize * subcomponentCount },
        width: nodeSize,
        height: nodeSize,
      });
      subcomponentCount++;
    });
  });

  dependencyList.forEach(({
    id,
    depSubsystem,
    subsystem,
    asset,
    depAsset,
    fcnName,
  }) => {
    let sourceHandle = 'right';
    let targetHandle = 'top';
    const firstComponent = componentList.find(c => c.id === subsystem || c.id === depSubsystem);
    if (firstComponent.id === subsystem) {
      sourceHandle = 'left';
      targetHandle = 'top';
    }

    initialDependencyEdges.push({
      id,
      source: depSubsystem,
      target: subsystem,
      sourceHandle,
      targetHandle,
      data: fcnName,
      type: 'function',
      label: fcnName ? '⨍' : null,
      markerEnd: {
        type: 'arrowclosed',
        width: 15,
        height: 15,
        color: '#EEE',
      },
      style: {
        strokeWidth: 1,
        stroke: '#EEE',
      },
    });
  });

  return { initialDependencyNodes, initialDependencyEdges };
}

export default createDependencyNodesEdges ;