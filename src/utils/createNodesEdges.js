const assetColors = [
  'rgba(2, 136, 209, 0.4)',
  'rgb(2,209,75, 0.4)',
  'rgb(209,2,136, 0.4)',
  'rgb(209,75,2, 0.4)',
]

const createNodesEdges = function(model) {
  let nodes = [];
  let edges = [];

  model.assets.forEach((asset, i) => {
    let y_position = 0;
    let x_position = i * 500;
    const parentNode = {
      id: `asset${i}`,
      position: { x: x_position, y: y_position },
      data: { label: `Group ${asset.assetName}` },
      style: { backgroundColor: assetColors[i], width: 450, height: 450 },
      type: 'group',
    };
    nodes.push(parentNode);

    y_position += 400;
    x_position += 20;
    // Really unsure why this conditional seems to be necessary for the x_position to be correct
    if (i > 0) {
      x_position -= 500;
    }
    asset.subsystems.forEach((subsystem, j) => {
      const { subsystemID, subsystemName } = subsystem;
      const childNode = {
        id: `subsystem${subsystemID}`,
        position: { x: x_position, y: y_position },
        data: { label: subsystemName },
        parentNode: `asset${i}`,
        extent: 'parent'
      };
      nodes.push(childNode);

      y_position -= 60;
      x_position += 50;

      if (subsystem.dependencies) {
        const  { dependencies } = subsystem;
        dependencies.forEach((dependency, k) => {
          edges.push({ id: `edge${i}.${j}-${k}`, source: `subsystem${subsystemID}`, target: `subsystem${dependency.subsystemID}` });
        });
      }
    });
  });

  return { initialNodes: nodes, initialEdges: edges };
}

export default createNodesEdges;