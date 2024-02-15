import { useState } from 'react';
import { validateScenarioParametersAt } from '../utils/validateParameters';
import FileHeader from './FileHeader';
import ParameterGroup from './ParameterGroup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';


export default function ScenarioParameters({activeStep, setActiveStep, sources, simulationParameters, schedulerParameters, taskList, model, setStateMethods}) {
  // State variables for form validation and errors
  const [ formErrors, setFormErrors] = useState({});

  const handleNextButtonClick = async () => {
    const parameters = { ...sources, ...simulationParameters, ...schedulerParameters };
    for (const parameter in parameters) {
      try {
        await validateScenarioParametersAt(parameters, parameter);
        const newFormErrors = { ...formErrors };
        delete newFormErrors[parameter];
        setFormErrors(newFormErrors);
      } catch (error) {
        const { message } = error;
        setFormErrors({ ...formErrors, [parameter]: message });
      }
    }

    if (Object.keys(formErrors).length === 0) {
      setActiveStep('Tasks');
    }
  }

  const valid = Object.keys(formErrors).length === 0;

  return (
    <>
      <FileHeader activeStep={activeStep} valid={valid} sources={sources} simulationParameters={simulationParameters} schedulerParameters={schedulerParameters} taskList={taskList} model={model} setStateMethods={setStateMethods} handleNextButtonClick={handleNextButtonClick}/>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={6} mt={1}>
          <Grid>
            <Paper elevation={3} style={{ padding: '10px', margin: '10px', backgroundColor: '#282D3D', width: 400 }}>
              <Typography variant="h5" color="primary" my={2}>Sources</Typography>
              <ParameterGroup parameters={sources} setParameters={setStateMethods} formErrors={formErrors} setFormErrors={setFormErrors}/>
            </Paper>
          </Grid>
          <Grid>
            <Paper elevation={3} style={{ padding: '10px', margin: '10px', backgroundColor: '#282D3D', width: 300  }}>
              <Typography variant="h5" color="primary" my={2}>Simulation Parameters</Typography>
              <ParameterGroup parameters={simulationParameters} setParameters={setStateMethods} formErrors={formErrors} setFormErrors={setFormErrors}/>
            </Paper>
          </Grid>
          <Grid>
            <Paper elevation={3} style={{ padding: '10px', margin: '10px', backgroundColor: '#282D3D'  }}>
              <Typography variant="h5" color="primary" my={2}>Scheduler Parameters</Typography>
              <ParameterGroup parameters={schedulerParameters} setParameters={setStateMethods} formErrors={formErrors} setFormErrors={setFormErrors}/>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}