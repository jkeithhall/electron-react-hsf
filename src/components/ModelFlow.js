import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  useReactFlow,
  Panel,
  MarkerType
} from 'reactflow';
import { randomId } from '@mui/x-data-grid-generator';
import { SubcomponentNode, AssetNode } from './ModelNodes';

import AddComponentDial from './AddComponentDial';
import getLayoutedElements from '../utils/getLayoutedElements';
import recenterAssets from '../utils/recenterAssets';

const nodeTypes = { subcomponent: SubcomponentNode, asset: AssetNode };

export default function ModelFlow ({
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
  setDependencyList,
  setConstraints,
  selectedNodeId,
  setSelectedNodeData,
  setErrorModalOpen,
  setErrorMessage,
  handleNewNodeClick,
  handlePaletteClose,
  setClipboardData,
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
    if (componentList.find((component) => component.parent === undefined && (component.id === source || component.id === target))) {
      setErrorModalOpen(true);
      setErrorMessage('Cannot create dependencies between assets');
      return;
    }

    // TO DO: Add check for circular dependencies (and other constraints?)
    setDependencyList((prevDependencyList) => {
      const newDependencyId = randomId();
      return [
        ...prevDependencyList,
        {
          id: newDependencyId,
          depSubsystem: source,
          subsystem: target,
          asset: componentList.find((component) => component.id === target).parent,
          depAsset: componentList.find((component) => component.id === source).parent,
          fcnName: '',
        }
      ];
    });
    // setEdges((eds) => {
    //   // Style new edges as smoothstep with arrowheads
    //   return addEdge(params, eds).map((edge) => {
    //     return {
    //       ...edge,
    //       type: 'smoothstep',
    //       markerEnd: {
    //         type: MarkerType.ArrowClosed,
    //         width: 15,
    //         height: 15,
    //         color: '#000',
    //       },
    //       style: {
    //         strokeWidth: 2,
    //         stroke: '#000',
    //       },
    //     }
    //   });
    // })
  },
    [setEdges],
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const dropPosition = reactFlowInstance.screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });

    const { data, backgroundColor, newConstraints } = JSON.parse(e.dataTransfer.getData('application/reactflow'));
    const { parent } = data;

    const newNode = {
      id: data.id,
      data: { label: data.name, data, backgroundColor },
    }
    if (parent === undefined) { // Asset
      newNode.type = 'asset';
      newNode.style = { width: 200, height: 200 };
      newNode.position = { x: dropPosition.x, y: dropPosition.y };
    } else if (data.parent) { // Subcomponent
      newNode.type = 'subcomponent';
      newNode.extent = 'parent';
      newNode.parentId = data.parent;
      newNode.style = { width: 120, height: 40 };
      newNode.position = { x: 0, y: 0 };
      setConstraints((prevConstraints) => prevConstraints.concat(newConstraints));
    }

    setComponentList((prevList) => prevList.concat(data));
    setNodes((nodes) => {
      // Check if the new node overlaps with any existing nodes
      let overlapped = false;
      do {
        overlapped = false;
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          if (node.parentId && node.parentId === data.parent && node.id !== newNode.id) {
            if (Math.abs(node.position.x - newNode.position.x) < 150 && Math.abs(node.position.y - newNode.position.y) < 40) {
              overlapped = true;
              newNode.position.x += 150;
              newNode.position.y += 40;
            }
          }
        }
      } while (overlapped);

      return [...nodes, newNode];
    });
    setClipboardData(null);
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

  // On dismount, deselect all nodes and edges
  useEffect(() => {
    return () => {
      setNodes((prevNodes) => {
        return prevNodes.map((node) => {
          return { ...node, selected: false };
        });
      });
      setEdges((prevEdges) => {
        return prevEdges.map((edge) => {
          return { ...edge, selected: false };
        });
      });
    }
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={handleNodeClick}
      nodeTypes={nodeTypes}
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
        <AddComponentDial componentList={componentList} onLayout={onLayout} handleNewNodeClick={handleNewNodeClick} />
      </Panel>
      <Controls />
      <MiniMap />
      <Background variant="dots" gap={12} size={1} />
    </ReactFlow>
  );
};