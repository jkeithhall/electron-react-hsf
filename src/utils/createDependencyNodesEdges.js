const nodeSize = 50;

const depEdgeConfig = {
  type: 'function',
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
};

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
    let sourceHandle = 'left';
    let targetHandle = 'bottom';
    const firstComponent = componentList.find(c => c.id === subsystem || c.id === depSubsystem);
    if (firstComponent.id === subsystem) {
      sourceHandle = 'right';
      targetHandle = 'top';
    }

    initialDependencyEdges.push({
      id,
      source: subsystem,
      target: depSubsystem,
      sourceHandle,
      targetHandle,
      data: fcnName,
      type: depEdgeConfig.type,
      label: fcnName ? '⨍' : null,
      markerEnd: { ...depEdgeConfig.markerEnd },
      style: { ...depEdgeConfig.style },
    });
  });

  return { initialDependencyNodes, initialDependencyEdges };
}

export { createDependencyNodesEdges, depEdgeConfig };