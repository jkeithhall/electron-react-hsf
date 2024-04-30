import { useState } from 'react';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import DeleteParameterButton from './DeleteButton';
import AddParameterModal from './AddParameterModal';

export default function IntegratorOptions({ data, setComponentList, id, errors, componentKeys, handleBlur }) {
  const [hovered, setHovered] = useState(-1);
  const [markedForDeletion, setMarkedForDeletion] = useState(-1);
  const [modalOpen, setModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setComponentList((prevList) => {
      return prevList.map((component) => {
        if (component.id === id) {
          const newIntegratorOptions = { ...component.integratorOptions };
          newIntegratorOptions[name] = value;
          return { ...component, integratorOptions: newIntegratorOptions };
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
            const newIntegratorOptionsArray = Object.entries(component.integratorOptions).filter((_, i) => i !== index);
            const newIntegratorOptions = newIntegratorOptionsArray.reduce((acc, [key, value]) => {
              acc[key] = value;
              return acc;
            }, {});
            return { ...component, integratorOptions: newIntegratorOptions };
          } else {
            return component;
          }
        });
      });
      setHovered(-1);
      setMarkedForDeletion(-1);
    }
  }

  const handleAddOption = (name, value) => {
    setComponentList((prevList) => {
      return prevList.map((component) => {
        if (component.id === id) {
          let newIntegratorOptions = { ...component.integratorOptions };
          newIntegratorOptions[name] = value;
          return { ...component, integratorOptions: newIntegratorOptions };
        } else {
          return component;
        }
      });
    });
  }

  return (
    <>
      <Typography variant="h6" color="secondary" my={2}>Integrator Options</Typography>
      {Object.entries(data).map(([key, value], index) => (
        <Stack key={key} direction="row" mt={2}>
          <TextField
            id={key}
            label={key}
            key={key}
            fullWidth
            variant="outlined"
            color="primary"
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
      ))}
      <IconButton
        color="secondary"
        size="large"
        onClick={() => {setModalOpen(true)}}
      >
        <AddCircleIcon fontSize="inherit"/>
      </IconButton>
      {modalOpen && <AddParameterModal
        label="Integrator Option"
        componentKeys={componentKeys}
        handleClose={() => {setModalOpen(false)}}
        handleAddParameter={handleAddOption}
      />}
    </>
  )
}