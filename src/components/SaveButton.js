import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import StyledMenu from './StyledMenu';
import MenuItem from '@mui/material/MenuItem';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import buildDownloadBlob from '../utils/buildDownloadBlob';
import downloadBlob from '../utils/downloadBlob';
import buildDownloadJSON from '../utils/buildDownloadJSON';

export default function SaveButton({activeStep, activeStepState}) {
  // State variables for form validation and errors
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleSaveButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSaveButtonClose = () => {
    setAnchorEl(null);
  };

  const handleDownloadClick = () => {
    // If running in Electron, use Electron's saveFile function
    if (window.electronApi) {
      const content = buildDownloadJSON(activeStep, activeStepState);
      window.electronApi.saveFile(content);
    } else {
      // Otherwise, use the in-browser downloadBlob function
      const fileName = `${activeStep.toLowerCase()}.json`;
      buildDownloadBlob(activeStep, activeStepState)
      .then(blob => downloadBlob(blob, fileName));
    }
    // Close the menu
    handleSaveButtonClose();
  }

  // TO DO: Implement handleSaveToCloud
  const handleSaveToCloud = () => {
    handleSaveButtonClose();
  }

  // Register event handler for menu bar file download click
  useEffect(() => {
    if (window.electronApi) {
      window.electronApi.onFileDownload((fileType) => {
        return buildDownloadJSON(fileType, activeStepState);
      });
    }
  }, []); // Run once on component mount

  return (
    <>
      <Button
        color="light"
        variant="contained"
        disableElevation
        onClick={handleSaveButtonClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Save
      </Button>
      <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleSaveButtonClose}
      >
        <MenuItem onClick={handleDownloadClick} disableRipple>
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