import { useState } from 'react';
import { ReactFlowProvider } from 'reactflow';

import LayoutFlow from './LayoutFlow';

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
  nodes,
  edges,
  setNodes,
  setEdges,
  onNodesChange,
  onEdgesChange,
  modelErrors,
  setModelErrors,
  componentIds,
}) {
  const [ selectedNodeId, setSelectedNodeId ] = useState(null);
  const [ selectedNodeData, setSelectedNodeData ] = useState({});
  const [ paletteOpen, setPaletteOpen ] = useState(false);

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

  return (
    <>
      <Paper className="react-flow-board" sx={{ backgroundColor: '#282D3D', padding: '10px' }}>
        <Paper style={{ width: '100%', height: '100%' }}>
          <ReactFlowProvider>
            <LayoutFlow
              nodes={nodes}
              edges={edges}
              setNodes={setNodes}
              setEdges={setEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              handleNodeClick={handleNodeClick}
              componentList={componentList}
              selectedNodeId={selectedNodeId}
              setSelectedNodeData={setSelectedNodeData}
            />
          </ReactFlowProvider>
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