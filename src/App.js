import { useState, useEffect, useMemo, useRef } from 'react';

import NavDrawer from './components/NavDrawer';
import Footer from './components/Footer';
import ScenarioParameters from './components/ScenarioParameters';
import TaskTable from './components/TaskTable';
import ModelGraph from './components/ModelGraph';
import DependencyGraph from './components/DependencyGraph';
import ConstraintsTable from './components/ConstraintsTable';
import SimulateStep from './components/SimulateStep';
import Analyze from './components/Analyze';
import ConfirmationModal from './components/ConfirmationModal';
import SaveConfirmationModal from './components/SaveConfirmationModal';
import ErrorModal from './components/ErrorModal';
import { useNodesState, useEdgesState } from 'reactflow';

import { initSimulationInput, aeolusSimulationInput } from './aeolus_config/initSimulationInput';
import flattenedInitTasks from './aeolus_config/initTaskList';
import initModel from './aeolus_config/initModel';

import { parseModel } from './utils/parseModel';
import parseJSONFile from './utils/parseJSONFile';
import parseCSVFile from './utils/parseCSVFile';
import buildDownloadJSON from './utils/buildDownloadJSON';
import downloadCSV from './utils/downloadCSV';
import { createModelNodesEdges } from './utils/createModelNodesEdges';

const { systemComponents, systemDependencies, systemEvaluator, systemConstraints } = parseModel(initModel);

export default function App() {
  // Scenario and Tasks state variables
  const [activeStep, setActiveStep] = useState('Scenario');
  const [simulationInput, setSimulationInput] = useState(aeolusSimulationInput);
  const [taskList, setTaskList] = useState(flattenedInitTasks);

  // Model state variables
  const [componentList, setComponentList] = useState(systemComponents);
  const [dependencyList, setDependencyList] = useState(systemDependencies);
  const [evaluator, setEvaluator] = useState(systemEvaluator);
  const [constraints, setConstraints] = useState(systemConstraints);

  // React Flow state variables
  const { initialNodes, initialEdges } = createModelNodesEdges(componentList, dependencyList);
  const [modelNodes, setModelNodes, onModelNodesChange] = useNodesState(initialNodes);
  const [modelEdges, setModelEdges, onModelEdgesChange] = useEdgesState(initialEdges);

  const [filePath, setFilePath] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [confirmationHandler, setConfirmationHandler] = useState(() => {});
  const [saveConfirmationModalOpen, setSaveConfirmationModalOpen] = useState(false);

  // TO DO: Create context provider for all errors
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [scenarioErrors, setScenarioErrors] = useState({});
  const [taskErrors, setTaskErrors] = useState({});
  const [modelErrors, setModelErrors] = useState({});
  const [dependencyErrors, setDependencyErrors] = useState({});
  const [constraintErrors, setConstraintErrors] = useState({});

  // States saved in file download/save
  const appState = useMemo(() => ({
    simulationInput,
    taskList,
    componentList,
    dependencyList,
    evaluator,
    constraints,
    modelNodes,
    modelEdges,
  }), [
    simulationInput,
    taskList,
    componentList,
    dependencyList,
    evaluator,
    constraints,
    modelNodes,
    modelEdges
  ]);

  // Bundling state methods
  const setAppStateMethods = {
    setSimulationInput,
    setTaskList,
    setComponentList,
    setDependencyList,
    setEvaluator,
    setConstraints,
    setModelNodes,
    setModelEdges,
  };

  const setValidationErrors = {
    setScenarioErrors,
    setTaskErrors,
    setModelErrors,
    setDependencyErrors,
    setConstraintErrors,
  }

  const navDrawerWidth = 220;
  const [ navOpen, setNavOpen ] = useState(true);
  const toggleNav = () => {
    setNavOpen(!navOpen);
  }

  // Called when user selects a file to open OR upload using the Electron File Menu
  function handleFileUpload(fileType, fileName, content, componentList, pythonSrc) {
    setConfirmationHandler(() => () => {
      handleUploadConfirm(
        fileType,
        null,
        fileName,
        content,
        componentList,
        pythonSrc);
    });
    setConfirmationModalOpen(true);
  };

  function handleFileOpen(filePath, fileName, content) {
    setConfirmationHandler(() => () => openSimFile(filePath, content));
    setConfirmationModalOpen(true);
  }

  function handleNewFile() {
    setHasUnsavedChanges(hasUnsavedChanges => {
      if (hasUnsavedChanges) {
        setSaveConfirmationModalOpen(true);
      } else {
        resetFile();
      }
      return hasUnsavedChanges;
    });
  }

  function resetFile() {
    setSimulationInput(initSimulationInput);
    setTaskList(flattenedInitTasks);
    setComponentList(systemComponents);
    setDependencyList(systemDependencies);
    setEvaluator(systemEvaluator);
    setConstraints(systemConstraints);
    setActiveStep('Scenario');
    setSaveConfirmationModalOpen(false);
    setFilePath('');
    setHasUnsavedChanges(false);
    if (window.electronApi) {
      window.electronApi.resetCurrentFile();
    }
  }

  function handleDontSaveReset() {
    resetFile();
  }

  // Called when user confirms file selection
  function handleUploadConfirm(
    fileType,
    filePath,
    fileName,
    content,
    componentList,
    pythonSrc,
  ) {
    // Parse file content
    try {
      switch(fileType) {
        case 'Scenario':
          parseJSONFile(fileType, content, setAppStateMethods, setValidationErrors, componentList);
          setActiveStep('Scenario');
          break;
        case 'Tasks':
          parseJSONFile(fileType, content, setAppStateMethods, setValidationErrors);
          setActiveStep('Tasks');
          break;
        case 'System Model':
          parseJSONFile(
            fileType,
            content,
            setAppStateMethods,
            setValidationErrors,
            componentList,
            pythonSrc,
            updateModelGraph
          );
          setActiveStep('System Model');
          break;
        case 'CSV':
          parseCSVFile(content, setTaskList, setTaskErrors);
          setActiveStep('Tasks');
          break;
        default:
          throw new Error('Invalid file type');
      }
    } catch (error) {
      // If error, display error modal
      setErrorMessage(error.message);
      setErrorModalOpen(true);
    } finally {
      // Always close modal and reset selected file
      setConfirmationModalOpen(false);
      setConfirmationHandler(() => {});
    }
  }

  // Called when user cancels file selection
  function handleUploadCancel() {
    // Close modal and reset selected file
    setConfirmationModalOpen(false);
    setConfirmationHandler(() => {});
  }

  function openSimFile(filePath, content) {
    try {
      parseJSONFile('SIM', content, setAppStateMethods, setValidationErrors, componentList);
      setFilePath(filePath);
      setHasUnsavedChanges(false);
      window.electronApi.confirmFileOpened(filePath, content);
    } catch (error) {
      // If error, display error modal
      setErrorMessage(error.message);
      setErrorModalOpen(true);
    } finally {
      // Always close modal and reset selected file
      setConfirmationModalOpen(false);
      setConfirmationHandler(() => {});
      setActiveStep('Scenario');
    }
  }

  function handleFileUpdate(fileUpdateStatus) {
    setHasUnsavedChanges(fileUpdateStatus);
    if (window.electronApi) {
      window.electronApi.hasUnsavedChanges(fileUpdateStatus);
    }
  }

  function updateModelGraph(componentList, dependencyList) {
    const { initialNodes, initialEdges } = createModelNodesEdges(componentList, dependencyList);
    setModelNodes(initialNodes);
    setModelEdges(initialEdges);
  }

  async function handleSaveFile(callback, updateCache, appState) {
    if (window.electronApi) {
      const {
        simulationInput,
        taskList,
        componentList,
        dependencyList,
        evaluator,
        constraints,
        modelNodes,
        modelEdges,
      } = appState;

      const content = JSON.stringify({
        simulationInput,
        taskList,
        componentList,
        dependencyList,
        evaluator,
        constraints,
        modelNodes,
        modelEdges,
      }, null, 2);
      window.electronApi.saveCurrentFile(content, updateCache);
      window.electronApi.onSaveConfirm(setFilePath, setHasUnsavedChanges, callback);
    }
  };

  function handleSaveReset(resetFile, appState) {
    handleSaveFile(resetFile, true, appState);
  }

  async function handleFileDownload(fileType, appState) {
    if (fileType === 'CSV') {
      downloadCSV(appState.taskList);
    } else {
      return await buildDownloadJSON(fileType, appState);
    }
  };

  useEffect(() => {
    if (window.electronApi) {
      // Register event handlers on initial render and notify Electron that React has rendered
      window.electronApi.onNewFile(handleNewFile);
      window.electronApi.onFileOpen(handleFileOpen);
      window.electronApi.onFileUpdate(handleFileUpdate);
      window.electronApi.onRevert(openSimFile);
      window.electronApi.notifyRenderComplete();
    }
  }, []);  // Register event handlers only on first render (empty dependency array)

  useEffect(() => {
    setHasUnsavedChanges(true);
    if (window.electronApi) {
      window.electronApi.onFileUpload(handleFileUpload, componentList, simulationInput.dependencies.pythonSrc);
      window.electronApi.hasUnsavedChanges(true);
      window.electronApi.onSaveFileClick(handleSaveFile, () => {}, true, appState);
      window.electronApi.onAutoSave(handleSaveFile, () => {}, true, appState);
      window.electronApi.onFileDownload(handleFileDownload, appState);
    }
  }, [appState]); // Re-register file menu event handlers when appState changes

  useEffect(() => {
    updateModelGraph(componentList, dependencyList);
  }, [dependencyList]); // Update model nodes and edges when dependency list changes

  return (
    <NavDrawer
      navOpen={navOpen}
      toggleNav={toggleNav}
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      drawerWidth={navDrawerWidth}
      handleSaveFile={handleSaveFile}
      appState={appState}
      filePath={filePath}
      hasUnsavedChanges={hasUnsavedChanges}
    >
      <div className={`work-space ${navOpen ? 'work-space-nav-open' : 'work-space-nav-closed'}`} >
        {{'Scenario':
            <ScenarioParameters
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              simulationInput={simulationInput}
              setSimulationInput={setSimulationInput}
              componentList={componentList}
              evaluator={evaluator}
              setEvaluator={setEvaluator}
              formErrors={scenarioErrors}
              setFormErrors={setScenarioErrors}
            />,
          'Tasks':
            <TaskTable
              navOpen={navOpen}
              taskList={taskList}
              setTaskList={setTaskList}
              taskErrors={taskErrors}
              setTaskErrors={setTaskErrors}
            />,
          'System Model':
            <ModelGraph
              navOpen={navOpen}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              pythonSrc={simulationInput.dependencies.pythonSrc}
              componentList={componentList}
              setComponentList={setComponentList}
              dependencyList={dependencyList}
              setDependencyList={setDependencyList}
              constraints={constraints}
              setConstraints={setConstraints}
              setEvaluator={setEvaluator}
              nodes={modelNodes}
              edges={modelEdges}
              setNodes={setModelNodes}
              setEdges={setModelEdges}
              onNodesChange={onModelNodesChange}
              onEdgesChange={onModelEdgesChange}
              modelErrors={modelErrors}
              setModelErrors={setModelErrors}
              constraintErrors={constraintErrors}
              setConstraintErrors={setConstraintErrors}
              setErrorModalOpen={setErrorModalOpen}
              setErrorMessage={setErrorMessage}
            />,
          'Dependencies':
            <DependencyGraph
              navOpen={navOpen}
              componentList={componentList}
              dependencyList={dependencyList}
              setDependencyList={setDependencyList}
              dependencyErrors={dependencyErrors}
              setDependencyErrors={setDependencyErrors}
            />,
          'Constraints':
            <ConstraintsTable
              navOpen={navOpen}
              constraints={constraints}
              setConstraints={setConstraints}
              componentList={componentList}
              constraintErrors={constraintErrors}
              setConstraintErrors={setConstraintErrors}
            />,
          'Simulate':
            <SimulateStep
              navOpen={navOpen}
              setErrorMessage={setErrorMessage}
              setErrorModalOpen={setErrorModalOpen}
              setActiveStep={setActiveStep}
              appState={appState}
              outputPath={simulationInput.dependencies.outputPath}
              scenarioErrors={scenarioErrors}
              tasksErrors={taskErrors}
              modelErrors={modelErrors}
              dependencyErrors={dependencyErrors}
              constraintsErrors={constraintErrors}
              taskList={taskList}
              componentList={componentList}
              dependencyList={dependencyList}
              constraints={constraints}
              evaluator={evaluator}
            />,
          'Analyze': <Analyze
            outputPath={simulationInput.dependencies.outputPath}
            lastStartJD={simulationInput.simulationParameters.startJD}
          />,
          }[activeStep]}
          {
            confirmationModalOpen && (
            <div className='stacking-context'>
              <ConfirmationModal
                title={'Overwrite parameters?'}
                message={'Are you sure you want to overwrite with the current file?'}
                onConfirm={confirmationHandler}
                onCancel={() => handleUploadCancel()}
                confirmText={'Confirm'}
                cancelText={'Cancel'}
              />
            </div>)
          }
          {
            saveConfirmationModalOpen && (
            <div className='stacking-context'>
              <SaveConfirmationModal
                onSaveConfirm={() => handleSaveReset(resetFile, appState)}
                onDontSaveConfirm={() => handleDontSaveReset()}
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
        {/* <Footer workspaceRef={workspaceRef} activeStep={activeStep} /> */}
      </div>
    </NavDrawer>
  );
}

