import { Handle, Position, NodeResizer } from 'reactflow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import CellTowerIcon from '@mui/icons-material/CellTower';
import RadarIcon from '@mui/icons-material/Radar';
import SdStorageIcon from '@mui/icons-material/SdStorage';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';

const iconMap = {
  power: BatteryChargingFullIcon,
  comm: CellTowerIcon,
  eosensor: RadarIcon,
  ssdr: SdStorageIcon,
  adcs: ThreeDRotationIcon,
};

const AssetNode = ({ data, selected }) => {
  const selectedClass = selected ? 'selected-node' : '';
  return (
    <>
      <NodeResizer color="#e53935" isVisible={selected} minWidth={100} minHeight={30} />
      <div className={`asset-node ${selectedClass}`}>
        <Typography variant="h2">{data.label}</Typography>
        <Typography variant="h2">{data.label}</Typography>
      </div>
    </>
  );
};

function DependencyNode({ data, selected }) {
  const { status, fromClassName, toolTipLabel } = data;
  const Icon = iconMap[fromClassName.toLowerCase()];
  const title = status === 'inapplicable' ? toolTipLabel.split('→')[0] : toolTipLabel;
  const selectedClass = selected && status !== 'inapplicable' ? 'selected-node' : '';

  return (
    <Tooltip title={title}>
      <div className={`dependency-node ${status}-node ${selectedClass}`}>
        {status === 'inapplicable' && <Icon sx={{ color: '#FFFFFF' }}/>}
      </div>
    </Tooltip>
  );
}

function SubcomponentNode({ data, selected }) {
  const selectedClass = selected ? 'selected-node' : '';
  return (
    <>
      <Handle type="source" position={Position.Top} />
      <div className={`subcomponent-node ${selectedClass}`}>
        <Typography variant="body2">{data.label}</Typography>
      </div>
      <Handle type="target" position={Position.Bottom} id="a" />
    </>
  );
}

export { DependencyNode, SubcomponentNode, AssetNode };