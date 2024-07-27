import { useState, useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import DependencyFlow from './DependencyFlow';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import EditingPalette from './EditingPalette';

import '@xyflow/react/dist/style.css';

export default function DependencyGraph({
  nodes,
  setNodes,
  onNodesChange,
  edges,
  setEdges,
  onEdgesChange,
  navOpen,
  componentList,
  dependencyList,
  setDependencyList,
}) {
  const [ componentA, setComponentA ] = useState(null);
  const [ componentB, setComponentB ] = useState(null);
  const [ paletteOpen, setPaletteOpen ] = useState(false);

  const selectNodes = (nodeIds) => {
    setNodes((prevNodes) => {
      return prevNodes.map((node) => {
        if (nodeIds.includes(node.id)) {
          return { ...node, selected: true };
        } else {
          return { ...node, selected: false };
        }
      });
    });
    if (nodeIds.length === 2) {
      // Select all edges between the two components and put them last in the edge list
      setEdges((prevEdges) => {
        const selectedEdges = [];
        prevEdges.forEach((edge) => {
          if (nodeIds.includes(edge.source) && nodeIds.includes(edge.target)) {
            selectedEdges.push({ ...edge, selected: true });
          }
        });
        return prevEdges.filter((edge) => {
          return !selectedEdges.includes(edge);
        }).concat(selectedEdges);
      });
      handlePaletteOpen();
    } else {
      setEdges((prevEdges) => {
        return prevEdges.map((edge) => {
          return { ...edge, selected: false };
        });
      });
      handlePaletteClose();
    }
  }

  const handleNodeClick = (e, node) => {
    const { id, data } = node;
    const { component } = data;

    if (!componentA && !componentB) {
      setComponentA(component);
      selectNodes([id]);
    } else if (!componentB) {
      if (componentA !== component) {
        setComponentB(component);
        selectNodes([componentA.id, id]);
      }
    } else { // 2 selected components
      if (componentA !== component && componentB !== component) { // Clicked on a different component
        setComponentA(component);
        setComponentB(null);
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

    setComponentA(sourceComponent);
    setComponentB(targetComponent);
    selectNodes([source, target]);
    // setEdges((prevEdges) => {
    //   // Select all edges between the two components
    //   return prevEdges.map((edge) => {
    //     if ((edge.source === source && edge.target === target) ||
    //       (edge.source === target && edge.target === source)) {
    //       return { ...edge, selected: true };
    //     } else {
    //       return { ...edge, selected: false };
    //     }
    //   });
    // });

  }

  const handlePaneClick = (e) => {
    setComponentA(null);
    setComponentB(null);
    selectNodes([]);
    handlePaletteClose();
  };

  const handlePaletteOpen = () => {
    setPaletteOpen(true);
  }

  const handlePaletteClose = () => {
    setPaletteOpen(false);
  }

  const handleComponentSelectChange = (e, index) => {
    index === 0 ? setComponentA(e.target.value) : setComponentB(e.target.value);
  }

  const graphEditorSize = navOpen && paletteOpen ? 'graph-editor-all-open' : navOpen ? 'graph-editor-nav-open' : paletteOpen ? 'graph-editor-palette-open' : 'graph-editor-all-closed';

  const assetNames = {};
  componentList.forEach((component) => {
    if (!component.parent) {
      assetNames[component.id] = component.name;
    }
  });

  useEffect(() => {
    if (componentA && componentB) {
      selectNodes([componentA.id, componentB.id]);
    } else if (componentA) {
      selectNodes([componentA.id]);
    } else if (componentB) {
      selectNodes([componentB.id]);
    }

    // On dismount, deselect all nodes and edges
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
  }, [componentA, componentB]);

  return (
    <>
      <Box className={`graph-editor ${graphEditorSize}`}>
        <Paper className="react-flow-board" sx={{ backgroundColor: '#282D3D', padding: '10px' }}>
          <Stack
            direction='row'
            spacing={1}
            sx={{
              justifyContent: 'space-around',
              backgroundColor: '#EEEE',
              padding: '10px',
              margin: '10px',
              borderRadius: '5px',
              width: 500,
             }}
          >
            <TextField
              id='componentA'
              label='Component 1'
              variant='outlined'
              color='primary'
              value={componentA || ''}
              name='componentA'
              select
              align='left'
              onChange={(e) => handleComponentSelectChange(e, 0)}
              sx={{ width: 230, backgroundColor: '#EEE', margin: 1 }}
            >
              {componentList
                .filter((component) => component.parent && component.id !== componentB?.id)
                .map((component) => (
                  <MenuItem key={component.id} value={component}>
                    {`${component.name} (${assetNames[component.parent]})`}
                  </MenuItem>
                ))
              }
            </TextField>
            <TextField
              id='componentB'
              label='Component 2'
              variant='outlined'
              color='primary'
              value={componentB || ''}
              name='componentB'
              select
              align='left'
              onChange={(e) => handleComponentSelectChange(e, 1)}
              sx={{ width: 230, backgroundColor: '#EEE', margin: 1 }}
            >
              {componentList
                .filter((component) => component.parent && component.id !== componentA?.id)
                .map((component) => (
                  <MenuItem key={component.id} value={component}>
                    {`${component.name} (${assetNames[component.parent]})`}
                  </MenuItem>
                ))
              }
            </TextField>
          </Stack>
          <Paper style={{ width: '100%', height: '100%' }}>
            <ReactFlowProvider>
              <DependencyFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                handleNodeClick={handleNodeClick}
                handleEdgeClick={handleEdgeClick}
                handlePaneClick={handlePaneClick}
              />
            </ReactFlowProvider>
          </Paper>
        </Paper>
      </Box>
      {paletteOpen &&
        <EditingPalette
          componentA={componentA}
          componentB={componentB}
          editingMode={'dependencyEditor'}
          paletteOpen={paletteOpen}
          componentList={componentList}
          setEdges={setEdges}
          dependencyList={dependencyList}
          setDependencyList={setDependencyList}
          handlePaletteClose={handlePaletteClose}
        />
      }
    </>
  );
}