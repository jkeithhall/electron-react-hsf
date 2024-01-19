import { useState } from 'react';

import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import parseJSONFile from '../utils/parseJSONFile';

export default function FileSelector({setStateMethods, activeStep}) {
  const [scenarioFilenames, setScenarioFilenames] = useState({ scenario: null, tasks: null });

  const handleFileChange = (e) => {
    const fileInput = e.target;

    if (fileInput.files.length > 0) {
      const selectedFile = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target.result;
        parseJSONFile(content, setStateMethods);
      };

      reader.readAsText(selectedFile);
      const newScenarioFilenames = { ...scenarioFilenames };
      newScenarioFilenames[activeStep] = selectedFile.name;
      setScenarioFilenames(newScenarioFilenames);
    }
  }

  return (
    <div className='file-selection-header'>
      <Input
        type="file"
        id='fileInput'
        onChange={handleFileChange}
        style={{ display: 'none' }}
        mx={3}
      />
      <label htmlFor='fileInput'>
        <Button variant="contained" component="span">Choose File</Button>
      </label>
      <Typography variant="body" my={1}>{scenarioFilenames[activeStep]}</Typography>
    </div>
  )
}