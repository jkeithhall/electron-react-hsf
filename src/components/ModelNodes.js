import { Fragment } from "react";
import { Handle, Position, NodeResizer } from "reactflow";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

const CustomToolTip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
    borderRadius: 5,
  },
}));

const AssetNode = ({ data, selected }) => {
  const { backgroundColor } = data;
  const selectedClass = selected ? "selected-node" : "";

  return (
    <>
      <CustomToolTip
        title={
          <Fragment>
            <Typography variant="h3" color="inherit">
              {data.label}
            </Typography>
          </Fragment>
        }
        placement="top"
        PopperProps={{ disablePortal: true }}
      >
        <NodeResizer
          color="#e53935"
          isVisible={selected ? true : false}
          minWidth={100}
          minHeight={30}
        />
        <div
          className={`asset-node ${selectedClass}`}
          style={{ backgroundColor }}
        />
      </CustomToolTip>
    </>
  );
};

function SubcomponentNode({ data, selected }) {
  const selectedClass = selected ? "selected-node" : "";
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className={`subcomponent-node ${selectedClass}`}>
        <Typography variant="body2">{data.label}</Typography>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}

export { SubcomponentNode, AssetNode };
