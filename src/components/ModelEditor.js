import { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import FileHeader from './FileHeader';
import createNodesEdges from '../utils/createNodesEdges';
import Paper from '@mui/material/Paper';
import 'reactflow/dist/style.css';

export default function ModelEditor({sources, simulationParameters, schedulerParameters, taskList, model, setModel, activeStep, setActiveStep, setStateMethods}) {
  const { initialNodes, initialEdges } = createNodesEdges(model);
  const [ nodes, setNodes, onNodesChange ] = useNodesState(initialNodes);
  const [ edges, setEdges, onEdgesChange ] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleNextButtonClick = () => {
    // TO DO: handle validation for model
    setActiveStep('Dependencies');
  };

  const valid = true;

  return (
    <>
      <FileHeader activeStep={activeStep} valid={valid} setStateMethods={setStateMethods} handleNextButtonClick={handleNextButtonClick}/>
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
    </>
  );
}