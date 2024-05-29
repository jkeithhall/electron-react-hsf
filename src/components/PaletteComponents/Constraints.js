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

import { convertDisplayName } from '../../utils/displayNames';

const typeOptions = ['FAIL_IF_HIGHER', 'FAIL_IF_LOWER', 'FAIL_IF_EQUAL', 'FAIL_IF_NOT_EQUAL', 'FAIL_IF_HIGHER_OR_EQUAL', 'FAIL_IF_LOWER_OR_EQUAL'];
const stateTypeOptions = ['double', 'int'];

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
  const [hovered, setHovered] = useState(null);
  const [markedForDeletion, setMarkedForDeletion] = useState(null);
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
      <Typography variant="h6" color="secondary" mb={2} sx={{ flexGrow: 1, textAlign: 'center' }}>Constraints</Typography>
      {constraints.map((constraint, index) => {
        if (constraint.subsystem !== componentId) return null;

        return (
          <Card key={constraint.id} ref={ref[index]} sx={{ padding: 1, borderRadius: 2, borderColor: 'primary' }}>
            <Stack direction="row" alignItems="center" sx={{ position: 'relative', width: '100%' }}>
              <Typography variant="body1" my={2} sx={{ flexGrow: 1, textAlign: 'center' }}>{convertDisplayName(constraint.stateKey)}</Typography>
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
            <Grid container spacing={2} my={2}>
              <Grid item xs={6}>
                <TextField
                  id='name'
                  fullWidth
                  label='Name'
                  variant="outlined"
                  color='primary'
                  name='name'
                  value={constraint.name}
                  onChange={(e) => handleChange(e, constraint.id)}
                />
              </Grid>
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
            </Grid>
            <Grid container spacing={2} my={2}>
              <Grid item xs={6}>
                <TextField
                  id='stateType'
                  fullWidth
                  label='State Type'
                  variant="outlined"
                  color='primary'
                  name='stateType'
                  value={constraint.stateType}
                  select
                  align='left'
                  onChange={(e) => handleChange(e, constraint.id)}
                >
                  {stateTypeOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id='value'
                  fullWidth
                  label='Value'
                  variant="outlined"
                  color='primary'
                  name='value'
                  value={constraint.value}
                  onChange={(e) => handleChange(e, constraint.id)}
                />
              </Grid>
            </Grid>
          </Card>
        )
      })}
      <IconButton
        color="secondary"
        size="large"
        onClick={() => {}}
      >
        <AddCircleIcon fontSize="inherit"/>
      </IconButton>
    </>
  )
});

export default Constraints;
