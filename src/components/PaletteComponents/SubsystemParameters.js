import { useState } from 'react';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import DeleteParameterButton from './DeleteButton';
import AddParameterModal from './AddParameterModal';
import { convertDisplayName } from '../../utils/displayNames';

export default function SubsystemParameters({data, id, setComponentList }) {
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
          const newParameters = component.parameters.map((parameter) => {
            if (parameter.name === name || parameter.name === vectorName) {
              if (parameter.type === 'vector') {
                  parameter.value = parameter.value.map((component, index) => index === componentIndex ? value : component);
              } else {
                parameter.value = value;
              }
            }
            return parameter;
          });
          return { ...component, parameters: newParameters };
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
            const newParameters = component.parameters.filter((_, i) => i !== index);
            return { ...component, parameters: newParameters };
          } else {
            return component;
          }
        });
      });
      setHovered(-1);
      setMarkedForDeletion(-1);
    }
  }

  const handleAddParameter = (name, value, type) => {
    setComponentList((prevList) => {
      return prevList.map((component) => {
        if (component.id === id) {
          let newParameters = [...component.parameters, { name, type, value }];
          return { ...component, parameters: newParameters };
        } else {
          return component;
        }
      });
    });
  }


  return (
    <>
      <Typography variant="h6" color="secondary" mt={2}>Parameters</Typography>
      {data.map((parameter, index) => {
        const { name, value, type } = parameter;
        if (type === 'double' || type === 'int') {
          return (
            <Stack key={name} direction="row" mt={2}>
              <TextField
                id={name}
                key={name}
                fullWidth
                label={convertDisplayName(name)}
                variant="outlined"
                color='primary'
                name={name}
                value={value}
                type='text'
                onChange={handleChange}
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
            <Stack key={name} direction="row" mt={2}>
              <TextField
                id={name}
                key={name}
                fullWidth
                label={convertDisplayName(name)}
                variant="outlined"
                color='primary'
                name={name}
                value={value}
                select
                align='left'
                onChange={handleChange}
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
        } else { // vector/matrix
          return (
            <>
              <Typography variant='body2' color="secondary" my={2}>{convertDisplayName(name)}</Typography>
              <Stack key={name} direction="row" mt={2}>
                <Grid container spacing={2} key={name}>
                  {value.map((component, index) => {
                    const componentKey = name+ '_' + index;
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
                        />
                    </Grid>)
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
        label="Parameter"
        handleClose={() => {setModalOpen(false)}}
        handleAddParameter={handleAddParameter}
      />}
    </>
  )
}