const createNodesEdges = function(model) {
  let nodes = [];
  let edges = [];

  model.assets.forEach((asset, i) => {
    let y_position = i * 400;
    nodes.push({ id: `asset${i}`, position: { x: 0, y: y_position }, data: { label: asset.assetName } });

    asset.subsystems.forEach((subsystem, j) => {
      const x_position = j * 150;
      y_position -= 100;
      const { subsystemID, subsystemName } = subsystem;
      nodes.push({ id: `subsystem${subsystemID}`, position: { x: x_position, y: y_position }, data: { label: subsystemName } });

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