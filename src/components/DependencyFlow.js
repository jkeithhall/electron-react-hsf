import { ReactFlow } from '@xyflow/react';
import { DependencyNode } from './DependencyNode';
import DependencyEdge from './DependencyEdge';

import 'reactflow/dist/style.css';

const nodeTypes = { dependency: DependencyNode };
const edgeTypes = { function: DependencyEdge };

export default function DependencyFlow({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  handleNodeClick,
  handleEdgeClick,
  handlePaneClick,
}) {

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onPaneClick={handlePaneClick}
        deleteKeyCode={0}
        nodesDraggable={false}
        nodesConnectable={true}
        onError={console.log}
        fitView
      />
    </>
  )
}