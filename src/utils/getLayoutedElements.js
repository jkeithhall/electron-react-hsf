import Dagre from '@dagrejs/dagre';
import recenterAssets from './recenterAssets';

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

export default function getLayoutedElements(nodes, edges, options) {
  g.setGraph({ rankdir: options.direction });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) => g.setNode(node.id, node));

  Dagre.layout(g);

  const dagreLayoutedElements = {
    nodes: nodes.map((node) => {
      const { x, y } = g.node(node.id);

      return { ...node, position: { x, y } };
    }),
    edges,
  };
  return recenterAssets(dagreLayoutedElements.nodes, dagreLayoutedElements.edges);
};