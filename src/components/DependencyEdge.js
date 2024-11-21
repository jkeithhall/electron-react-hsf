import { getSmoothStepPath, EdgeLabelRenderer, BaseEdge } from "@xyflow/react";
import Tooltip from "@mui/material/Tooltip";

const DependencyEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data: label,
  markerEnd: unselectedMarkerEnd,
  style: unselectedEdgeStyle,
  selected,
}) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const width = 20;
  const height = 20;

  const selectedEdgeStyle = {
    ...unselectedEdgeStyle,
    stroke: "#e53935",
    strokeOpacity: 1,
    strokeWidth: 1.5,
  };

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={selected ? "url(#red-arrowhead)" : unselectedMarkerEnd}
        style={selected ? selectedEdgeStyle : unselectedEdgeStyle}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              width,
              height,
              position: "absolute",
              display: "flex",
              padding: "18 8 8 8",
              justifyContent: "center",
              alignItems: "flex-start",
              border: selected ? "1px solid #e53935" : "none",
              borderRadius: 5,
              background: `${unselectedEdgeStyle.stroke}`,
              color: "#333",
              fontSize: 10,
              fontWeight: 700,
              transform: `translate(${targetX - width / 2}px,${sourceY - height / 2}px)`,
              zIndex: selected ? 4 : 2,
              pointerEvents: "all",
            }}
            className="edge-label"
          >
            <Tooltip title={label} placement="top">
              <p>⨍</p>
            </Tooltip>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default DependencyEdge;
