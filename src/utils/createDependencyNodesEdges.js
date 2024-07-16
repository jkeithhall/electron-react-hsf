const nodeSize = 50;

const createDependencyNodesEdges = function(componentList, dependencyList) {
  let initialDependencyNodes = [];
  let initialDependencyEdges = [];

  if (!componentList) return { initialDependencyNodes, initialDependencyEdges};

  // Find asset names
  let assetNames = {};
  componentList.forEach((component) => {
    if (!component.parent) {
      assetNames[component.id] = component.name;
    }
  });

  // Sort components by asset
  componentList.sort((a, b) => {
    // Assets ordered by id
    if (!a.parent && !b.parent) return a.id - b.id;
      // Subcomponents ordered by parents' id
    if (a.parent && b.parent) return a.parent.id - b.parent.id;
    // Subcomponents ordered after their parent but before other assets
    if (!a.parent && b.parent) {
      if (a.id === b.parent) return -1;
      return a.id - b.parent.id;
    }
    if (a.parent && !b.parent) {
      if (a.parent.id === b.id) return 1;
      return a.parent.id - b.id;
    }
    return 0;
  });

  let subcomponentCount = 0;
  componentList.forEach((component) => {
    if (component.parent) {
      initialDependencyNodes.push({
        id: component.id,
        type: 'dependency',
        data: { component, assetName: assetNames[component.parent] },
        position: { x: nodeSize * subcomponentCount, y: nodeSize * subcomponentCount },
        style: { width: nodeSize, height: nodeSize },
      });
      subcomponentCount++;
    }
  });

  dependencyList.forEach((dependency) => {
    initialDependencyEdges.push({
      id: dependency.id,
      source: dependency.depSubsystem,
      target: dependency.subsystem,
      data: dependency.fcnName,
      type: 'smoothstep',
      label: dependency.fcnName ? '⨍' : null,
      markerEnd: {
        type: 'arrowclosed',
        width: 15,
        height: 15,
        color: '#333',
      },
      style: {
        strokeWidth: 2,
        stroke: '#333',
      },
    });
  });

  return { initialDependencyNodes, initialDependencyEdges };
}

export default createDependencyNodesEdges ;