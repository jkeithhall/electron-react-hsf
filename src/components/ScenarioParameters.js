import { useState } from 'react';
// import { validateScenarioParametersAt } from '../utils/validateParameters';
import ParameterGroup from './ParameterGroup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';


export default function ScenarioParameters({activeStep, setActiveStep, simulationInput, setSimulationInput, setHasUnsavedChanges}) {
  // State variables for form validation and errors
  const [ formErrors, setFormErrors] = useState({});

  const { name, version, dependencies, simulationParameters, schedulerParameters } = simulationInput;
  const { pythonSrc, outputPath, ...otherDependencies } = dependencies;
  const sources = { name, version, pythonSrc, outputPath };

  const setSources = (newSources) => {
    const { name, version, pythonSrc, outputPath } = newSources;
    setSimulationInput({ name, version, dependencies: { pythonSrc, outputPath, ...otherDependencies }, simulationParameters, schedulerParameters });
    setHasUnsavedChanges(true);
  }
  const setSimulationParameters = (newParameters) => {
    setSimulationInput({ name, version, dependencies, simulationParameters: newParameters, schedulerParameters });
    setHasUnsavedChanges(true);
  }
  const setSchedulerParameters = (newParameters) => {
    setSimulationInput({ name, version, dependencies, simulationParameters, schedulerParameters: newParameters });
    setHasUnsavedChanges(true);
  }

  // const handleNextButtonClick = async () => {
  //   const parameters = { name, version, pythonSrc, outputPath, ...simulationParameters, ...schedulerParameters };
  //   for (const parameter in parameters) {
  //     try {
  //       await validateScenarioParametersAt(parameters, parameter);
  //       const newFormErrors = { ...formErrors };
  //       delete newFormErrors[parameter];
  //       setFormErrors(newFormErrors);
  //     } catch (error) {
  //       const { message } = error;
  //       setFormErrors({ ...formErrors, [parameter]: message });
  //     }
  //   }

  //   if (Object.keys(formErrors).length === 0) {
  //     setActiveStep('Tasks');
  //   }
  // }

  // const valid = Object.keys(formErrors).length === 0;

  return (
    <>
      <Box sx={{ flexGrow: 1, padding: 5 }}>
        <Grid container spacing={3} mt={5}>
          <Grid item>
            <Paper elevation={3} style={{ padding: '10px', backgroundColor: '#282D3D', width: 500 }}>
              <Typography variant="h5" color='light.main' my={2}>Sources</Typography>
              <ParameterGroup parameters={sources} setParameters={setSources} formErrors={formErrors} setFormErrors={setFormErrors}/>
            </Paper>
          </Grid>
          <Grid item>
            <Paper elevation={3} style={{ padding: '10px', backgroundColor: '#282D3D'  }}>
              <Typography variant="h5" color="light.main" my={2}>Simulation Parameters</Typography>
              <ParameterGroup parameters={simulationParameters} setParameters={setSimulationParameters} formErrors={formErrors} setFormErrors={setFormErrors}/>
            </Paper>
          </Grid>
          <Grid item>
            <Paper elevation={3} style={{ padding: '10px', backgroundColor: '#282D3D'  }}>
              <Typography variant="h5" color="light.main" my={2}>Scheduler Parameters</Typography>
              <ParameterGroup parameters={schedulerParameters} setParameters={setSchedulerParameters} formErrors={formErrors} setFormErrors={setFormErrors}/>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}