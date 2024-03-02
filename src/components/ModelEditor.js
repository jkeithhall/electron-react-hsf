import { useCallback } from 'react';
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

export default function ModelEditor({navOpen, model, setModel, activeStep, setActiveStep, setStateMethods}) {
  const { initialNodes, initialEdges } = createNodesEdges(model);
  const [ nodes, setNodes, onNodesChange ] = useNodesState(initialNodes);
  const [ edges, setEdges, onEdgesChange ] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <>
      <Paper sx={{ alignSelf: 'flex-start', margin: '25px', minWidth: '1000px', maxWidth: 'calc(100vw - 280px)', height: 'calc(100vw - 200px)', padding: 1, backgroundColor: '#282D3d' }} >
        <Paper style={{ width: '100%', height: '100%' }}>
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
      </Paper>
    </>
  );
}