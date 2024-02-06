import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import StyledMenu from './StyledMenu';
import MenuItem from '@mui/material/MenuItem';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { buildScenarioBlob, buildTaskBlob } from '../utils/buildDownloadBlobs';
import downloadBlob from '../utils/downloadBlob';

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

  const handleDownload = () => {
    if (activeStep === 'Scenario') {
      const fileName = 'sources.json';
      buildScenarioBlob(sources, simulationParameters, schedulerParameters)
      .then(blob => downloadBlob(blob, fileName));
    } if (activeStep === 'Tasks') {
      const fileName = 'tasks.json';
      buildTaskBlob(taskList)
      .then(blob => downloadBlob(blob, fileName));
    } // TO DO: Implement handleDownload for other activeSteps
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