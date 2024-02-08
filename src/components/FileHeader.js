import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FileSelector from './FileSelector';
import SaveButton from './SaveButton';

export default function FileHeader({ activeStep, valid, sources, simulationParameters, schedulerParameters, taskList, model, setStateMethods, handleNextButtonClick}) {
  return (
    <Box my={1} sx={{ display: 'flex', alignSelf: 'flex-end', justifyContent: 'space-evenly', gap: '15px' }}>
      <FileSelector activeStep={activeStep} setStateMethods={setStateMethods}/>
      <SaveButton
        activeStep={activeStep}
        sources={sources}
        simulationParameters={simulationParameters}
        schedulerParameters={schedulerParameters}
        setStateMethods={setStateMethods}
        taskList={taskList}
        model={model}
      />
      <Button
        variant="contained"
        color="info"
        onClick={handleNextButtonClick}
        disabled={!valid}
      >
        Next
      </Button>
    </Box>
  )
}