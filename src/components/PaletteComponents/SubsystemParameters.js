import { useState } from 'react';

import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import NumericalState from './NumericalState';
import BoolState from './BoolState';
import VectorState from './VectorState';

import AddParameterModal from './AddParameterModal';

export default function SubsystemParameters({
  parameters,
  id,
  setComponentList,
  errors,
  componentKeys,
  handleBlur
}) {
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
      {parameters.map((parameter, index) => {
        const errorMessage = errors[`parameters[${index}]`];
        const { name, value, type } = parameter;
        if (type === 'double' || type === 'int') {
          return (
            <NumericalState
              key={name}
              name={name}
              value={value}
              error={errorMessage}
              constraint={null}
              handleChange={handleChange}
              handleBlur={handleBlur}
              index={index}
              markedForDeletion={markedForDeletion}
              hovered={hovered}
              setHovered={setHovered}
              setMarkedForDeletion={setMarkedForDeletion}
              handleDeleteClicked={handleDeleteClicked}
            />
          );
        } else if (type === 'bool') {
          return (
            <BoolState
              key={name}
              name={name}
              value={value}
              error={errorMessage}
              constraint={null}
              handleChange={handleChange}
              handleBlur={handleBlur}
              index={index}
              markedForDeletion={markedForDeletion}
              hovered={hovered}
              setHovered={setHovered}
              setMarkedForDeletion={setMarkedForDeletion}
              handleDeleteClicked={handleDeleteClicked}
            />
          );
        } else { // Vector or Matrix
          return (
            <VectorState
              key={name}
              name={name}
              value={value}
              errorMessage={errorMessage}
              constraint={null}
              handleChange={handleChange}
              handleBlur={handleBlur}
              index={index}
              markedForDeletion={markedForDeletion}
              hovered={hovered}
              setHovered={setHovered}
              setMarkedForDeletion={setMarkedForDeletion}
              handleDeleteClicked={handleDeleteClicked}
            />
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
        componentKeys={componentKeys}
        handleClose={() => {setModalOpen(false)}}
        handleAddParameter={handleAddParameter}
      />}
    </>
  )
}