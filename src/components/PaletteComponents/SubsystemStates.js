import { useState } from 'react';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MenuItem from '@mui/material/MenuItem';

import DeleteParameterButton from './DeleteButton';
import AddParameterModal from './AddParameterModal';
import { convertDisplayName } from '../../utils/displayNames';

export default function SubsystemStates({ data, id, setComponentList, componentKeys, errors, handleBlur }) {
  const [hovered, setHovered] = useState(-1);
  const [markedForDeletion, setMarkedForDeletion] = useState(-1);
  const [modalOpen, setModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const splitNames = name.split('_');
    const componentIndex = parseInt(splitNames[splitNames.length - 1]);
    const vectorName = splitNames.slice(0, splitNames.length - 1).join('_');

    setComponentList((prevList) => {
      return prevList.map((component) => {
        if (component.id === id) {
          const newStates = component.states.map((state) => {
            if (state.key === name || state.key === vectorName) {
              if (state.type === 'vector' || state.type === 'Matrix') {
                state.value = state.value.map((component, index) => index === componentIndex ? value : component);
              } else {
                state.value = value;
              }
            }
            return state;
          });
          return { ...component, states: newStates };
        } else {
          return component;
        }
      });
    });
  }

  const handleDeleteClicked = (e, index) => {
    e.stopPropagation();
    // If the delete button is clicked, mark the parameter for deletion
    if (markedForDeletion !== index) {
      setMarkedForDeletion(index);
    } else { // If the delete button is clicked again, delete the parameter
      setComponentList((prevList) => {
        return prevList.map((component) => {
          if (component.id === id) {
            const newStates = component.states.filter((_, i) => i !== index);
            return { ...component, states: newStates };
          } else {
            return component;
          }
        });
      });
      setHovered(-1);
      setMarkedForDeletion(-1);
    }
  }

  const handleAddState = (name, value, type) => {
    setComponentList((prevList) => {
      return prevList.map((component) => {
        if (component.id === id) {
          let newStates = [...component.states, { name, type, value, key: name }];
          return { ...component, states: newStates };
        } else {
          return component;
        }
      });
    });
  }

  return (
    <>
      <Typography variant="h6" color="secondary" mt={2}>States</Typography>
      {data.map((state, index) => {
        const { key, value, type } = state;
        if (type === 'double' || type === 'int') {
          return (
            <Stack key={key} direction="row" mt={2}>
              <TextField
                id={key}
                key={key}
                fullWidth
                label={convertDisplayName(key)}
                variant="outlined"
                color='primary'
                name={key}
                value={value}
                type='text'
                onChange={handleChange}
                error={errors[key] !== undefined}
                helperText={errors[key]}
                onBlur={handleBlur}
              />
              <DeleteParameterButton
                index={index}
                markedForDeletion={markedForDeletion}
                hovered={hovered}
                setHovered={setHovered}
                setMarkedForDeletion={setMarkedForDeletion}
                handleDeleteClicked={handleDeleteClicked}
              />
            </Stack>
          );
        } else if (type === 'bool') {
          return (
            <Stack key={key} direction="row" mt={2}>
              <TextField
                id={key}
                key={key}
                fullWidth
                label={convertDisplayName(key)}
                variant="outlined"
                color='primary'
                name={key}
                value={value}
                select
                align='left'
                onChange={handleChange}
                error={errors[key] !== undefined}
                helperText={errors[key]}
                onBlur={handleBlur}
              >
                <MenuItem key='true' value='true'>True</MenuItem>
                <MenuItem key='false' value='false'>False</MenuItem>
              </TextField>
              <DeleteParameterButton
                index={index}
                markedForDeletion={markedForDeletion}
                hovered={hovered}
                setHovered={setHovered}
                setMarkedForDeletion={setMarkedForDeletion}
                handleDeleteClicked={handleDeleteClicked}
              />
            </Stack>
          );
        } else { // 'Matrix' or 'Vector'
          const errorMessage = errors[key];
          const invalidComponents = [];
          if (errorMessage) {
            ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].forEach((component, index) => {
              if (errorMessage.indexOf(component) !== -1) {
                invalidComponents.push(index);
              }
            });
          }

          return (
            <>
              <Typography variant='body2' color="secondary" my={2}>{convertDisplayName(key)}</Typography>
              {errorMessage && <Typography variant="body2" color="error" sx={{ my: 1 }}>{errorMessage}</Typography>}
              <Stack direction="row" mt={2}>
                <Grid container spacing={2} key={key}>
                  {value.map((component, index) => {
                    const componentKey = key + '_' + index;
                    return (
                      <Grid item xs={4} key={componentKey}>
                        <TextField
                          id={componentKey}
                          label={`Component ${index}`}
                          variant="outlined"
                          color="primary"
                          name={componentKey}
                          value={component}
                          type="text"
                          fullWidth
                          onChange={handleChange}
                          error={errorMessage && invalidComponents.includes(index)}
                          onBlur={handleBlur}
                        />
                      </Grid>
                    )
                  })}
                </Grid>
                <DeleteParameterButton
                  index={index}
                  markedForDeletion={markedForDeletion}
                  hovered={hovered}
                  setHovered={setHovered}
                  setMarkedForDeletion={setMarkedForDeletion}
                  handleDeleteClicked={handleDeleteClicked}
                />
              </Stack>
            </>
          )
        }
      })}
      <IconButton
        color="secondary"
        size="large"
        onClick={() => {setModalOpen(true)}}
      >
        <AddCircleIcon fontSize="inherit"/>
      </IconButton>
      {modalOpen && <AddParameterModal
        label='State'
        componentKeys={componentKeys}
        handleClose={() => {setModalOpen(false)}}
        handleAddParameter={handleAddState}
      />}
    </>
  )
}