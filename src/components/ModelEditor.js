import { useState, useCallback } from 'react';
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
import FileSelector from './FileSelector';
import SaveButton from './SaveButton';
import Button from '@mui/material/Button';
import 'reactflow/dist/style.css';

export default function ModelEditor({model, setModel, activeStep, setActiveStep, setStateMethods}) {
  const { initialNodes, initialEdges } = createNodesEdges(model);
  const [ nodes, setNodes, onNodesChange ] = useNodesState(initialNodes);
  const [ edges, setEdges, onEdgesChange ] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleNextClick = () => {
    // TO DO: handle validation for model
    setActiveStep('Dependencies');
  };

  return (
    <>
      <FileSelector activeStep={activeStep} setStateMethods={setStateMethods}/>
      <Paper elevation={3} style={{ padding: '10px', margin: '10px', backgroundColor: '#eeeeee', width: '100%', height: 480 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </Paper>
      <div className='button-footer'>
        <SaveButton
          activeStep={activeStep}
          model={model}
          setModel={setModel}
          setStateMethods={setStateMethods}
        />
        <Button
          variant="contained"
          color="info"
          onClick={handleNextClick}
        >
          Next
        </Button>
      </div>
    </>
  );
}