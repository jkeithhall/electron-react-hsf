import { useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import ModelFlow from './ModelFlow';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import 'reactflow/dist/style.css';
import EditingPalette from './EditingPalette.js';

export default function ModelGraph({
  navOpen,
  componentList,
  setComponentList,
  dependencyList,
  setDependencyList,
  constraints,
  setConstraints,
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
  const [ editingMode, setEditingMode ] = useState(null);
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
    setEditingMode('componentEditor');
    setSelectedNodeData(data.data);
    setPaletteOpen(true);
  }

  const handleNewNodeClick = (editingMode) => {
    if (window.electronApi) {
      window.electronApi.copyFromClipboard((content) => {
        const clipboardData = JSON.parse(content);
        if ((editingMode === 'newAssetEditor' && !clipboardData.className) ||
          (editingMode === 'newComponentEditor' && clipboardData.className)) {
          setClipboardData(clipboardData);
        }
      });
    }
    setSelectedNodeData(null);
    setEditingMode(editingMode);
    setPaletteOpen(true);
  }

  const graphEditorSize = navOpen && paletteOpen ? 'graph-editor-all-open' : navOpen ? 'graph-editor-nav-open' : paletteOpen ? 'graph-editor-palette-open' : 'graph-editor-all-closed';

  return (
    <>
      <Box className={`graph-editor ${graphEditorSize}`}>
        <Paper className="react-flow-board" sx={{ backgroundColor: '#282D3D', padding: '10px' }}>
          <Paper style={{ width: '100%', height: '100%' }}>
            <ReactFlowProvider>
              <ModelFlow
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
                setDependencyList={setDependencyList}
                setConstraints={setConstraints}
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
        <EditingPalette
          data={selectedNodeData}
          editingMode={editingMode}
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