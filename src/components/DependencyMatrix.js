import { useState, useEffect } from 'react';
import ReactFlow, { Background } from 'reactflow';
import { DependencyNode } from './nodeTypes';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import 'reactflow/dist/style.css';
import EditingPalette from './EditingPalette';

const nodeTypes = { dependency: DependencyNode };

export default function DependencyMatrix({
  navOpen,
  componentList,
  dependencyList,
  setDependencyList,
  nodes,
  setNodes,
  onNodesChange,
}) {
  const [ selectedNodeId, setSelectedNodeId ] = useState(null);
  const [ paletteOpen, setPaletteOpen ] = useState(false);

  const handlePaletteOpen = () => {
    setPaletteOpen(true);
  }

  const handlePaletteClose = () => {
    setPaletteOpen(false);
  }

  const handleNodeClick = (e, node) => {
    const { id, data } = node;
    const { status } = data;
    if (status !== 'inapplicable') {
      setSelectedNodeId(id);
      handlePaletteOpen();
    }
    setNodes((prevNodes) => {
      return prevNodes.map((node) => {
        if (node.id === id) {
          node.selected = true;
          return node;
        }
        node.selected = false;
        return node;
      });
    });
  }

  const modelEditorSize = navOpen && paletteOpen ? 'model-editor-all-open' : navOpen ? 'model-editor-nav-open' : paletteOpen ? 'model-editor-palette-open' : 'model-editor-all-closed';

  return (
    <>
      <Box className={`model-editor ${modelEditorSize}`}>
        <Paper className="react-flow-board" sx={{ backgroundColor: '#282D3D', padding: '10px' }}>
          <Paper style={{ width: '100%', height: '100%' }}>
            <ReactFlow
              nodes={nodes}
              nodeTypes={nodeTypes}
              onNodeClick={handleNodeClick}
              deleteKeyCode={0}
              nodesDraggable={false}
              nodesConnectable={false}
              onError={console.log}
              fitView
            >
            </ReactFlow>
          </Paper>
        </Paper>
      </Box>
      {paletteOpen &&
        <EditingPalette
          selectedNodeId={selectedNodeId}
          editingMode={'dependencyEditor'}
          paletteOpen={paletteOpen}
          componentList={componentList}
          nodes={nodes}
          dependencyList={dependencyList}
          setDependencyList={setDependencyList}
          setDependencyNodes={setNodes}
          onDependencyNodesChange={onNodesChange}
          handlePaletteClose={handlePaletteClose}
        />}
    </>
  );
}