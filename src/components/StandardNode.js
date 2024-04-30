import { memo } from 'react';
import { Handle, Position } from 'reactflow';

const StandardNode = ({ data, selected }) => {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div style={{ padding: 10 }}>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export default memo(StandardNode);