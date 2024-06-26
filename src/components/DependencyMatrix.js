import { useState, useCallback } from 'react';
import ReactFlow, { MiniMap, Background, applyNodeChanges } from 'reactflow';
import { DependencyNode } from '../utils/nodeTypes';

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
  initialNodes,
}) {
  const [nodes, setNodes] = useState(initialNodes);
  const [selectedNodeData, setSelectedNodeData] = useState(null);
  const [ paletteOpen, setPaletteOpen ] = useState(false);

  const handlePaletteOpen = () => {
    setPaletteOpen(true);
  }

  const handlePaletteClose = () => {
    setPaletteOpen(false);
  }

  const handleNodeClick = (event, node) => {
    const { data } = node;
    const { status } = data;
    if (status !== 'inapplicable') {
      setSelectedNodeData({data, status});
      handlePaletteOpen();
    } else {
      handlePaletteClose();
    }
  }

  const onNodesChange = useCallback((changes) => setNodes((nodes) => applyNodeChanges(changes, nodes)),
    [setNodes]
  );

  const modelEditorSize = navOpen && paletteOpen ? 'model-editor-all-open' : navOpen ? 'model-editor-nav-open' : paletteOpen ? 'model-editor-palette-open' : 'model-editor-all-closed';

  return (
    <>
      <Box className={`model-editor ${modelEditorSize}`}>
        <Paper className="react-flow-board" sx={{ backgroundColor: '#282D3D', padding: '10px' }}>
          <Paper style={{ width: '100%', height: '100%' }}>
            <ReactFlow
              nodes={nodes}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onNodeClick={handleNodeClick}
              deleteKeyCode={0}
              nodesDraggable={false}
              nodesConnectable={false}
              onError={console.log}
              fitView
            >
              {/* <MiniMap /> */}
              <Background variant="lines" gap={55} lineWidth={2} />
            </ReactFlow>
          </Paper>
        </Paper>
      </Box>
      {paletteOpen &&
        <EditingPalette
          data={selectedNodeData}
          editingMode={'dependencyEditor'}
          paletteOpen={paletteOpen}
          handlePaletteClose={handlePaletteClose}
          componentList={componentList}
          setDependencyList={setDependencyList}
          setDependencyNodes={setNodes}
        />}
    </>
  );
}