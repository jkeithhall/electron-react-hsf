import { useState, Fragment } from 'react';

import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import NumericalState from './NumericalState';
import BoolState from './BoolState';
import VectorState from './VectorState';
import AddParameterModal from './AddParameterModal';

export default function SubsystemStates({
  states,
  id,
  setComponentList,
  componentKeys,
  constraints,
  scrollToConstraint,
  errors,
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
      {states.map((state, index) => {
        const { key, value, type } = state;
        const errorMessage = errors[`states[${index}]`];
        const constraint = constraints.find((constraint) => constraint.subsystem === id && constraint.stateKey === key);
        if (type === 'double' || type === 'int') {
          return (
            <Fragment key={key}>
              <NumericalState
                name={key}
                value={value}
                error={errorMessage}
                constraint={constraint}
                scrollToConstraint={scrollToConstraint}
                handleChange={handleChange}
                handleBlur={handleBlur}
                index={index}
                markedForDeletion={markedForDeletion}
                hovered={hovered}
                setHovered={setHovered}
                setMarkedForDeletion={setMarkedForDeletion}
                handleDeleteClicked={handleDeleteClicked}
              />
            </Fragment>
          );
        } else if (type === 'bool') {
          return (
            <Fragment key={key}>
              <BoolState
                name={key}
                value={value}
                error={errorMessage}
                constraint={constraint}
                scrollToConstraint={scrollToConstraint}
                handleChange={handleChange}
                handleBlur={handleBlur}
                index={index}
                markedForDeletion={markedForDeletion}
                hovered={hovered}
                setHovered={setHovered}
                setMarkedForDeletion={setMarkedForDeletion}
                handleDeleteClicked={handleDeleteClicked}
              />
            </Fragment>
          )
        } else { // 'Matrix' or 'Vector'
          return (
            <Fragment key={key}>
              <VectorState
                name={key}
                value={value}
                constraint={constraint}
                errorMessage={errorMessage}
                scrollToConstraint={scrollToConstraint}
                handleChange={handleChange}
                handleBlur={handleBlur}
                index={index}
                markedForDeletion={markedForDeletion}
                hovered={hovered}
                setHovered={setHovered}
                setMarkedForDeletion={setMarkedForDeletion}
                handleDeleteClicked={handleDeleteClicked}
              />
            </Fragment>
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