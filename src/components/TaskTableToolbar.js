import {
  GridRowModes,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';
import TaskExportButton from './TaskExportButton';
import { randomId } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';


export default function TaskTableToolbar({setTaskList, setRowModesModel}) {
  const handleAddRowClick = () => {
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
      let name = `Task ${newTaskList.length + 1}`;
      while (newTaskList.find((task) => task.name === name)) {
        name = 'Task ' + (parseInt(name.slice(1)) + 1).toString();
      }

      // Add the new task to the task list
      const newTask = {
        id,
        name,
        type: '',
        maxTimes: 1,
        targetName: '',
        targetType: '',
        targetValue: '',
        dynamicStateType: '',
        integratorType: 'None',
        latitude: '',
        longitude: '',
        altitude: 0,
        eomsType: 'none',
      };

      newTaskList.unshift(newTask);
      return newTaskList;
    });

    // Set the new task to Edit mode
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  }

  return (<GridToolbarContainer>
    <Button color="primary" size='small' startIcon={<AddIcon />} onClick={handleAddRowClick}>
      Add task
    </Button>
    {/* <GridToolbarColumnsButton color="primary"/> */}
    <GridToolbarFilterButton color="primary"/>
    <GridToolbarDensitySelector color="primary"/>
    <TaskExportButton color="primary"/>
  </GridToolbarContainer >
  );
}