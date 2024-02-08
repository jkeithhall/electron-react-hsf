import { useState, useEffect } from 'react';

import ConfirmationModal from './ConfirmationModal';
import ErrorModal from './ErrorModal';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import UploadFileIcon from '@mui/icons-material/UploadFile';

import parseJSONFile from '../utils/parseJSONFile';

export default function FileSelector({activeStep, setStateMethods}) {
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState(null);
  const [selectedFileContent, setSelectedFileContent] = useState(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  // Called when user selects a file using the in-browser upload button
  const handleFileChange = (e) => {
    const fileInput = e.target;

    if (fileInput.files.length > 0) {
      const selectedFile = fileInput.files[0];
      const reader = new FileReader();

      // When file is read, call handleFileSelect with file content
      reader.onload = (e) => {
        const fileContent = e.target.result;
        const fileName = selectedFile.name;
        handleFileUpload(activeStep, fileContent, fileName);
      };

      // Read file as text
      reader.readAsText(selectedFile);
    }
  }

  // Called when user selects a file using the Electron File Menu or the in-browser upload button
  const handleFileUpload = (fileType, fileContent, fileName) => {
    // TO DO: Check file contents for validity prior to confirmation modal
    setSelectedFileType(fileType);
    setSelectedFileContent(fileContent);
    setSelectedFileName(fileName);
    setConfirmationModalOpen(true);
  };

  /*
    useEffect runs upon component mount. It sends to the main process the handleFileUpload function,
    to be called when a file is selected from a dialog box prompted by the Electron File Menu.
  */
  useEffect(() => {
    // If running in Electron, register handleFileUpload as event handler for menu bar file selection
    if (window.electronApi) window.electronApi.onFileUpload(handleFileUpload);
  }, []); // Run once on component mount

  // Called when user confirms file selection
  const handleConfirm = (fileType, fileContent, fileName) => {
    // Parse file content
    try {
      parseJSONFile(fileType, fileContent, setStateMethods);
    } catch (error) {
      // If error, display error modal
      setErrorMessage(error.message);
      setErrorModalOpen(true);
    } finally {
      // Always close modal and reset selected file
      setSelectedFileContent(null);
      setSelectedFileName(null);
      setConfirmationModalOpen(false);

      // Reset file input field so that new file can be selected
      const fileInput = document.getElementById('fileInput');
      if (fileInput) {
        fileInput.value = '';
      }
    }
  }

  // Called when user cancels file selection
  const handleCancel = () => {
    // Close modal and reset selected file
    setSelectedFileContent(null);
    setSelectedFileName(null);
    setConfirmationModalOpen(false);

    // Reset file input field so that new file can be selected
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.value = '';
    }
  }


  return (
    <>
      <Input
        type="file"
        id='fileInput'
        onChange={handleFileChange}
        style={{ display: 'none' }}
        mx={3}
      />
      <label htmlFor='fileInput'>
        <Button
          variant="contained"
          component="span"
          startIcon={<UploadFileIcon />}>
          Upload File
        </Button>
      </label>
      {confirmationModalOpen && (
      <div className='stacking-context'>
        <ConfirmationModal
          title={'Overwrite parameters?'}
          message={`Are you sure you want to overwrite with current file?`}
          onConfirm={() => handleConfirm(selectedFileType, selectedFileContent, selectedFileName)}
          onCancel={handleCancel}
        />
      </div>)}
      {errorModalOpen && (
      <div className='stacking-context'>
        <ErrorModal
          title={Error}
          message={errorMessage}
          onConfirm={() => setErrorModalOpen(false)}
        />
      </div>)}
    </>
  )
}