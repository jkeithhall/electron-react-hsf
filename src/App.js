import { useState, useEffect } from 'react';

import NavDrawer from './components/NavDrawer';
import Footer from './components/Footer';
import ScenarioParameters from './components/ScenarioParameters';
import TaskTable from './components/TaskTable';
import ModelEditor from './components/ModelEditor';
import ConfirmationModal from './components/ConfirmationModal';
import SaveConfirmationModal from './components/SaveConfirmationModal';
import ErrorModal from './components/ErrorModal';
import  { useNodesState, useEdgesState } from 'reactflow';

import { initSimulationInput, aeolusSimulationInput } from './aeolus_config/initSimulationInput';
import flattenedInitTasks from './aeolus_config/initTaskList';
import initModel from './aeolus_config/initModel';

import { parseModel } from './utils/parseModel';
import parseJSONFile from './utils/parseJSONFile';
import parseCSVFile from './utils/parseCSVFile';
import buildDownloadJSON from './utils/buildDownloadJSON';
import downloadCSV from './utils/downloadCSV';
import createNodesEdges from './utils/createNodesEdges';

const { systemComponents, systemDependencies, systemEvaluator, systemConstraints, componentIds } = parseModel(initModel);

export default function App() {
  // State variables
  const [activeStep, setActiveStep] = useState('Scenario');
  const [simulationInput, setSimulationInput] = useState(aeolusSimulationInput);
  const [taskList, setTaskList] = useState(flattenedInitTasks);

  const [componentList, setComponentList] = useState(systemComponents);
  const [dependencyList, setDependencyList] = useState(systemDependencies);
  const [evaluator, setEvaluator] = useState(systemEvaluator);
  const [constraints, setConstraints] = useState(systemConstraints);

  const { initialNodes, initialEdges } = createNodesEdges(componentList, dependencyList);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState(null);
  const [selectedFileContent, setSelectedFileContent] = useState(null);
  const [selectedFilePath, setSelectedFilePath] = useState(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [saveConfirmationModalOpen, setSaveConfirmationModalOpen] = useState(false);

  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [modelErrors, setModelErrors] = useState({});

  // Bundling state methods
  const setStateMethods = {
    setSimulationInput,
    setTaskList,
    setComponentList,
    setDependencyList,
    setEvaluator,
    setConstraints,
  };

  const navDrawerWidth = 220;
  const [ navOpen, setNavOpen ] = useState(true);

  const toggleNav = () => {
    setNavOpen(!navOpen);
  }

  // Called when user selects a file to open OR upload using the Electron File Menu
  const handleFileUpload = (fileType, fileName, content) => {
    setSelectedFileType(fileType);
    setSelectedFileContent(content);
    setSelectedFileName(fileName);
    setConfirmationModalOpen(true);
  };

  const handleFileOpen = (filePath, fileName, content) => {
    setSelectedFileType('SIM');
    setSelectedFileContent(content);
    setSelectedFileName(fileName);
    setSelectedFilePath(filePath);
    setConfirmationModalOpen(true);
  }

  const handleNewFile = () => {
    setHasUnsavedChanges(hasUnsavedChanges => {
      if (hasUnsavedChanges) {
        setSaveConfirmationModalOpen(true);
      } else {
        resetFile();
      }
    });
  };

  const resetFile = () => {
    setSimulationInput(initSimulationInput);
    setTaskList(flattenedInitTasks);
    setComponentList(systemComponents);
    setDependencyList(systemDependencies);
    setEvaluator(systemEvaluator);
    setConstraints(systemConstraints);
    setActiveStep('Scenario');
    setSaveConfirmationModalOpen(false);
    setHasUnsavedChanges(true);
    if (window.electronApi) {
      window.electronApi.resetCurrentFile();
    }
  }

  const handleFileDownload = async (fileType) => {
    if (fileType === 'CSV') {
      downloadCSV(setTaskList); // Downloads from front end (change to back end later?)
    } else {
      return await buildDownloadJSON(fileType, setStateMethods);  // Downloads from back end
    }
  };

  const handleSaveReset = () => {
    handleSaveFile(resetFile);
  }

  const handleDontSaveReset = () => {
    resetFile();
  }

  // Called when user confirms file selection
  const handleUploadConfirm = (fileType, filePath, fileName, content) => {
    // Parse file content
    try {
      switch(fileType) {
        case 'SIM':
          const parsedContent = parseJSONFile(fileType, content, setStateMethods);
          // If sim file, confirm file open
          window.electronApi.confirmFileOpened(filePath, parsedContent);
          break;
        case 'CSV':
          parseCSVFile(content, setTaskList);
          break;
        default:
          parseJSONFile(fileType, content, setStateMethods);
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

  const handleSaveFile = async (callback) => {
    if (window.electronApi) {
      const content = await buildDownloadJSON('SIM', setStateMethods);
      window.electronApi.saveCurrentFile(content);
      window.electronApi.onSaveConfirm(callback);
    }
  };

  const handleFileUpdate = (fileUpdateStatus) => {
    setHasUnsavedChanges(fileUpdateStatus);
  }

  useEffect(() => {
    // If running in Electron, register event handlers for menu bar file selection
    if (window.electronApi) {
      window.electronApi.onNewFile(handleNewFile);
      window.electronApi.onFileOpen(handleFileOpen);
      window.electronApi.onFileUpload(handleFileUpload);
      window.electronApi.onFileDownload(handleFileDownload);
      window.electronApi.onSaveFileClick(handleSaveFile);
      window.electronApi.onFileUpdate(handleFileUpdate);
    }
  }, []);  // Register event handlers only once: do not remove empty dependency array

  return (
    <NavDrawer
      navOpen={navOpen}
      toggleNav={toggleNav}
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      drawerWidth={navDrawerWidth}
      handleSaveFile={handleSaveFile}
      hasUnsavedChanges={hasUnsavedChanges}
      setStateMethods={setStateMethods}
    >
      <div className={`work-space ${navOpen ? 'work-space-nav-open' : 'work-space-nav-closed'}`} >
        {{'Scenario':
            <ScenarioParameters
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              simulationInput={simulationInput}
              setSimulationInput={setSimulationInput}
              setStateMethods={setStateMethods}
              setHasUnsavedChanges={setHasUnsavedChanges}
              componentList={componentList}
            />,
          'Tasks':
            <TaskTable
              navOpen={navOpen}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              setStateMethods={setStateMethods}
              taskList={taskList}
              setTaskList={setTaskList}
              setHasUnsavedChanges={setHasUnsavedChanges}
            />,
          'System Model':
            <ModelEditor
              navOpen={navOpen}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              pythonSrc={simulationInput.dependencies.pythonSrc}
              setStateMethods={setStateMethods}
              componentList={componentList}
              setComponentList={setComponentList}
              dependencyList={dependencyList}
              setDependencyList={setDependencyList}
              nodes={nodes}
              edges={edges}
              setNodes={setNodes}
              setEdges={setEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              setHasUnsavedChanges={setHasUnsavedChanges}
              modelErrors={modelErrors}
              setModelErrors={setModelErrors}
              componentIds={componentIds}
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
                onConfirm={() => handleUploadConfirm(selectedFileType, selectedFilePath, selectedFileName, selectedFileContent)}
                onCancel={handleUploadCancel}
                confirmText={'Confirm'}
                cancelText={'Cancel'}
              />
            </div>)
          }
          {
            saveConfirmationModalOpen && (
            <div className='stacking-context'>
              <SaveConfirmationModal
                onSaveConfirm={handleSaveReset}
                onDontSaveConfirm={handleDontSaveReset}
                onClose={() => setSaveConfirmationModalOpen(false)}
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
      <Footer/>
      </div>
    </NavDrawer>
  );
}

