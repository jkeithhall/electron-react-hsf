import { GridRowModes, GridToolbarContainer } from '@mui/x-data-grid';
import { randomId } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

export default function EditToolbar({setTaskList, setRowModesModel}) {
  const handlePlusClick = () => {
    // Reset all rows to View mode
    setRowModesModel((oldModel) => {
      const newModel = {};
      Object.keys(oldModel).forEach((id) => {
        newModel[id] = { mode: GridRowModes.View };
      });
      return newModel;
    });

    const id = randomId();
    setTaskList((taskList) => {
      // Generate a unique task name
      const newTaskList = [...taskList];
      let taskName = `t${newTaskList.length}`;
      while (newTaskList.find((task) => task.taskName === taskName)) {
        taskName = taskName[0] + (parseInt(taskName.slice(1)) + 1).toString();
      }

      // Add the new task to the task list
      const newTask = {
        id,
        taskName,
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

    // Set the new task to Edit mode
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  }


  return (<GridToolbarContainer>
    <Button color="info" startIcon={<AddIcon />} onClick={handlePlusClick}>
      Add task
    </Button>
  </GridToolbarContainer>
  );
}