import { useState } from 'react';

import ConfirmationModal from './ConfirmationModal';
import ErrorModal from './ErrorModal';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import UploadFileIcon from '@mui/icons-material/UploadFile';

import parseJSONFile from '../utils/parseJSONFile';

export default function FileSelector({activeStep, setStateMethods}) {
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [selectedFileContent, setSelectedFileContent] = useState(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  // Called when user selects a file
  const handleFileChange = (e) => {
    const fileInput = e.target;

    if (fileInput.files.length > 0) {
      const selectedFile = fileInput.files[0];
      const reader = new FileReader();

      // When file is read, update state with selected file and open confirmation modal
      reader.onload = (e) => {
        const fileContent = e.target.result;
        setSelectedFileContent(fileContent);
        setSelectedFileName(selectedFile.name);
        setConfirmationModalOpen(true);
      };

      // Read file as text
      reader.readAsText(selectedFile);
    }
  }

  // Called when user confirms file selection
  const handleConfirm = (fileContent, fileName) => {
    // Parse file content
    try {
      parseJSONFile(activeStep, fileContent, setStateMethods);
    } catch (error) {
      // If error, log error
      console.log(error);
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
    <div className='file-selection-header'>
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
          startIcon={<UploadFileIcon />}
        >Choose File</Button>
      </label>
      {confirmationModalOpen && (
      <div className='stacking-context'>
        <ConfirmationModal
          title={'Overwrite parameters?'}
          message={`Are you sure you want to overwrite with current file?`}
          onConfirm={() => handleConfirm(selectedFileContent, selectedFileName)}
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
    </div>
  )
}