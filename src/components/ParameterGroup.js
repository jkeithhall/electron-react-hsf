import { useState } from 'react';

import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import EventIcon from '@mui/icons-material/Event';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

import { validateScenarioParametersAt } from '../utils/validateParameters';
import { julianToDate, dateToJulian } from '../utils/julianConversion.js';

const convertDisplayName = (camelCaseName) => {
  if (camelCaseName === 'startJD') return 'Start Julian Date';
  const words = camelCaseName.split(/(?=[A-Z])/);
  const firstWord = words[0];
  words[0] = firstWord[0].toUpperCase() + firstWord.slice(1);
  return words.join(' ');
}

const parametersWithSeconds = ['startSeconds', 'endSeconds', 'primaryStepSeconds'];
const numericalParameters = parametersWithSeconds.concat(['maxSchedules', 'cropRatio']);

export default function ParameterGroup ({parameters, setParameters, formErrors, setFormErrors}) {
  const [showCalendar, setShowCalendar] = useState(false);

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

  const toggleCalendar = (e) => {
    setShowCalendar(!showCalendar);
  }

  const handleDateChange = (date) => {
    const newJD = dateToJulian(date);
    setParameters.setStartJD(newJD);
  }

  return(
    <Box sx={{ padding: '10px', backgroundColor: '#eeeeee', borderRadius: '5px' }}>
      {Object.entries(parameters).map(([key, value]) => {
        const setMethodName = 'set' + key[0].toUpperCase() + key.slice(1);
        const setMethod = setParameters[setMethodName];

        const displayName = convertDisplayName(key);

        const valid = !formErrors[key];
        const errorMessage = valid ? '' : formErrors[key];

        const type = numericalParameters.includes(key) ? 'number' : 'text';

        const endAdornment = parametersWithSeconds.includes(key) ? <InputAdornment position="end">s</InputAdornment> :
          (key === 'startJD' ? <InputAdornment position="end">JD</InputAdornment> : null);
        const startAdornment = key === 'startJD' ? <InputAdornment position="start"><EventIcon onClick={toggleCalendar}/></InputAdornment> : null;

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
              type={type}
              onChange={(e) => setMethod(e.target.value)}
              onBlur={handleBlur}
              error={!valid}
              helperText={errorMessage}
              InputProps={{ startAdornment: startAdornment, endAdornment: endAdornment }}
            />
            {showCalendar && key === 'startJD' &&
              <div className="calendar-stacking-context">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar value={julianToDate(value)} onChange={handleDateChange}/>
                </LocalizationProvider>
                <Button onClick={toggleCalendar} color="info" size="small" variant="contained"
                  sx={{ alignSelf: 'flex-end', marginBottom: '20px', marginRight: '20px' }}>Close</Button>
              </div>}
          </Box>
        )
      })}
    </Box>
  )
}