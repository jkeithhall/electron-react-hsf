import { forwardRef, useState, useRef, useEffect } from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MenuItem from '@mui/material/MenuItem';
import AddConstraintModal from './AddConstraintModal';

import { convertDisplayName } from '../../utils/displayNames';

const typeOptions = ['FAIL_IF_HIGHER', 'FAIL_IF_LOWER', 'FAIL_IF_EQUAL', 'FAIL_IF_NOT_EQUAL', 'FAIL_IF_HIGHER_OR_EQUAL', 'FAIL_IF_LOWER_OR_EQUAL'];

const DeleteConstraintButton = ({markedForDeletion, index, hovered, buttonRef, setHovered, handleDeleteClicked}) => {
  if (markedForDeletion !== index) {
    return (
      <IconButton
        size="medium"
        color={markedForDeletion === index || hovered === index ? 'error' : 'light.text'}
        onClick={(e) => handleDeleteClicked(e, index)}
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(-1)}
      >
        <RemoveCircleIcon fontSize="inherit"/>
      </IconButton>
    );
  } else {
    return (
      <Button
        ref={buttonRef}
        size="medium"
        color="error"
        sx={{ paddingTop: 0 }}
        onClick={(e) => handleDeleteClicked(e, index)}
        startIcon={<RemoveCircleIcon sx={{ '&.MuiSvgIcon-root': { fontSize: 22 }}}/>}
        fontSize="large"
      >
        Confirm
      </Button>
    );
  }
}

const Constraints = forwardRef(({ states, componentId, constraints, setConstraints, setComponentList }, ref) => {
  const [ hovered, setHovered ] = useState(null);
  const [ markedForDeletion, setMarkedForDeletion ] = useState(null);
  const [ modalOpen, setModalOpen ] = useState(false);
  const [ errorMessages, setErrorMessages ] = useState({})
  const buttonRef = useRef(null);

  const handleChange = (e, id) => {
    const { name, value } = e.target;
    setConstraints((prevConstraints) => {
      return prevConstraints.map((constraint) => {
        if (constraint.id === id) {
          return { ...constraint, [name]: value };
        } else {
          return constraint;
        }
      });
    });
  }

  const handleBlur = (e, id) => {
    const { value } = e.target;
    const stateType = constraints.find((constraint) => constraint.id === id).stateType;
    if (stateType === 'int') {
      if (!Number.isInteger(parseFloat(value))) {
        setErrorMessages(prevErrors => {
          return { ...prevErrors, [id]: 'Value must be an integer' };
        });
      } else {
        setErrorMessages(prevErrors => {
          delete prevErrors[id];
          return { ...prevErrors };
        });
      }
    } else {
      if (Number(value) !== parseFloat(value)) {
        setErrorMessages(prevErrors => {
          return { ...prevErrors, [id]: 'Value must be a number' };
        });
      } else {
        setErrorMessages(prevErrors => {
          delete prevErrors[id];
          return { ...prevErrors };
        });
      }
    }
  }

  const handleDeleteClicked = (e, id) => {
    e.stopPropagation();
    // If the delete button is clicked, mark the parameter for deletion
    if (markedForDeletion !== id) {
      setMarkedForDeletion(id);
    } else { // If the delete button is clicked again, delete the parameter
      setConstraints((prevConstraints) => {
        return prevConstraints.filter((constraint) => constraint.id !== id);
      });
      setComponentList((prevList) => { return [ ...prevList ]});
      setHovered(null);
      setMarkedForDeletion(null);
    }
  }

  const handleClickOutside = (e) => {
    if (buttonRef.current && !buttonRef.current.contains(e.target)) {
      setHovered(-1);
      setMarkedForDeletion(-1);
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    }
  }, []);

  return (
    <>
      <Typography variant="h6" color="secondary" mt={2} sx={{ flexGrow: 1, textAlign: 'center' }}>Constraints</Typography>
      {constraints.map((constraint, index) => {
        if (constraint.subsystem !== componentId) return null;
        const { stateKey } = constraint;

        return (
          <Card key={constraint.id} ref={(element) => ref[stateKey] = element} sx={{ marginTop: 1, padding: 1, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" sx={{ position: 'relative', width: '100%' }}>
              <Typography variant="body1" mt={1} mb={2} ml={1} sx={{ flexGrow: 1, textAlign: 'left' }}>{convertDisplayName(constraint.stateKey)}</Typography>
              <Box sx={{ position: 'absolute', right: 0 }}>
                <DeleteConstraintButton
                  markedForDeletion={markedForDeletion}
                  index={constraint.id}
                  hovered={hovered}
                  buttonRef={buttonRef}
                  setHovered={setHovered}
                  handleDeleteClicked={handleDeleteClicked}
                />
              </Box>
            </Stack>
            <TextField
              id='name'
              fullWidth
              label='Constraint Name'
              variant="outlined"
              color='primary'
              name='name'
              value={constraint.name}
              onChange={(e) => handleChange(e, constraint.id)}
            />
            <Grid container spacing={2} mt={1}>
              <Grid item xs={6}>
                <TextField
                  id='type'
                  fullWidth
                  label='Type'
                  variant="outlined"
                  color='primary'
                  name='type'
                  value={constraint.type}
                  select
                  align='left'
                  onChange={(e) => handleChange(e, constraint.id)}
                >
                  {typeOptions.map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id='value'
                  fullWidth
                  label={`Value (${constraint.stateType})`}
                  variant="outlined"
                  color='primary'
                  name='value'
                  value={constraint.value}
                  error={errorMessages[constraint.id] !== undefined}
                  helperText={errorMessages[constraint.id]}
                  onChange={(e) => handleChange(e, constraint.id)}
                  onBlur={(e) => handleBlur(e, constraint.id)}
                />
              </Grid>
            </Grid>
          </Card>
        )
      })}
      <IconButton
        color="secondary"
        size="large"
        onClick={() => setModalOpen(true)}
      >
        <AddCircleIcon fontSize="inherit"/>
      </IconButton>
      {modalOpen && <AddConstraintModal
        states={states}
        subsystem={componentId}
        handleClose={() => {setModalOpen(false)}}
        setConstraints={setConstraints}
        typeOptions={typeOptions}
      />}
    </>
  )
});

export default Constraints;
