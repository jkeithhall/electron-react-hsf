import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import AddBoxIcon from '@mui/icons-material/AddBox';
import MarginTwoToneIcon from '@mui/icons-material/MarginTwoTone';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

const hoverSX = {
  '&:hover': {
    color: 'primary.main',
  },
};

export default function AddComponentDial({ componentList, onLayout, handleNewNodeClick }) {
  const assetCount = componentList.filter((component) => component.parent === undefined).length;

  const handleAutoLayoutClick = (e) => {
    if (e.shiftKey) { // If shift key is pressed, layout horizontally
      if (e.altKey) { // If option/alt key is pressed, layout left to right
        onLayout('LR');
      } else { // Else, layout right to left
        onLayout('RL');
      }
    } else { // Default is vertical layout
      if (e.altKey) { // If option/alt key is pressed, layout top to bottom
        onLayout('TB');
      } else { // Default is bottom to top
        onLayout('BT');
      }
    }
  };

  // Determine the key name for the alt key based on the user's OS
  const altKeyName = navigator.userAgent.indexOf('Mac') !== -1 ? 'Option' : 'Alt';

  const CustomWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 150,
    },
  });
  const AutoLayoutIcon =  <CustomWidthTooltip
                            title={`+Shift horizontal layout +${altKeyName} change direction`}
                            placement="top"
                            enterDelay={2000}
                            enterNextDelay={1000}
                          >
                            <AutoFixHighIcon color="secondary" sx={hoverSX}/>
                          </CustomWidthTooltip>;

  return (
    <SpeedDial
      ariaLabel="SpeedDial"
      direction="down"
      FabProps={{ size: 'medium', color: 'primary' }}
      icon={<SpeedDialIcon />}
    >
      <SpeedDialAction
        key={'Autolayout'}
        icon={AutoLayoutIcon}
        tooltipTitle={'Autolayout'}
        tooltipPlacement="right"
        enterDelay={500}
        onClick={handleAutoLayoutClick}
      />
      {assetCount > 0 && <SpeedDialAction
        key={'Add Subcomponent'}
        icon={<AddBoxIcon color="secondary" sx={hoverSX}/>}
        tooltipTitle={'Add Subcomponent'}
        tooltipPlacement="right"
        enterDelay={500}
        onClick={() => { handleNewNodeClick('newComponentEditor') }}
      />}
      <SpeedDialAction
        key={'Add Asset'}
        icon={<MarginTwoToneIcon color="secondary" sx={hoverSX}/>}
        tooltipTitle={'Add Asset'}
        tooltipPlacement="right"
        enterDelay={500}
        onClick={() => { handleNewNodeClick('newAssetEditor') }}
      />
    </SpeedDial>
  );
}