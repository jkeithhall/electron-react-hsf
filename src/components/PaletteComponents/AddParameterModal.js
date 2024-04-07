import { useState } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

export default function AddParameterModalModal({ label, handleAddParameter, handleClose }) {
  const [parameterName, setParameterName] = useState('');
  const [parameterType, setParameterType] = useState('double');
  const [parameterValue, setParameterValue] = useState(0);
  const [vectorLength, setVectorLength] = useState(3); // Only used if parameterType === 'vector'
  const [parameterVector, setParameterVector] = useState([0, 0, 0]);
  const [valueErrorMessage, setValueErrorMessage] = useState('');
  const [invalidComponents, setInvalidComponents] = useState([]);

  const typeOptions = ['double', 'int', 'bool', 'vector'];

  const handleConfirm = () => {
    if (parameterType === 'vector') {
      handleAddParameter(parameterName, parameterType, parameterVector);
    } else {
      handleAddParameter(parameterName, parameterType, parameterValue);
    }
    handleClose();
  }

  const handleChangeType = (e) => {
    const { value } = e.target;
    let prevType;
    setParameterType(prevType => {
      prevType = value;
      return value;
    });
    if (value === 'vector' && prevType !== 'vector') {
      setParameterVector([0, 0, 0]);
      setVectorLength(3);
      setParameterValue(0);
      setValueErrorMessage('');
      setInvalidComponents([]);
    } else if (value === 'bool' && prevType !== 'bool') {
      setParameterValue('true');
      setParameterVector([0, 0, 0]);
      setVectorLength(3);
      setValueErrorMessage('');
      setInvalidComponents([]);
    } else if ((value === 'int' && prevType !== 'int') || (value === 'double' && prevType !== 'double')) {
      setParameterVector([0, 0, 0]);
      setVectorLength(3);
      setParameterValue(0);
      setValueErrorMessage('');
      setInvalidComponents([]);
    }
  }

  const handleBlur = () => {
    if (parameterType === 'int') {
      if (!Number.isInteger(parseFloat(parameterValue))) {
        setValueErrorMessage('Value must be an integer');
      } else {
        setValueErrorMessage('');
      }
    } else if (parameterType === 'double') {
      if (Number(parameterValue) !== parseFloat(parameterValue)) {
        setValueErrorMessage('Value must be a number');
      } else {
        setValueErrorMessage('');
      }
    } else if (parameterType === 'vector') {
      const nonNumberComponents = [];
      parameterVector.forEach((component, index) => {
        if (Number(component) !== parseFloat(component)) {
          nonNumberComponents.push(index);
        }
      });

      if (nonNumberComponents.length > 1) {
        setInvalidComponents(nonNumberComponents);
        setValueErrorMessage(`Vector components ${nonNumberComponents.join(', ')} are not numbers`);
      } else if (nonNumberComponents.length === 1) {
        setInvalidComponents(nonNumberComponents);
        setValueErrorMessage(`Vector component ${nonNumberComponents[0]} is not a number`);
      } else {
        setValueErrorMessage('');
      }
    }
  }

  const handleVectorLengthChange = (newLength) => {
    setVectorLength(newLength);
    setParameterVector(prevVector => {
      const newVector = [...prevVector];
      if (newLength > newVector.length) {
        for (let i = newVector.length; i < newLength; i++) {
          newVector.push(0);
        }
      } else {
        newVector.splice(newLength, newVector.length - newLength);
      }
      return newVector;
    });
  }

  const handleVectorComponentChange = (e, index) => {
    setParameterVector((prevVector) => {
      const newVector = [...prevVector];
      newVector[index] = e.target.value;
      return newVector;
    });
  }

  return (
    <div className="overlay">
      <Card sx={{ '&..MuiCard-root': { width: 550 }, zIndex: 2, padding: '20px', height: 'auto', borderRadius: "5px"}}>
        <Typography variant="h4" my={2}>{`Add a New ${label}`}</Typography>
        <TextField
          id="parameterName"
          key="parameterName"
          fullWidth
          placeholder={`${label} Name`}
          label={`${label} Name`}
          variant="outlined"
          color='primary'
          sx={{ my: 1 }}
          value={parameterName}
          onChange={(e) => setParameterName(e.target.value)}
        />
        <TextField
          id="parameterType"
          key="parameterType"
          fullWidth
          label={`${label} Type`}
          variant="outlined"
          color='primary'
          select
          align='left'
          sx={{ my: 1 }}
          value={parameterType}
          onChange={handleChangeType}
        >
          {typeOptions.map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </TextField>
        {(parameterType === 'int' || parameterType === 'double') && <TextField
          id="parameterValue"
          key="parameterValue"
          placeholder={`${label} Value`}
          fullWidth
          label={`${label} Value`}
          variant="outlined"
          color='primary'
          error={valueErrorMessage !== ''}
          helperText={valueErrorMessage}
          sx={{ my: 1 }}
          value={parameterValue}
          onChange={(e) => setParameterValue(e.target.value)}
          onBlur={handleBlur}
        />}
        {(parameterType === 'bool') && <TextField
          id="parameterValue"
          key="parameterValue"
          fullWidth
          label={`${label} Value`}
          variant="outlined"
          color='primary'
          sx={{ my: 1 }}
          select
          align='left'
          value={parameterValue}
          onChange={(e) => setParameterValue(e.target.value)}
        >
          <MenuItem key='true' value='true'>True</MenuItem>
          <MenuItem key='false' value='false'>False</MenuItem>
        </TextField>}
        {parameterType === 'vector' &&
          <Box sx={{ maxWidth: 550 }}>
            <TextField
              id="vectorLength"
              key="vectorLength"
              fullWidth
              label="Vector Length"
              variant="outlined"
              color='primary'
              select
              align='left'
              sx={{ my: 1 }}
              value={vectorLength}
              onChange={(e) => handleVectorLengthChange(e.target.value)}
            >
              {[2, 3, 4, 5, 6, 7, 8, 9].map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
            {invalidComponents.length > 0 && <Typography variant="body2" color="error" sx={{ my: 1 }}>{valueErrorMessage}</Typography>}
            <Grid container spacing={2}>
            {parameterVector.map((vectorComponent, index) => {
              const invalid = invalidComponents.includes(index);
              return (
                <Grid item sx={{ my: 1 }} xs={4} key={`vectorComponent${index}`}>
                  <TextField
                    id={`vectorComponent${index}`}
                    key={`vectorComponent${index}`}
                    label={`Component ${index}`}
                    variant="outlined"
                    color='primary'
                    error={invalid}
                    value={vectorComponent}
                    onChange={(e) => handleVectorComponentChange(e, index)}
                    onBlur={handleBlur}
                  />
                </Grid>)
              })}
            </Grid>
          </Box>
        }
        <div className='confirm-close-icons'>
          <Button
            variant="contained"
            onClick={handleConfirm}
            startIcon={<AddIcon/>}
            disabled={parameterName === '' || parameterValue === '' || valueErrorMessage !== ''}
          >
            Add Parameter
          </Button>
          <Button variant="contained" color="light" onClick={handleClose} startIcon={<CloseIcon/>}>Cancel</Button>
        </div>
      </Card>
    </div>
  );
}