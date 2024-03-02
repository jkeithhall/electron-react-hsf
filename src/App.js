import { useState, useEffect } from 'react';

import NavDrawer from './components/NavDrawer';
import Footer from './components/Footer';
import ScenarioParameters from './components/ScenarioParameters';
import TaskTable from './components/TaskTable';
import ModelEditor from './components/ModelEditor';
import ConfirmationModal from './components/ConfirmationModal';
import ErrorModal from './components/ErrorModal';
import Box from '@mui/material/Box';

import initSimulationInput from './aeolus_config/initSimulationInput';
import flattenedInitTasks from './aeolus_config/initTaskList';
import initModel from './aeolus_config/initModel';

import parseJSONFile from './utils/parseJSONFile';
import parseCSVFile from './utils/parseCSVFile';
import buildDownloadJSON from './utils/buildDownloadJSON';

export default function App() {
  // State variables
  const [activeStep, setActiveStep] = useState('Scenario');
  const [simulationInput, setSimulationInput] = useState(initSimulationInput);
  const [taskList, setTaskList] = useState(flattenedInitTasks);
  const [model, setModel] = useState(initModel);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState(null);
  const [selectedFileContent, setSelectedFileContent] = useState(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  // Bundling state methods
  const setStateMethods = {
    setSimulationInput,
    setTaskList,
    setModel
  };

  const navDrawerWidth = 220;
  const [ navOpen, setNavOpen ] = useState(true);

  const toggleNav = () => {
    setNavOpen(!navOpen);
  }

  // Called when user selects a file to open _OR_ upload using the Electron File Menu
  const handleFileUpload = (fileType, fileContent, fileName) => {
    setSelectedFileType(fileType);
    setSelectedFileContent(fileContent);
    setSelectedFileName(fileName);
    setConfirmationModalOpen(true);
  };

  const handleFileDownload = (fileType) => {
    return buildDownloadJSON(fileType, setStateMethods);
  };

  // Called when user confirms file selection
  const handleUploadConfirm = (fileType, fileContent, fileName) => {
    // Parse file content
    try {
      switch(fileType) {
        case 'SIM':
          parseJSONFile(fileType, fileContent, setStateMethods);
          // If sim file, confirm file open
          window.electronApi.confirmFileOpened();
          break;
        case 'CSV':
          parseCSVFile(fileContent, setTaskList);
          break;
        default:
          parseJSONFile(fileType, fileContent, setStateMethods);
      }
    } catch (error) {
      // If error, display error modal
      setErrorMessage(error.message);
      setErrorModalOpen(true);
    } finally {
      // Always close modal and reset selected file
      setSelectedFileContent(null);
      setSelectedFileName(null);
      setConfirmationModalOpen(false);
    }
  }

  // Called when user cancels file selection
  const handleUploadCancel = () => {
    // Close modal and reset selected file
    setSelectedFileContent(null);
    setSelectedFileName(null);
    setConfirmationModalOpen(false);
  }

  useEffect(() => {
    // If running in Electron, register event handlers for menu bar file selection
    if (window.electronApi) {
      window.electronApi.onFileOpen(handleFileUpload);
      window.electronApi.onFileUpload(handleFileUpload);
      window.electronApi.onFileDownload(handleFileDownload);
    }
  }, []);

  return (
    <NavDrawer
      navOpen={navOpen}
      toggleNav={toggleNav}
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      drawerWidth={navDrawerWidth}
    >
      <Box
        className='work-space'
        sx={{ width: `calc(100vw - ${navOpen ? 220 : 60}px)`, maxWidth: `calc(100vw - ${navOpen ? 220 : 60}px)`}}>
        {{'Scenario':
            <ScenarioParameters
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              simulationInput={simulationInput}
              setSimulationInput={setSimulationInput}
              setStateMethods={setStateMethods}
            />,
          'Tasks':
            <TaskTable
              navOpen={navOpen}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              setStateMethods={setStateMethods}
              taskList={taskList}
              setTaskList={setTaskList}
            />,
          'System Model':
            <ModelEditor
              navOpen={navOpen}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              setStateMethods={setStateMethods}
              model={model}
              setModel={setModel}
            />,
          'Dependencies': <></>,
          'Constraints': <></>,
          'Simulate': <></>,
          'Analyze': <></>
          }[activeStep]}
          {
            confirmationModalOpen && (
            <div className='stacking-context'>
              <ConfirmationModal
                title={'Overwrite parameters?'}
                message={'Are you sure you want to overwrite with current file?'}
                onConfirm={() => handleUploadConfirm(selectedFileType, selectedFileContent, selectedFileName)}
                onCancel={handleUploadCancel}
              />
            </div>)
          }
          {
            errorModalOpen && (
            <div className='stacking-context'>
              <ErrorModal
                title={Error}
                message={errorMessage}
                onConfirm={() => setErrorModalOpen(false)}
              />
            </div>)
          }
      </Box>
      <Footer/>
    </NavDrawer>
  );
}

