import { Handle, Position } from '@xyflow/react';
import Tooltip from '@mui/material/Tooltip';

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

function DependencyNode({ data, selected }) {
  const { component, assetName } = data;

  const Icon = iconMap[component.className.toLowerCase()] || HelpCenterIcon;

  return (
    <Tooltip title={`${component.name} (${assetName})`}>
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        isConnectableStart={false}
        isConnectableEnd={true}
        style={{ visibility: 'hidden' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        isConnectableStart={true}
        isConnectableEnd={false}
        />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        isConnectableStart={true}
        isConnectableEnd={false}
        />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom"
        isConnectableStart={false}
        isConnectableEnd={true}
        style={{ visibility: 'hidden' }}
      />
      <div className={`dependency-node ${selected ? 'selected-node' : ''}`}>
        <Icon sx={{ color: '#FFFFFF' }}/>
      </div>
    </Tooltip>
  );
}

export { DependencyNode };