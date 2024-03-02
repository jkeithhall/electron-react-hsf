import { useState } from 'react';
import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import Tooltip from '@mui/material/Tooltip';
import TaskTableToolbar from './TaskTableToolbar.js';
import ConfirmationModal from './ConfirmationModal';
import LocationModal from './LocationModal';

// Default pin location in map selector view for added tasks without location
const DEFAULT_LATITUDE = 51.4778;
const DEFAULT_LONGITUDE = 0;
const DEFAULT_ALTITUDE = 0;
const DEFAULT_LOCATION = { lat: DEFAULT_LATITUDE, lon: DEFAULT_LONGITUDE, alt: DEFAULT_ALTITUDE };

export default function TaskTable({ navOpen, activeStep, setActiveStep, setStateMethods, taskList, setTaskList }) {
  const [ formErrorCount, setFormErrorCount] = useState(0);
  const [rowModesModel, setRowModesModel] = useState({});
  const [confirmModalOpen, setConfirmModalOpen ] = useState(false);
  const [locationModalOpen, setLocationModalOpen ] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(DEFAULT_LOCATION);
  const [selectedTaskName, setSelectedTaskName] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState('');

  // const valid = formErrorCount === 0;

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

    const name = taskList.find((row) => row.id === id).name;
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

    let name = taskList.find((row) => row.id === id).name;
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

  const columns = [
    {
      field: 'Delete Row Button',
      type: 'actions',
      headerName: '',
      width: 50,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<Tooltip title="Delete Task"><DeleteIcon /></Tooltip>}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />
        ];
      },
    },
    { field: 'name', headerName: 'Task Name', width: 150, editable: true },
    {
      field: 'type',
      headerName: 'Type',
      type: 'singleSelect',
      valueOptions: [
        'COMM',
        'IMAGING',
      ],
      width: 100,
      editable: true
    },
    { field: 'maxTimes', type: 'number', headerName: 'Max Times', width: 100, editable: true },
    { field: 'targetName', headerName: 'Target Name', width: 150, editable: true },
    {
      field: 'targetType',
      headerName: 'Target Type',
      type: 'singleSelect',
      valueOptions: [
        'FacilityTarget',
        'LocationTarget',
      ],
      width: 130,
      editable: true },
    { field: 'targetValue', type: 'number', headerName: 'Value', width: 80, editable: true },
    {
      field: 'Map Selector',
      type: 'actions',
      headerName: '',
      width: 50,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<Tooltip title="Edit Location"><EditLocationIcon /></Tooltip>}
            label="Edit"
            className="textPrimary"
            onClick={handleEditLocationClick(id)}
            color="inherit"
          />
        ];
      },
    },
    { field: 'latitude', headerName: 'Latitude', width: 100, editable: true },
    { field: 'longitude', headerName: 'Longitude', width: 100, editable: true },
    { field: 'altitude', headerName: 'Altitude', width: 90, editable: true },
    {
      field: 'dynamicStateType',
      headerName: 'Dyn. State Type',
      type: 'singleSelect',
      valueOptions: [
        'STATIC_LLA',
        'STATIC_ECI',
        'PREDETERMINED_LLA',
        'PREDETERMINED_ECI',
        'DYNAMIC_LLA',
        'DYNAMIC_ECI',
        'STATIC_LVLH',
        'NULL_STATE'
      ],
      width: 120,
      editable: true
    },
    { field: 'integratorType', headerName: 'Integrator', width: 90, editable: true },
    { field: 'eomsType', headerName: 'EOMS', width: 90, editable: true },
  ];

  const removeModalMessage = selectedTaskName === '' ? 'Are you sure you want to remove this task (unnamed)?' : `Are you sure you want to remove ${selectedTaskName}?`;
  const locationModalTitle = selectedTaskName === '' ? 'Edit location for this task (unnamed)' : `Edit location for ${selectedTaskName}`;

  return (
    <>
      {/* <FileHeader activeStep={activeStep} valid={valid} setStateMethods={setStateMethods} handleNextButtonClick={handleNextButtonClick}/> */}
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
      <Paper sx={{ margin: '25px', maxWidth: 'calc(100vw - 280px)', height: 'calc(100vh - 200px)', padding: 1, backgroundColor: '#282D3d' }} >
        <DataGrid
          rows={taskList}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{
            toolbar: TaskTableToolbar,
          }}
          slotProps={{
            toolbar: { setTaskList, setRowModesModel },
          }}
          sx={{ width: '100%', backgroundColor: '#eeeeee' }}
        />
      </Paper>
    </>
  );

}