import { useState } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import { randomId } from '@mui/x-data-grid-generator';

export default function AddConstraintModal({ setConstraints, handleClose, states, subsystem, typeOptions }) {
  const [stateKey, setStateKey] = useState(states[0].key);
  const [stateType, setStateType] = useState(states[0].type);
  const [name, setName] = useState('');
  const [type, setType] = useState('FAIL_IF_HIGHER');
  const [value, setValue] = useState(0);
  const [valueErrorMessage, setValueErrorMessage] = useState('');

  const titleCase = (str) => str[0].toUpperCase() + str.slice(1);

  const stateKeys = states.filter((state) => state.type === 'int' || state.type === 'double').map((state) => state.key);
  const stateTypes = states.reduce((acc, state) => {
    acc[state.key] = state.type;
    return acc;
  }, {});

  const handleStateKeyChange = (e) => {
    const { value } = e.target;
    setStateKey(value);
    setStateType(stateTypes[value]);
  }

  const handleConfirm = () => {
    setConstraints((prevConstraints) => {
      return [...prevConstraints, { id: randomId(), name, stateKey, stateType, subsystem, type, value }];
    });
    handleClose();
  }

  const handleBlur = () => {
    if (stateType === 'int') {
      if (!Number.isInteger(parseFloat(value))) {
        setValueErrorMessage('Value must be an integer');
      } else {
        setValueErrorMessage('');
      }
    } else {
      if (Number(value) !== parseFloat(value)) {
        setValueErrorMessage('Value must be a number');
      } else {
        setValueErrorMessage('');
      }
    }
  }

  return (
    <div className="overlay">
      <Card sx={{ '&..MuiCard-root': { width: 350 }, zIndex: 2, padding: '20px', height: 'auto', borderRadius: "5px" }}>
        <Typography variant="h4" my={2}>{'Add a New Constraint'}</Typography>
        <TextField
          id="stateKey"
          key="stateKey"
          fullWidth
          label={'State Key'}
          variant="outlined"
          color='primary'
          select
          align='left'
          sx={{ my: 1 }}
          value={stateKey}
          onChange={handleStateKeyChange}
        >
          {stateKeys.map((option) => (
            <MenuItem key={option} value={option}>{`${titleCase(option)} (${stateTypes[option]})`}</MenuItem>
          ))}
        </TextField>
        <TextField
          id="name"
          key="name"
          fullWidth
          label={'Name'}
          variant="outlined"
          color='primary'
          sx={{ my: 1 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          id="value"
          key="value"
          fullWidth
          label={'Value'}
          variant="outlined"
          color='primary'
          error={valueErrorMessage !== ''}
          helperText={valueErrorMessage}
          sx={{ my: 1 }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
        />
        <TextField
          id="type"
          key="type"
          fullWidth
          label={'Type'}
          variant="outlined"
          color='primary'
          select
          align='left'
          sx={{ my: 1 }}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {typeOptions.map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </TextField>
        <div className='confirm-close-icons'>
          <Button
            variant="contained"
            onClick={handleConfirm}
            startIcon={<AddIcon/>}
            disabled={name === '' || value === '' || valueErrorMessage !== ''}
          >
            Add Parameter
          </Button>
          <Button variant="contained" color="light" onClick={handleClose} startIcon={<CloseIcon/>}>Cancel</Button>
        </div>
      </Card>
    </div>
  );
}