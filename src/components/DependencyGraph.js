import { useState, useEffect } from 'react';
import ReactFlow from 'reactflow';
import { DependencyNode } from './nodeTypes';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
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
  edges,
  setEdges,
  onEdgesChange,
}) {
  const [ selectedComponents, setSelectedComponents ] = useState([]);
  const [ paletteOpen, setPaletteOpen ] = useState(false);

  const handlePaletteOpen = () => {
    setPaletteOpen(true);
  }

  const handlePaletteClose = () => {
    setPaletteOpen(false);
  }

  const selectNodes = (nodeIds) => {
    setNodes((prevNodes) => {
      return prevNodes.map((node) => {
        if (nodeIds.includes(node.id)) {
          node.selected = true;
        } else {
          node.selected = false;
        }
        return node;
      });
    });
  }

  const handleNodeClick = (e, node) => {
    const { id, data } = node;
    const { component } = data;

    if (selectedComponents.length === 0) {
      setSelectedComponents([component]);
      selectNodes([id]);
      handlePaletteClose();
    } else if (selectedComponents.length === 1) {
      if (selectedComponents[0] !== component) {
        setSelectedComponents([selectedComponents[0], component]);
        selectNodes([selectedComponents[0].id, id]);
        handlePaletteOpen();
      }
    } else { // 2 selected components
      if (selectedComponents[0] !== component || selectedComponents[1] !== component) {
        setSelectedComponents([component]);
        selectNodes([id]);
        handlePaletteClose();
      }
    }
  }

  const handleEdgeClick = (e, edge) => {
    const { source, target } = edge;
    const sourceNode = nodes.find((node) => node.id === source);
    const targetNode = nodes.find((node) => node.id === target);
    const sourceComponent = sourceNode.data.component;
    const targetComponent = targetNode.data.component;

    setSelectedComponents([sourceComponent, targetComponent]);
    selectNodes([source, target]);
    handlePaletteOpen();
  }

  // On dismount, remove the selected state from the nodes
  useEffect(() => {
    return () => {
      setNodes((prevNodes) => {
        return prevNodes.map((node) => {
          node.selected = false;
          return node;
        });
      });
    }
  }, []);

  const graphEditorSize = navOpen && paletteOpen ? 'graph-editor-all-open' : navOpen ? 'graph-editor-nav-open' : paletteOpen ? 'graph-editor-palette-open' : 'graph-editor-all-closed';

  return (
    <>
      <Box className={`graph-editor ${graphEditorSize}`}>
        <Paper className="react-flow-board" sx={{ backgroundColor: '#282D3D', padding: '10px' }}>
          <Paper style={{ width: '100%', height: '100%' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodeClick={handleNodeClick}
              onEdgeClick={handleEdgeClick}
              deleteKeyCode={0}
              nodesDraggable={false}
              nodesConnectable={true}
              onError={console.log}
              fitView
            >
            </ReactFlow>
          </Paper>
        </Paper>
      </Box>
      {paletteOpen &&
        <EditingPalette
          selectedComponents={selectedComponents}
          editingMode={'dependencyEditor'}
          paletteOpen={paletteOpen}
          componentList={componentList}
          nodes={nodes}
          edges={edges}
          setEdges={setEdges}
          dependencyList={dependencyList}
          setDependencyList={setDependencyList}
          setDependencyNodes={setNodes}
          onDependencyNodesChange={onNodesChange}
          handlePaletteClose={handlePaletteClose}
        />}
    </>
  );
}