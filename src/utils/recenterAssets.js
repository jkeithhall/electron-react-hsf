export default function recenterAssets(nodes, edges) {
  const assets = {};
  let subComponentHeight, subComponentWidth;

  // Calculate the bounding box for each asset
  nodes.forEach((node) => {
    const { position, height, width, parentNode } = node;
    if (parentNode) {
      if (!assets[parentNode]) {
        assets[parentNode] = {
            minX: Number.POSITIVE_INFINITY,
            minY: Number.POSITIVE_INFINITY,
            maxX: Number.NEGATIVE_INFINITY,
            maxY: Number.NEGATIVE_INFINITY,
          };
      }
      assets[parentNode].minX = Math.min(assets[parentNode].minX, position.x);
      assets[parentNode].minY = Math.min(assets[parentNode].minY, position.y);
      assets[parentNode].maxX = Math.max(assets[parentNode].maxX, position.x);
      assets[parentNode].maxY = Math.max(assets[parentNode].maxY, position.y);

      subComponentHeight = height;
      subComponentWidth = width;
    }
  });

  // Recenter the nodes within each asset
  nodes.forEach((node) => {
    const { id, data } = node;
    if (data.data.className === 'asset') {
      const { minX, minY, maxX, maxY } = assets[id];

      const assetHeight = maxY - minY + subComponentHeight;
      node.height = assetHeight;
      node.style.height = assetHeight;

      const assetWidth = maxX - minX + subComponentWidth;
      node.width = assetWidth;
      node.style.width = assetWidth;
    } else {
      const { parentNode } = node;
      if (parentNode) {
        const { minX, minY } = assets[parentNode];
        node.position.x -= minX;
        node.position.y -= minY;
        node.x = node.position.x;
        node.y = node.position.y;
      }
    }
  });
  return { nodes, edges };
}
