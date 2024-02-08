import { useState } from 'react';
import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import Tooltip from '@mui/material/Tooltip';
import SaveButton from './SaveButton.js';
import FileSelector from './FileSelector.js';
import EditToolbar from './EditToolbar.js';
import ConfirmationModal from './ConfirmationModal';
import LocationModal from './LocationModal';

const DEFAULT_LATITUDE = 51.4778;
const DEFAULT_LONGITUDE = 0;
const DEFAULT_ALTITUDE = 0;
const DEFAULT_LOCATION = { lat: DEFAULT_LATITUDE, lon: DEFAULT_LONGITUDE, alt: DEFAULT_ALTITUDE };

export default function TaskTable({ activeStep, setActiveStep, setStateMethods, taskList, setTaskList }) {
  const [ formErrorCount, setFormErrorCount] = useState(0);
  const [rowModesModel, setRowModesModel] = useState({});
  const [confirmModalOpen, setConfirmModalOpen ] = useState(false);
  const [locationModalOpen, setLocationModalOpen ] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(DEFAULT_LOCATION);
  const [selectedTaskName, setSelectedTaskName] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState('');


  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setTaskList(taskList.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowEditStop = (params, event) => {
    const { id, reason } = params;
    if (reason === GridRowEditStopReasons.rowFocusOut) {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
      event.defaultMuiPrevented = true;
    }
  };

  const handleDeleteClick = (id) => () => {
    setSelectedTaskId(id);

    const name = taskList.find((row) => row.id === id).taskName;
    setSelectedTaskName(name);

    setConfirmModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setTaskList(taskList.filter((row) => row.id !== selectedTaskId));
    setSelectedTaskName('');
    setSelectedTaskId('');
    setConfirmModalOpen(false);
  }

  const handleDeleteCancel = () => {
    setSelectedTaskName('');
    setSelectedTaskId('');
    setConfirmModalOpen(false);
  }

  const handleEditLocationClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    setSelectedTaskId(id);

    let startingLat = taskList.find((row) => row.id === id).latitude;
    if (startingLat === '') {
      startingLat = DEFAULT_LATITUDE;
    }

    let startingLon = taskList.find((row) => row.id === id).longitude;
    if (startingLon === '') {
      startingLon = DEFAULT_LONGITUDE;
    }
    let startingAlt = taskList.find((row) => row.id === id).altitude;
    if (startingAlt === '') {
      startingAlt = DEFAULT_ALTITUDE;
    }
    const startingLocation = { lat: startingLat, lon: startingLon, alt: startingAlt };

    setSelectedLocation(startingLocation);

    let name = taskList.find((row) => row.id === id).taskName;
    setSelectedTaskName(name);

    setLocationModalOpen(true);
  };

  const handleLocationConfirm = (location) => () => {
    const [ latitude, longitude ] = location;
    const updatedRow = { ...taskList.find((row) => row.id === selectedTaskId), latitude, longitude };
    const updatedTasks = taskList.map((row) => (row.id === selectedTaskId ? updatedRow : row));
    setTaskList(updatedTasks);
    setSelectedTaskName('');
    setSelectedTaskId('');
    setSelectedLocation(DEFAULT_LOCATION);
    setLocationModalOpen(false);
  };

  const handleLocationCancel = () => {
    setSelectedTaskName('');
    setSelectedTaskId('');
    setSelectedLocation(DEFAULT_LOCATION);
    setLocationModalOpen(false);
  }

  const handleNextClick = () => {
    // TO DO: handle validation for tasks
    setActiveStep('System Model');
  };

  const columns = [
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<Tooltip title="Edit Location"><EditLocationIcon /></Tooltip>}
            label="Edit"
            className="textPrimary"
            onClick={handleEditLocationClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<Tooltip title="Delete Task"><DeleteIcon /></Tooltip>}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
    { field: 'taskName', headerName: 'Task Name', width: 120, editable: true },
    { field: 'type', headerName: 'Type', width: 120, editable: true },
    { field: 'latitude', headerName: 'Latitude', width: 120, editable: true },
    { field: 'longitude', headerName: 'Longitude', width: 120, editable: true },
    { field: 'altitude', headerName: 'Altitude', width: 120, editable: true },
    { field: 'priority', headerName: 'Priority', width: 100, editable: true },
    { field: 'value', headerName: 'Value', width: 100, editable: true },
    { field: 'minQuality', headerName: 'Min Quality', width: 100, editable: true },
    { field: 'desiredCapTime', headerName: 'Desired Cap Time', width: 150, editable: true },
    { field: 'nonzeroValCapTime', headerName: 'Nonzero Val Cap Time', width: 170, editable: true },
  ];

  const removeModalMessage = selectedTaskName === '' ? 'Are you sure you want to remove this task (unnamed)?' : `Are you sure you want to remove Task ${selectedTaskName}?`;
  const locationModalTitle = selectedTaskName === '' ? 'Edit location for this task (unnamed)' : `Edit location for Task ${selectedTaskName}`;

  return (
    <>
      <FileSelector activeStep={activeStep} setStateMethods={setStateMethods}/>
      {confirmModalOpen && (
        <div className='stacking-context'>
          <ConfirmationModal
            title={'Remove Task?'}
            message={removeModalMessage}
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
          />
      </div>)}
      {locationModalOpen && (
        <div className='stacking-context'>
          <LocationModal
            title={locationModalTitle}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            onConfirm={handleLocationConfirm}
            onCancel={handleLocationCancel}
          />
      </div>)}
      <Paper sx={{ maxWidth: '1150px', height: 475, padding: 1 }} >
        <DataGrid
          rows={taskList}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setTaskList, setRowModesModel },
          }}
          sx={{ backgroundColor: '#eeeeee' }}
        />
      </Paper>
      <div className='button-footer'>
        <SaveButton
          activeStep={activeStep}
          taskList={taskList}
          setStateMethods={setStateMethods}
        />
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