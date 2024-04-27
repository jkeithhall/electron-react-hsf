import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import AddBoxIcon from '@mui/icons-material/AddBox';
import MarginTwoToneIcon from '@mui/icons-material/MarginTwoTone';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

const hoverSX = {
  '&:hover': {
    color: 'primary.main',
  },
};

export default function AddComponentDial({ onLayout, handleNewNodeClick }) {
  const handleAutoLayoutClick = (e) => {
    if (e.shiftKey) { // If shift key is pressed, layout the graph horizontally
      onLayout('LR');
    } else { // Otherwise, layout the graph vertically
      onLayout('TB');
    }
  }


  return (
    <SpeedDial
      ariaLabel="SpeedDial"
      direction="down"
      FabProps={{ size: 'medium', color: 'primary' }}
      icon={<SpeedDialIcon />}
    >
      <SpeedDialAction
        key={'Autolayout'}
        icon={<AutoFixHighIcon color="secondary" sx={hoverSX}/>}
        tooltipTitle={'Autolayout'}
        tooltipPlacement="right"
        enterDelay={500}
        onClick={handleAutoLayoutClick}
      />
      <SpeedDialAction
        key={'Add Subcomponent'}
        icon={<AddBoxIcon color="secondary" sx={hoverSX}/>}
        tooltipTitle={'Add Subcomponent'}
        tooltipPlacement="right"
        enterDelay={500}
        onClick={() => { handleNewNodeClick('subComponent') }}
      />
      <SpeedDialAction
        key={'Add Asset'}
        icon={<MarginTwoToneIcon color="secondary" sx={hoverSX}/>}
        tooltipTitle={'Add Asset'}
        tooltipPlacement="right"
        enterDelay={500}
        onClick={() => { handleNewNodeClick('asset') }}
      />
    </SpeedDial>
  );
}