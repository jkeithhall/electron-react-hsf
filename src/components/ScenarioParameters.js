import { useState } from 'react';
import { validateScenarioParametersAt } from '../utils/validateParameters';
import FileSelector from './FileSelector';
import ParameterGroup from './ParameterGroup';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SaveButton from './SaveButton';


export default function ScenarioParameters({activeStep, setActiveStep, sources, simulationParameters, schedulerParameters, setStateMethods}) {
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
      <FileSelector activeStep={activeStep} setStateMethods={setStateMethods}/>
      <Grid container spacing={3}>
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
      <div className='button-footer'>
        <SaveButton
          activeStep={activeStep}
          sources={sources}
          simulationParameters={simulationParameters}
          schedulerParameters={schedulerParameters}
          setStateMethods={setStateMethods}
        />
        <Button
          variant="contained"
          color="info"
          onClick={handleNextButtonClick}
          disabled={!valid}
        >
          Next
        </Button>
      </div>
    </>
  )
}