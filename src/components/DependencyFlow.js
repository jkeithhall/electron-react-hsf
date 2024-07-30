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

  const redArrowheadSvg = (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        <marker id={'red-arrowhead'} markerWidth="5" markerHeight="5.5" refX="2.75" refY="2.75" orient="auto">
          <polygon points="0 0, 5 2.75, 0 5.5" fill="red" />
        </marker>
      </defs>
    </svg>
  );

  return (
    <>
      {redArrowheadSvg}
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