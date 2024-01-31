import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import { validateScenarioParametersAt } from '../utils/validateParameters';

const convertDisplayName = (camelCaseName) => {
  const words = camelCaseName.split(/(?=[A-Z])/);
  const firstWord = words[0];
  words[0] = firstWord[0].toUpperCase() + firstWord.slice(1);
  return words.join(' ');
}

export default function ParameterGroup ({parameters, setParameters, formErrors, setFormErrors}) {
  const handleBlur = async (e) => {
    const { name } = e.target;
    try {
      await validateScenarioParametersAt(parameters, name);
      const newFormErrors = { ...formErrors };
      delete newFormErrors[name];
      setFormErrors(newFormErrors);
    } catch (error) {
      const { message } = error;
      setFormErrors({ ...formErrors, [name]: message });
    }
  }

  return(
    <Box sx={{ padding: '10px', backgroundColor: '#dddddd', borderRadius: '5px', overflow: 'scroll', maxHeight: '400px' }}>
      {Object.entries(parameters).map(([key, value]) => {
        const setMethodName = 'set' + key[0].toUpperCase() + key.slice(1);
        const displayName = convertDisplayName(key);
        const valid = !formErrors[key];
        const errorMessage = valid ? '' : formErrors[key];

        return (
          <Box key={key} my={1}>
            <TextField
              id={key}
              fullWidth
              label={displayName}
              variant="outlined"
              color='info'
              name={key}
              value={value}
              onChange={(e) => setParameters[setMethodName](e.target.value)}
              onBlur={handleBlur}
              error={!valid}
              helperText={errorMessage}
            />
          </Box>
        )
      })}
    </Box>
  )
}