import { useEffect, useState } from 'react';
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
import PublicIcon from '@mui/icons-material/Public';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Viewer, CzmlDataSource } from "resium";
import { addTaskPacketsToCzml } from '../utils/buildCzml';

export default function TaskTableToolbar({taskList, setTaskList, setRowModesModel }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [czmlData, setCzmlData] = useState([]);

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

  function handleModalOpen() {
    setModalOpen(true);
  }

  function handleModalClose() {
    setModalOpen(false);
  }

  useEffect(() => {
    const newCzml = [{
      id: "document",
      name: `Target List - ${new Date().toISOString()}`,
      version: "1.0",
    }];
    addTaskPacketsToCzml(newCzml, taskList);
    console.log({newCzml});
    setCzmlData(newCzml);
  }, [taskList]);

  return (<GridToolbarContainer>
    <Button color="primary" size='small' startIcon={<AddIcon />} onClick={handleAddRowClick}>
      Add task
    </Button>
    <GridToolbarColumnsButton color="primary"/>
    <GridToolbarFilterButton color="primary"/>
    <GridToolbarDensitySelector color="primary"/>
    <TaskExportButton color="primary"/>
    <Button color="primary" size='small' startIcon={<PublicIcon />} onClick={handleModalOpen}>
      Globe
    </Button>
    <Modal
      open={modalOpen}
      onClose={handleModalClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{
        // Translucent background
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        width: '900px',
        height: '460px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -40%)',
        padding: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '5px',
      }}
      >
        <Box sx={{width: '100%'}}>
          {czmlData.length > 0 &&
            <Viewer
              animation={false}
              timeline={false}
              fullscreenButton={false}
            >
              <CzmlDataSource data={czmlData} key={czmlData[0]?.name} />
            </Viewer>}
        </Box>
      </Box>
  </Modal>
  </GridToolbarContainer >
  );
}