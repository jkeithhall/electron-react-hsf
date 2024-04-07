import { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';

import createNodesEdges from '../utils/createNodesEdges';
import Paper from '@mui/material/Paper';
import 'reactflow/dist/style.css';
import ModelEditorDrawer from './ModelEditorDrawer';

export default function ModelEditor({
  navOpen,
  componentList,
  setComponentList,
  dependencyList,
  setDependencyList,
  activeStep,
  setActiveStep,
  pythonSrc,
  modelErrors,
  setModelErrors,
  componentIds,
}) {
  const { initialNodes, initialEdges } = createNodesEdges(componentList, dependencyList);
  const [ nodes, setNodes, onNodesChange ] = useNodesState(initialNodes);
  const [ edges, setEdges, onEdgesChange ] = useEdgesState(initialEdges);
  const [ selectedNodeId, setSelectedNodeId ] = useState(null);
  const [ selectedNodeData, setSelectedNodeData ] = useState({});
  const [ paletteOpen, setPaletteOpen ] = useState(false);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handlePaletteOpen = () => {
    setPaletteOpen(true);
  }

  const handlePaletteClose = () => {
    setPaletteOpen(false);
  }

  const handleNodeClick = (event, node) => {
    const { id, data } = node;
    setSelectedNodeId(id);
    setSelectedNodeData(data.data);
    setPaletteOpen(true);
  }

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
    <>
      <Paper className="react-flow-board" sx={{ backgroundColor: '#282D3D', padding: '10px' }}>
        <Paper style={{ width: '100%', height: '100%' }}>
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
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </Paper>
      </Paper>
      {paletteOpen &&
        <ModelEditorDrawer
          data={selectedNodeData}
          paletteOpen={paletteOpen}
          handlePaletteOpen={handlePaletteOpen}
          handlePaletteClose={handlePaletteClose}
          componentList={componentList}
          setComponentList={setComponentList}
          setDependencyList={setDependencyList}
          pythonSrc={pythonSrc}
          modelErrors={modelErrors}
          setModelErrors={setModelErrors}
          componentIds={componentIds}
        />}
    </>
  );
}