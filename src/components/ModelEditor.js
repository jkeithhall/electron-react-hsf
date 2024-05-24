import { useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import LayoutFlow from './LayoutFlow';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import 'reactflow/dist/style.css';
import ModelEditorDrawer from './ModelEditorDrawer';

export default function ModelEditor({
  navOpen,
  componentList,
  setComponentList,
  dependencyList,
  setDependencyList,
  constraints,
  setConstraints,
  evaluator,
  setEvaluator,
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
  setErrorModalOpen,
  setErrorMessage
}) {
  const [ selectedNodeId, setSelectedNodeId ] = useState(null);
  const [ selectedNodeData, setSelectedNodeData ] = useState(null);
  const [ paletteOpen, setPaletteOpen ] = useState(false);
  const [ newNodeType, setNewNodeType ] = useState(null);
  const [ clipboardData, setClipboardData ] = useState(null);

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

  const handleNewNodeClick = (type) => {
    if (window.electronApi) {
      window.electronApi.copyFromClipboard((content) => {
        const clipboardData = JSON.parse(content);
        if ((type === 'asset' && clipboardData.className === 'asset') ||
          (type === 'subComponent' && clipboardData.className !== 'asset')) {
          setClipboardData(clipboardData);
        }
      });
    }
    setSelectedNodeData(null);
    setNewNodeType(type);
    setPaletteOpen(true);
  }

  return (
    <>
      <Box className="model-editor">
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
                setComponentList={setComponentList}
                dependencyList={dependencyList}
                selectedNodeId={selectedNodeId}
                setSelectedNodeData={setSelectedNodeData}
                setErrorModalOpen={setErrorModalOpen}
                setErrorMessage={setErrorMessage}
                handleNewNodeClick={handleNewNodeClick}
                handlePaletteClose={handlePaletteClose}
                setClipboardData={setClipboardData}
              />
            </ReactFlowProvider>
          </Paper>
        </Paper>
      </Box>
      {paletteOpen &&
        <ModelEditorDrawer
          data={selectedNodeData}
          newNodeType={newNodeType}
          clipboardData={clipboardData}
          paletteOpen={paletteOpen}
          handlePaletteOpen={handlePaletteOpen}
          handlePaletteClose={handlePaletteClose}
          componentList={componentList}
          setComponentList={setComponentList}
          setDependencyList={setDependencyList}
          constraints={constraints}
          setConstraints={setConstraints}
          setEvaluator={setEvaluator}
          setNodes={setNodes}
          setEdges={setEdges}
          pythonSrc={pythonSrc}
          modelErrors={modelErrors}
          setModelErrors={setModelErrors}
        />}
    </>
  );
}