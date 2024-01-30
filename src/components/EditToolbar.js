import { GridRowModes, GridToolbarContainer } from '@mui/x-data-grid';
import { randomId } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

export default function EditToolbar({setTaskList, setRowModesModel}) {
  const handlePlusClick = () => {
    const id = randomId();
    setTaskList((taskList) => {
      const newTaskList = [...taskList];
      const newTask = {
        id,
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