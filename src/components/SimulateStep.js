import { useState, useEffect, useRef } from 'react';
import { useTheme, ThemeProvider } from '@mui/material/styles';
import buildDownloadJSON from '../utils/buildDownloadJSON';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const steps = [
  { label: 'Validating parameters'},
  // { label: 'Checking system requirements' },
  // { label: 'Setting up simulation environment' },
  { label: 'Building input files' },
  { label: 'Simulation ready' },
];

export default function SimulateStep({
  navOpen,
  setErrorMessage,
  setErrorModalOpen,
  setActiveStep,
  setStateMethods,
  outputPath,
  scenarioErrors,
  tasksErrors,
  modelErrors,
  dependencyErrors,
  constraintsErrors,
  taskList,
  componentList,
  dependencyList,
  constraints,
  evaluator,
}) {
  const theme = useTheme();
  const [precheckStep, setPrecheckStep] = useState(0);
  const [stepStatus, setStepStatus] = useState(steps.map(() => ({ status: 'pending', message: null })));
  const [inputFiles, setInputFiles] = useState({});
  const [status, setStatus] = useState('pending');
  const logsRef = useRef(null);
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);

  const handleNext = () => {
    if (precheckStep < steps.length) {
      setPrecheckStep((prevPrecheckStep) => prevPrecheckStep + 1);
    };
  };

  const validateParameters = () => {
    console.log('Checking for errors in parameters');
    const hasScenarioErrors = Object.keys(scenarioErrors).length > 0;
    const hasTasksErrors = Object.keys(tasksErrors).length > 0;
    const hasModelErrors = Object.keys(modelErrors).length > 0;
    const hasDependencyErrors = Object.keys(dependencyErrors).length > 0;
    const hasConstraintsErrors = Object.keys(constraintsErrors).length > 0;

    if (hasScenarioErrors ||
        hasTasksErrors ||
        hasModelErrors ||
        hasDependencyErrors ||
        hasConstraintsErrors) {
      let errorMessage = '';
      if (hasScenarioErrors) {
        errorMessage += 'Please correct errors in the scenario step.\n';
      }
      if (hasTasksErrors) {
        errorMessage += 'Please correct errors in the following rows in the tasks table:\n';
        Object.keys(tasksErrors).forEach((key, index) => {
          const task = taskList.find((t) => t.id === key);
          const taskIndex = taskList.indexOf(task) + 1;

          errorMessage += `Row ${taskIndex}` + (index < Object.keys(tasksErrors).length - 1 ? ', ' : '.\n');
        });
      }
      if (hasModelErrors) {
        errorMessage += `Please correct errors in the following components:\n`;
        Object.keys(modelErrors).forEach((key, index) => {
          const component = componentList.find((c) => c.id === key);
          const parentName = componentList.find((c) => c.id === component.parent)?.name;
          const displayName = `${component.name}` + (parentName ? ` (${parentName})` : '');
          errorMessage += `${displayName}` + (index < Object.keys(modelErrors).length - 1 ? ', ' : '.\n');
        });
      }
      if (hasDependencyErrors) {
        errorMessage += `Please correct errors in the following dependencies:\n`;
        Object.entries(dependencyErrors).forEach(([key, value], index) => {
          const dependency = dependencyList.find((d) => d.id === key);
          const subsystem = componentList.find((c) => c.id === dependency.subsystem)?.name;
          const depSubsystem = componentList.find((c) => c.id === dependency.depSubsystem)?.name;
          const asset = componentList.find((c) => c.id === dependency.asset)?.name;
          const depAsset = componentList.find((c) => c.id === dependency.depAsset)?.name;
          const dependencyName = `${subsystem} (${asset}) → ${depSubsystem} (${depAsset})`;
          errorMessage += `${dependencyName}` + (index < Object.keys(dependencyErrors).length - 1 ? ', ' : '.\n');
        });
      }
      if (hasConstraintsErrors) {
        errorMessage += 'Please correct errors in the following rows in the constraints table:\n';
        Object.keys(constraintsErrors).forEach((key, index) => {
          const constraint = constraints.find((c) => c.id === key);
          const constraintIndex = constraints.indexOf(constraint) + 1;

          errorMessage += `Row ${constraintIndex}` + (index < Object.keys(constraintsErrors).length - 1 ? ', ' : '.\n');
        });
      }
      setStepStatus((prevStepStatus) => ({
        ...prevStepStatus,
        0: { status: 'error', message: errorMessage },
      }));
      return 'error';
    } else {
      setStepStatus((prevStepStatus) => ({
        ...prevStepStatus,
        0: { status: 'ready', message: null },
      }));
      return 'ready';
    }
  }

  const checkDocker = async () => {
    if (window.electronApi) {
      const backend = window.electronApi;
      try {
        // Check if Docker is installed
        console.log('Checking Docker installation');
        let error = await backend.checkDockerInstalled();
        if (error) throw error;
        console.log('Docker is installed');
        // Check if Docker is running
        error = await backend.checkDockerRunning();
        if (error) {
          console.log('Docker is not running; starting Docker');
          error = await backend.startDocker();
        }
        if (error) throw error;
        console.log('Docker is running');
        // Check if Docker has the necessary images
        // Check if Docker has the necessary containers
        console.log('Docker is ready');
        setStepStatus((prevStepStatus) => ({
          ...prevStepStatus,
          1: { status: 'ready', message: null },
        }));
        return;
      } catch (error) {
        console.log(error);
        setStepStatus((prevStepStatus) => ({
          ...prevStepStatus,
          1: { status: 'error', message: error },
        }));
      }
    }
  }

  const buildInputFiles = async () => {
    if (!window.electronApi) return;
    const backend = window.electronApi;

    try {
      // Build input files
      console.log('Building input files');
      const simulationJSON = await buildDownloadJSON('Scenario', setStateMethods);
      const tasksJSON = await buildDownloadJSON('Tasks', setStateMethods);
      const modelJSON = await buildDownloadJSON('System Model', setStateMethods);
      const fileContents = {
        simulationJSON,
        tasksJSON,
        modelJSON
      };

      backend.onBuildInputFiles(fileContents, (data) => {
        if (data instanceof Error) {
          setStepStatus((prevStepStatus) => ({
            ...prevStepStatus,
            3: { status: 'error', message: data.message },
          }));
          return 'error';
        } else {
          setInputFiles(data); // Save input filenames for simulation
          setStepStatus((prevStepStatus) => ({
            ...prevStepStatus,
            3: { status: 'ready', message: null },
          }));
        }
      });
      return 'ready';
    } catch (error) {
      console.log(error);
      setStepStatus((prevStepStatus) => ({
        ...prevStepStatus,
        3: { status: 'error', message: error },
      }));
      return 'error';
    }
  }

  const setProgressValue = (data) => {
    // Scheduler Status: 0.000% done; 205 schedules generated.
    if (data.includes('Scheduler Status:')) {
      const progressMatch = data.match(/(\d+(\.\d+)?)%/);
      if (progressMatch) {
        const progressValue = parseFloat(progressMatch[1]);
        setProgress(progressValue);
      }
    }
  }

  const setLogsValue = (data) => {
    if (logs.length === 0 || logs[logs.length - 1] !== data) { // Avoid duplicates
      if (data !== '' && data !== "idk") {  // Avoid empty logs and specific unwanted logs
        setLogs((prevLogs) => [...prevLogs, data]);
      }
    }
  }

  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight; // Scroll to the bottom
    }
  }, [logs]);

  const runSimulation = () => {
    if (window.electronApi) {
      const backend = window.electronApi;
      try {
        // Run simulation
        setStatus('running');
        backend.runSimulation(inputFiles, outputPath, ({type, data, code}) => {
          if (type === 'error') {
            setErrorMessage(data);
            setErrorModalOpen(true);
          } else if (type === 'close') {
            setStatus('success');
            setActiveStep('Analyze');
          } else {
            setProgressValue(data);
            setLogsValue(data);
            console.log(data);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Check the current step and move to the next step if ready
  const checkStep = async (precheckStep) => {
    let status = 'pending';
    switch (precheckStep) {
      case 0:
        status = validateParameters();
        break;
      // case 1:
      //   status = checkDocker();
      //   break;
      // case 2:
      //   break;
      case 1:
        status = await buildInputFiles();
        break;
      case 2:
        status = 'ready';
        break;
      default:
        break;
    }
    if (status === 'ready' && precheckStep < steps.length) {
      // Move to the next step after a delay
      setTimeout(() => handleNext(), 300);
    }
  }

  // Check the current step when the step changes
  useEffect(() => {
    checkStep(precheckStep);
  }, [precheckStep]);

  return (
    <ThemeProvider theme={theme}>
      <Paper sx={{ width: 500, backgroundColor: '#eee', padding: '25px', margin: '25px' }}>
        {((status === "pending" || status === "ready") &&
          <Stepper activeStep={precheckStep} orientation="vertical">
            {steps.map((step, index) => {
              const labelProps = {};
              let  { status, message } = stepStatus[index];
              if (index === precheckStep) {
                if (status === 'error') {
                  const FormattedMessages = message.split('\n').map((line, i) => (
                    <Typography
                      key={i}
                      variant="caption"
                      color={"error"}
                    >
                      {line}
                    </Typography>
                  ));
                  labelProps.optional = (
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      {FormattedMessages}
                    </Box>
                  )
                  labelProps.error = status === 'error';
                }
              }
              return (
                <Step key={step.label}>
                  <StepLabel {...labelProps} >
                    {step.label}
                  </StepLabel>
                  <StepContent>
                    {/* <Box sx={{ mb: 2 }}>
                      {<div>
                        <Button
                          variant="contained"
                          onClick={step.buttonHandler}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {step.buttonLabel}
                        </Button>
                      </div>}
                    </Box> */}
                  </StepContent>
                </Step>
              );
            })}
          </Stepper>
        )}
        {status === "running" && (
          <Accordion sx={{ backgroundColor: theme.palette.primary.dark, color: 'white' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
              <Typography variant="h5" fontWeight="bold">Progress logs</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                ref={logsRef}
                p={1}
                sx={{
                  maxHeight: 200,
                  overflowY: 'auto',
                  backgroundColor: '#eee',
                  color: 'black',
                  minHeight: 200,
                }}
              >
                {logs.map((log, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    align="left"
                    paragraph={true}
                    sx={{ fontFamily: 'Courier Prime, monospace' }}
                    m={1}
                  >
                    {log}
                </Typography>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}
        {precheckStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3, m: 2 }}>
            <Button
              variant="contained"
              color={status === "running" ? "success" : "primary"}
              startIcon={
                <Box sx={{ m: 1, position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                  {status === "success" ? <CheckIcon /> : <PlayCircleIcon />}
                  {(status === "running" || status === "success") && (
                    <CircularProgress
                      size={28}
                      variant={progress > 0 ? "determinate" : "indeterminate"}
                      value={progress}
                      sx={{
                        color: (theme) => theme.palette.success.light,
                        position: 'absolute',
                        top: -1.9,
                        left: -1.9,
                        zIndex: 1,
                      }}
                    />
                  )}
                </Box>}
              onClick={runSimulation}
              sx={{ mt: 1, mr: 1 }}
            >
              Run simulation
            </Button>
          </Paper>
        )}
      </Paper>
    </ThemeProvider>
  );
}
