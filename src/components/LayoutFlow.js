import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  useReactFlow,
  Panel,
} from 'reactflow';
import { randomId } from '@mui/x-data-grid-generator';
import AddComponentDial from './AddComponentDial';
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
  setComponentList,
  dependencyList,
  selectedNodeId,
  setSelectedNodeData,
  setErrorModalOpen,
  setErrorMessage,
  handleNewNodeClick,
  handlePaletteClose,
}) {
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const { fitView } = useReactFlow();

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
    const { source, target } = params;
    // If the source and target are the same, don't add the edge (no self-loops allowed)
    if (source === target) {
      setErrorModalOpen(true);
      setErrorMessage('Self-dependencies are not allowed');
      return;
    }
    // If the source or target are assets, don't add the edge
    if (componentList.find((component) => component.className === 'asset' && (component.id === source || component.id === target))) {
      setErrorModalOpen(true);
      setErrorMessage('Cannot create dependencies between assets');
      return;
    }
    // TO DO: Add check for circular dependencies (and other constraints?)

    setEdges((eds) => {
      // Make all new edges smoothstep
      return addEdge(params, eds).map((edge) => { return { ...edge, type: 'smoothstep' }});
    })
  },
    [setEdges],
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();

    const { data, backgroundColor } = JSON.parse(e.dataTransfer.getData('application/reactflow'));
    const { className } = data;

    const position = reactFlowInstance.screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });
    const newNode = {
      id: data.id,
      data: { label: data.name, data },
      position,
    }
    if (className === 'asset') {
      newNode.style = { backgroundColor, width: 200, height: 200 };
    } else if (data.parent) {
      newNode.extent = 'parent';
      newNode.parentNode = data.parent;
    }

    setComponentList((prevList) => prevList.concat(data));
    setNodes((nodes) => nodes.concat(newNode));
    handlePaletteClose();
  }, [reactFlowInstance]);

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
      snapToGrid={true}
      snapGrid={[15, 15]}
      onInit={setReactFlowInstance}
      onDrop={onDrop}
      onDragOver={onDragOver}
      fitView
    >
      <Panel position="top-left">
        <AddComponentDial onLayout={onLayout} handleNewNodeClick={handleNewNodeClick} />
      </Panel>
      <Controls />
      <MiniMap />
      <Background variant="dots" gap={12} size={1} />
    </ReactFlow>
  );
};