import { useState } from 'react';

import { validateTaskParametersAt } from '../utils/validateParameters';

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import TrashIcon from '@mui/icons-material/Delete';
import ConfirmationModal from './ConfirmationModal';

export default function TaskCard({task, index, setTaskList, formErrorCount, setFormErrorCount}) {
  const [ formErrors, setFormErrors] = useState({});
  const [ modalOpen, setModalOpen ] = useState(false);

  const convertDisplayName = (camelCaseName) => {
    const words = camelCaseName.split(/(?=[A-Z])/);
    const firstWord = words[0];
    words[0] = firstWord[0].toUpperCase() + firstWord.slice(1);
    return words.join(' ');
  }

  const name = task.taskName;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskList((taskList) => {
      const newTaskList = [...taskList];
      newTaskList[index][name] = value;
      return newTaskList;
    });
  }

  const handleBlur = async (e) => {
    const { name } = e.target;
    const previouslyInError = name in formErrors;

    try {
      await validateTaskParametersAt(task, name);
      const newFormErrors = { ...formErrors };
      delete newFormErrors[name];
      setFormErrors(newFormErrors);

      if (previouslyInError) {
        setFormErrorCount(formErrorCount - 1);
      }

    } catch (error) {
      const { message } = error;
      setFormErrors({ ...formErrors, [name]: message });

      if (!previouslyInError) {
        setFormErrorCount(formErrorCount + 1);
      }
    }
  }

  const handleConfirm = () => {
    setModalOpen(false);
    handleRemove();
  }

  const handleRemove = (e) => {
    // TO DO: create modal to first confirm removal
    setTaskList((taskList) => {
      const newTaskList = [...taskList];
      newTaskList.splice(index, 1);
      return newTaskList;
    });
  }

  return (
    <Card sx={{ padding: '10px', margin: '10px', backgroundColor: '#dddddd', borderRadius: '5px', minWidth: '200px', height: '400px', overflow: 'scroll' }}>
      {modalOpen && (
        <div className='stacking-context'>
          <ConfirmationModal
            title={`Remove Task ${name}?`}
            message={`Are you sure you want to remove Task ${name}?`}
            onConfirm={handleConfirm}
            onCancel={() => setModalOpen(false)}
          />
      </div>)}
      <Typography variant="h5" mb={2}>{`Task ${name}`}</Typography>
      {Object.entries(task).map(([key, value]) => {
        const displayName = convertDisplayName(key);
        const valid = !formErrors[key];
        const errorMessage = valid ? ' ' : formErrors[key];

        return (
          <Box key={key}>
            <TextField
              fullWidth
              label={displayName}
              variant="outlined"
              name={key}
              value={value === null ? '' : value}
              color='info'
              onChange={handleChange}
              error={!valid}
              helperText={errorMessage}
              size='small'
              onBlur={handleBlur}
            />
          </Box>
        );
        }
      )}
      <TrashIcon color="secondary" onClick={setModalOpen} />
    </Card>
  );
}