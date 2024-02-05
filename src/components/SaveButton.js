import { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { buildScenarioBlob, buildTaskBlob } from '../utils/buildDownloadBlobs';
import downloadBlob from '../utils/downloadBlob';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

export default function SaveButton({activeStep, sources, simulationParameters, schedulerParameters, taskList, setStateMethods}) {
  // State variables for form validation and errors
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleSaveButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSaveButtonClose = () => {
    setAnchorEl(null);
  };
  // TODO: Implement handleDownload and handleSaveToCloud
  const handleDownload = () => {
    if (activeStep === 'Scenario') {
      const fileName = 'sources.json';
      buildScenarioBlob(sources, simulationParameters, schedulerParameters)
      .then(blob => downloadBlob(blob, fileName));
    } if (activeStep === 'Tasks') {
      const fileName = 'tasks.json';
      buildTaskBlob(taskList)
      .then(blob => downloadBlob(blob, fileName));
    }
    setAnchorEl(null);
  }

  // TO DO: Implement handleSaveToCloud
  const handleSaveToCloud = () => {
    setAnchorEl(null);
  }

  return (
    <>
      <Button
        id="demo-customized-button"
        aria-controls={open ? 'save-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleSaveButtonClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Save
      </Button>
      <StyledMenu
        id="save-menu"
        MenuListProps={{
          'aria-labelledby': 'save-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleSaveButtonClose}
      >
        <MenuItem onClick={handleDownload} disableRipple>
          <FileDownloadIcon />
          Download
        </MenuItem>
        <MenuItem onClick={handleSaveToCloud} disableRipple>
          <CloudUploadIcon />
          Save to cloud
        </MenuItem>
      </StyledMenu>
    </>
  )
}