import { useCallback, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  useReactFlow,
  Panel,
} from 'reactflow';
import IconButton from '@mui/material/IconButton';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import Tooltip from '@mui/material/Tooltip';
import getLayoutedElements from '../utils/getLayoutedElements';
import recenterAssets from '../utils/recenterAssets';

export default function LayoutFlow ({
  nodes,
  edges,
  setNodes,
  setEdges,
  onNodesChange,
  onEdgesChange,
  handleNodeClick,
  componentList,
  selectedNodeId,
  setSelectedNodeData }) {
  const { fitView } = useReactFlow();
  window.requestAnimationFrame(() => {
    fitView();
  });

  const onLayout = useCallback(
    (direction) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, {
        direction,
      });
      const { nodes: recenteredNodes, edges: recenteredEdges } = recenterAssets(layoutedNodes, layoutedEdges);

      setNodes([...recenteredNodes]);
      setEdges([...recenteredEdges]);

      window.requestAnimationFrame(() => {
        fitView();
      });
    },
    [nodes, edges]
  );

  const onConnect = useCallback((params) => {
    // If the source and target are the same, don't add the edge (no self-loops allowed)
    if (params.source === params.target) {
      return;
    }
    setEdges((eds) => addEdge(params, eds))
  },
    [setEdges],
  );

  useEffect(() => {
    componentList.forEach((component) => {
      if (component.id === selectedNodeId) {
        setNodes((prevNodes) => {
          const newNodes = prevNodes.map((node) => {
            if (node.id === selectedNodeId) {
              return {
                ...node,
                data: { ...node.data, label: component.name, data: component },
              };
            }
            return node;
          });
          return newNodes;
        });
        setSelectedNodeData(component);
      }
    });
  }, [componentList]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={handleNodeClick}
      deleteKeyCode={0}
      onError={console.log}
    >
      <Panel position="top-right">
        <Tooltip title="Autolayout">
          <IconButton
            color="primary"
            onClick={() => onLayout('TB')}
          >
            <AutoFixHighIcon />
          </IconButton>
        </Tooltip>
      </Panel>
      <Controls />
      <MiniMap />
      <Background variant="dots" gap={12} size={1} />
    </ReactFlow>
  );
};