import { Fragment } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import CellTowerIcon from '@mui/icons-material/CellTower';
import RadarIcon from '@mui/icons-material/Radar';
import SdStorageIcon from '@mui/icons-material/SdStorage';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';

const iconMap = {
  power: BatteryChargingFullIcon,
  comm: CellTowerIcon,
  eosensor: RadarIcon,
  ssdr: SdStorageIcon,
  adcs: ThreeDRotationIcon,
};

const CustomToolTip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
    borderRadius: 5,
  },
}));

const AssetNode = ({ data, selected }) => {
  const { backgroundColor } = data;
  const selectedClass = selected ? 'selected-node' : '';

  return (
    <>
      <CustomToolTip
        title={
          <Fragment>
            <Typography variant="h3" color="inherit">{data.label}</Typography>
          </Fragment>
        }
        placement="top"
        PopperProps={{ disablePortal: true }}
      >
          <NodeResizer color="#e53935" isVisible={selected} minWidth={100} minHeight={30}/>
          <div className={`asset-node ${selectedClass}`} style={{ backgroundColor }}/>
      </CustomToolTip>
    </>
  );
};

function SubcomponentNode({ data, selected }) {
  const selectedClass = selected ? 'selected-node' : '';
  return (
    <>
      <Handle type="source" position={Position.Top} />
      <div className={`subcomponent-node ${selectedClass}`}>
        <Typography variant="body2">{data.label}</Typography>
      </div>
      <Handle type="target" position={Position.Bottom} />
    </>
  );
}

function DependencyNode({ data, selected }) {
  const { component, assetName } = data;

  const Icon = iconMap[component.className.toLowerCase()] || HelpCenterIcon;

  return (
    <Tooltip title={`${component.name} (${assetName})`}>
      <>
        <Handle type="target" position={Position.Top}/>
        <Handle type="source" position={Position.Right}/>
        <Handle type="source" position={Position.Left}/>
        <Handle type="target" position={Position.Bottom}/>
        <div className={`dependency-node ${selected ? 'selected-node' : ''}`}>
          <Icon sx={{ color: '#FFFFFF' }}/>
        </div>
      </>
    </Tooltip>
  );
}

export { DependencyNode, SubcomponentNode, AssetNode };