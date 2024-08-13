import { useState, useEffect } from 'react';
import buildDownloadJSON from '../utils/buildDownloadJSON';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

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
  modelErrors,
  componentList,
}) {
  const [precheckStep, setPrecheckStep] = useState(0);
  const [stepStatus, setStepStatus] = useState(steps.map(() => ({ status: 'pending', message: null })));
  const [inputFiles, setInputFiles] = useState({});

  const handleNext = () => {
    if (precheckStep < steps.length) {
      setPrecheckStep((prevPrecheckStep) => prevPrecheckStep + 1);
    };
  };

  const validateParameters = () => {
    console.log('Validating parameters');
    if (Object.keys(scenarioErrors).length > 0 || Object.keys(modelErrors).length > 0) {
      let errorMessage = '';
      if (Object.keys(scenarioErrors).length > 0) {
        errorMessage += 'Please correct errors in the scenario step.\n';
      }
      if (Object.keys(modelErrors).length > 0) {
        errorMessage += `Please correct errors in model component${Object.keys(modelErrors).length > 1 ? 's' : ''} `;
        Object.keys(modelErrors).forEach((key) => {
          const component = componentList.find((c) => c.id === key);
          const parentName = componentList.find((c) => c.id === component.parent)?.name;
          const displayName = `${component.name}` + (parentName ? ` (${parentName})` : '');
          errorMessage += `${displayName}, `;
        });
        errorMessage = errorMessage.slice(0, -2) + '.\n';
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

  const runSimulation = () => {
    if (window.electronApi) {
      const backend = window.electronApi;
      try {
        // Run simulation
        backend.runSimulation(inputFiles, outputPath, ({type, data, code}) => {
          if (type === 'error') {
            setErrorMessage(data);
            setErrorModalOpen(true);
          } else if (type === 'close') {
            setActiveStep('Analyze');
          } else {
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
    <Paper sx={{ width: 500, backgroundColor: '#eee', padding: '25px', margin: '25px' }}>
      <Stepper activeStep={precheckStep} orientation="vertical">
        {steps.map((step, index) => {
          const labelProps = {};
          let  { status, message } = stepStatus[index];
          if (index === precheckStep) {
            if (status === 'error') {
              const FormattedMessages = message.split('\n').map((line, i) => (
                <Typography
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
      {precheckStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3, m: 2 }}>
          <Button
            variant="contained"
            startIcon={<PlayCircleIcon />}
            onClick={runSimulation}
            sx={{ mt: 1, mr: 1 }}
          >
            Run simulation
          </Button>
        </Paper>
      )}
    </Paper>
  );
}
