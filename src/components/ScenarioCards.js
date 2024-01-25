import { useState } from 'react';
import { validateScenarioParametersAt } from '../utils/validateParameters';
import FileSelector from './FileSelector';
import ParameterGroup from './ParameterGroup';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Button from '@mui/material/Button';

export default function ScenarioCards({activeStep, setActiveStep, sources, simulationParameters, schedulerParameters, setStateMethods}) {
  // State variables for form validation and errors
  const [ formErrors, setFormErrors] = useState({});
  const [ activeAccordion, setActiveAccordion ] = useState(null);

  const handleClick = async () => {
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

        if (parameter in sources) {
          setActiveAccordion('Sources');
          return;
        } else if (parameter in simulationParameters) {
          setActiveAccordion('Simulation Parameters');
          return;
        } else if (parameter in schedulerParameters) {
          setActiveAccordion('Scheduler Parameters');
          return;
        }
      }
    }

    if (Object.keys(formErrors).length === 0) {
      setActiveStep('Tasks');
    }
  }

  const handleAccordionChange = (clickedAccordion) => {
    if (activeAccordion === clickedAccordion) {
      setActiveAccordion(null);
    } else {
      setActiveAccordion(clickedAccordion);
    }
  }

  const valid = Object.keys(formErrors).length === 0;

  return (
    <>
      <FileSelector setStateMethods={setStateMethods} activeStep={activeStep}/>
      <Accordion
        expanded={activeAccordion === 'Sources'}
        onChange={() => handleAccordionChange('Sources')}
      >
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon color='primary'/>}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography>Sources</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ParameterGroup parameters={sources} setParameters={setStateMethods} formErrors={formErrors} setFormErrors={setFormErrors}/>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={activeAccordion === 'Simulation Parameters'}
        onChange={() => handleAccordionChange('Simulation Parameters')}
      >
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon color='primary'/>}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography>Simulation Parameters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ParameterGroup parameters={simulationParameters} setParameters={setStateMethods} formErrors={formErrors} setFormErrors={setFormErrors}/>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={activeAccordion === 'Scheduler Parameters'}
        onChange={() => handleAccordionChange('Scheduler Parameters')}
      >
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon color='primary'/>}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          <Typography>Schedule Parameters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ParameterGroup parameters={schedulerParameters} setParameters={setStateMethods} formErrors={formErrors} setFormErrors={setFormErrors}/>
        </AccordionDetails>
      </Accordion>
      <div className='next-step-button-footer'>
        <Button
          variant="contained"
          color= { valid ? 'info' : 'error' }
          onClick={handleClick}
          disabled={!valid}
        >
          Next
        </Button>
      </div>
    </>
  )
}