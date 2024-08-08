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

export default function SimulateStep({
  navOpen,
  simulationInput,
  taskList,
  componentList,
  dependencyList,
  evaluator,
  constraints,
  setErrorMessage,
  setErrorModalOpen,
  setActiveStep,
  setStateMethods,
}) {
  const [precheckStep, setPrecheckStep] = useState(0);
  const [inputFiles, setInputFiles] = useState({});

  const [stepStatus, setStepStatus] = useState({
    0: { status: 'ready', message: null },
    1: { status: 'error', message: 'Docker is not installed' },
    2: { status: 'ready', message: null },
    3: { status: 'pending', message: null },
    4: { status: 'ready', message: null }
  });

  const handleNext = () => {
    if (precheckStep < steps.length) {
      setPrecheckStep((prevPrecheckStep) => prevPrecheckStep + 1);
    };
  };

  const checkDocker = async () => {
    if (window.electronApi) {
      const backend = window.electronApi;
      try {
        // Check if Docker is installed
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
        } else {
          setInputFiles(data); // Save input filenames for simulation
          setStepStatus((prevStepStatus) => ({
            ...prevStepStatus,
            3: { status: 'ready', message: null },
          }));
          setPrecheckStep((prevPrecheckStep) => prevPrecheckStep + 1);
        }
      });
      return;
    } catch (error) {
      console.log(error);
      setStepStatus((prevStepStatus) => ({
        ...prevStepStatus,
        3: { status: 'error', message: error },
      }));
    }
  }

  const runSimulation = () => {
    if (window.electronApi) {
      const backend = window.electronApi;
      try {
        // Run simulation
        const { outputPath } = simulationInput.dependencies;
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

  useEffect(() => {
    // checkDocker();
  }, []);

  const steps = [
    {
      label: 'Validating parameters',
      errorLabel: 'Error validating parameters',
      // errorButtonLabel: 'Retry validation',
      buttonLabel: 'Next',
      buttonHandler: handleNext,
    },
    {
      label: 'Checking system requirements',
      errorLabel: 'Error checking system requirements',
      // errorButtonLabel: 'Retry system check',
      buttonLabel: 'Next',
      buttonHandler: handleNext,
     },
    { label: 'Setting up simulation environment',
      errorLabel: 'Error setting up simulation environment',
      buttonLabel: 'Next',
      buttonHandler: handleNext
    },
    { label: 'Building input files',
      errorLabel: 'Error building input files',
      buttonLabel: 'Build input',
      buttonHandler: buildInputFiles
    },
    { label: 'Simulation ready',
      errorLabel: 'Error preparing simulation',
      buttonLabel: 'Next',
      buttonHandler: handleNext
    },
  ];

  return (
    <Paper sx={{ maxWidth: 1000, backgroundColor: '#eee', padding: '25px', margin: '25px' }}>
      <Stepper activeStep={precheckStep} orientation="vertical">
        {steps.map((step, index) => {
          const labelProps = {};
          let  { status, message } = stepStatus[index];
          if (index === precheckStep) {
            if (status !== 'ready') {
              labelProps.optional = (
                <Typography
                  variant="caption"
                  color={`${status === 'error' ? 'error' : 'warning'}`}
                >
                  {message}
                </Typography>
              );
              labelProps.error = status === 'error';
            }
          }
          return (
            <Step key={step.label}>
              <StepLabel {...labelProps} >
                {step.label}
              </StepLabel>
              <StepContent>
                <Typography>{step.description}</Typography>
                <Box sx={{ mb: 2 }}>
                  {<div>
                    <Button
                      variant="contained"
                      onClick={step.buttonHandler}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {step.buttonLabel}
                    </Button>
                  </div>}
                </Box>
              </StepContent>
            </Step>
          );
      })}
      </Stepper>
      {precheckStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3, mt: 2 }}>
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
