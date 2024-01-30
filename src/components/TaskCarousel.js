import { useState, useRef, useEffect } from 'react';

import TaskCard from './TaskCard';
import FileSelector from './FileSelector';
import Paper from '@mui/material/Paper';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Button from '@mui/material/Button';

// TaskCarousel is deprecated in favor of TaskTable
export default function TaskCarousel({activeStep, setActiveStep, setStateMethods, taskList, setTaskList}) {
  const [ formErrorCount, setFormErrorCount] = useState(0);
  const focusedTask = useRef(null);

  const handlePlusClick = () => {
    setTaskList((taskList) => {
      const newTaskList = [...taskList];
      const newTask = {
        taskName: '',
        type: '',
        latitude: '',
        longitude: '',
        altitude: '',
        priority: '',
        value: '',
        minQuality: '',
        desiredCapTime: '',
        nonzeroValCapTime: '',
      }
      newTaskList.push(newTask);
      return newTaskList;
    });
  }

  const handleNextClick = () => {
    // TO DO: handle validation for tasks
    setActiveStep('System Model');
  };

  // Scroll to bottom of task carousel when a new task is added
  useEffect(() => {
    if (focusedTask.current) {
      focusedTask.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });
    }
  }, [taskList]);

  return (
    <>
      <FileSelector setStateMethods={setStateMethods} activeStep={activeStep}/>
      <Paper sx={{ overflow: 'scroll', display: 'flex', backgroundColor: '#282D3D', padding: '15px' }}>
        {taskList.map((task, index) => {
          const isFocusedTask = index === taskList.length - 1;
          return (
            <TaskCard
              key={index}
              index={index}
              task={task}
              setTaskList={setTaskList}
              formErrorCount={formErrorCount}
              setFormErrorCount={setFormErrorCount}
              ref={isFocusedTask ? focusedTask : null} />
          );
        })}
        <AddCircleIcon fontSize='large' sx={{ margin: '10px', color: '#0288d1', alignSelf: 'flex-end' }} onClick={handlePlusClick}/>
      </Paper>
      <div className='next-step-button-footer'>
        <Button
          variant="contained"
          color= { formErrorCount === 0 ? 'info' : 'error' }
          onClick={handleNextClick}
          disabled={formErrorCount > 0} >
          Next
        </Button>
      </div>
    </>
  );
}