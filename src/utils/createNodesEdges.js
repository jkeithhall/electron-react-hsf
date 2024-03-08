import { MarkerType } from 'reactflow';

const assetColors = [
  'rgba(2, 136, 209, 0.4)',
  'rgb(2,209,75, 0.4)',
  'rgb(209,2,136, 0.4)',
  'rgb(209,75,2, 0.4)',
];

const assetSize = 450;

const createNodesEdges = function({ assets, dependencies }) {
  let nodes = [];
  let edges = [];

  if (!assets || !dependencies) return { initialNodes: nodes, initialEdges: edges };

  assets.forEach((asset, i) => {
    let y_position = 0;
    let x_position = 0;
    const parentNode = {
      id: `asset_${asset.name}`,
      position: { x: i * (assetSize + 50), y: y_position },
      data: { label: `Group ${asset.name}` },
      style: { backgroundColor: assetColors[i], width: assetSize, height: assetSize },
      type: 'group',
    };
    nodes.push(parentNode);

    y_position += 400;
    asset.subsystems.forEach((subsystem, j) => {
      const position = subsystem.name === 'Power' ? { x: 0, y: -70 * j + y_position } : { x: 90 * j, y: -60 * j + y_position };
      const childNode = {
        id: `${asset.name}_subsystem_${subsystem.name}`,
        position: position,
        data: { label: subsystem.name },
        parentNode: `asset_${asset.name}`,
        extent: 'parent'
      };
      nodes.push(childNode);
    });
  });

  dependencies.forEach((dependency, i) => {
    const { subsystemName, assetName, depSubsystemName } = dependency;
    const newEdge = {
      id: `edge_${assetName}_${subsystemName}-${depSubsystemName}`,
      source: `${assetName}_subsystem_${subsystemName}`,
      target: `${assetName}_subsystem_${depSubsystemName}`,
      markerEnd: {
        type: MarkerType.Arrow,
      },
    };
    edges.push(newEdge);
  });

  return { initialNodes: nodes, initialEdges: edges };
}

export default createNodesEdges;