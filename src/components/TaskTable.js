import { useState } from 'react';
import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import { styled, useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import Tooltip from '@mui/material/Tooltip';
import TaskTableToolbar from './TaskTableToolbar.js';
import ConfirmationModal from './ConfirmationModal';
import LocationModal from './LocationModal';

import { dynStateTypeOptions } from './PaletteComponents/DynamicStateType';
import { validateTaskAt } from '../utils/validateTasks';

// Default pin location in map selector view for added tasks without location
const DEFAULT_LATITUDE = 51.4778;
const DEFAULT_LONGITUDE = 0;
const DEFAULT_ALTITUDE = 0;
const DEFAULT_LOCATION = { lat: DEFAULT_LATITUDE, lon: DEFAULT_LONGITUDE, alt: DEFAULT_ALTITUDE };

const StyledGrid = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  backgroundColor: '#eeeeee',
  '& .Mui-error': {
    backgroundColor: `rgb(126,10,15, ${theme.palette.mode === 'dark' ? 0 : 0.1})`,
    color: theme.palette.error.main,
  },
}));

const validateCellProps = (field, setTaskErrors) => (params) => {
  const task = { ...params.row, [field]: params.props.value };
  validateTaskAt(task, field, setTaskErrors);
  return { ...params.props };
}

const TaskCell = ({ params, taskErrors }) => {
  const { id, field } = params;

  return taskErrors[id] && taskErrors[id][field] ? (
    <Tooltip title={taskErrors[id][field]} placement="top">
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
        {params.value}
      </div>
    </Tooltip>
  ) : (
    <div>{params.value}</div>
  );
};


export default function TaskTable({ navOpen, taskList, setTaskList, taskErrors, setTaskErrors }) {
  const theme = useTheme();

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
    setTaskList(taskList.map((row) => (row.id === newRow.id ? {...newRow} : row)));
    return updatedRow;
  };

  const handleRowEditStop = (params, event) => {
    const { id, reason } = params;
    if (reason === GridRowEditStopReasons.rowFocusOut) {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
      event.defaultMuiPrevented = true;
    }
  };

  const getCellClassName = (params) => {
    const { id, field } = params;
    return taskErrors[id] && taskErrors[id][field] ? 'error' : '';
  }

  const handleDeleteClick = (id) => () => {
    setSelectedTaskId(id);

    const name = taskList.find((row) => row.id === id).name;
    setSelectedTaskName(name);

    setConfirmModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setTaskList(taskList.filter((row) => row.id !== selectedTaskId));
    setTaskErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[selectedTaskId];
      return updatedErrors;
    });
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
    {
      field: 'name',
      headerName: 'Task Name',
      width: 150,
      editable: true,
      preProcessEditCellProps: validateCellProps('name', setTaskErrors),
      renderCell: (params) => <TaskCell params={params} taskErrors={taskErrors} />,
     },
    {
      field: 'type',
      headerName: 'Type',
      type: 'singleSelect',
      valueOptions: [
        'COMM',
        'IMAGING',
      ],
      width: 100,
      editable: true,
      preProcessEditCellProps: validateCellProps('type', setTaskErrors),
      renderCell: (params) => <TaskCell params={params} taskErrors={taskErrors} />,
    },
    {
      field: 'maxTimes',
      type: 'number',
      headerName: 'Max Times',
      width: 100,
      editable: true,
      preProcessEditCellProps: validateCellProps('maxTimes', setTaskErrors),
      renderCell: (params) => <TaskCell params={params} taskErrors={taskErrors} />,
    },
    {
      field: 'targetName',
      headerName: 'Target Name',
      width: 150,
      editable: true,
      preProcessEditCellProps: validateCellProps('targetName', setTaskErrors),
      renderCell: (params) => <TaskCell params={params} taskErrors={taskErrors} />,
     },
    {
      field: 'targetType',
      headerName: 'Target Type',
      type: 'singleSelect',
      valueOptions: [ 'FacilityTarget', 'LocationTarget'],
      width: 130,
      editable: true,
      preProcessEditCellProps: validateCellProps('targetType', setTaskErrors),
      renderCell: (params) => <TaskCell params={params} taskErrors={taskErrors} />,
     },
    {
      field: 'targetValue',
      type: 'number',
      headerName: 'Value',
      width: 80,
      editable: true,
      preProcessEditCellProps: validateCellProps('targetValue', setTaskErrors),
      renderCell: (params) => <TaskCell params={params} taskErrors={taskErrors} />,
    },
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
    {
      field: 'latitude',
      headerName: 'Latitude',
      width: 100,
      editable: true,
      preProcessEditCellProps: validateCellProps('latitude', setTaskErrors),
      renderCell: (params) => <TaskCell params={params} taskErrors={taskErrors} />,
    },
    {
      field: 'longitude',
      headerName: 'Longitude',
      width: 100,
      editable: true,
      preProcessEditCellProps: validateCellProps('longitude', setTaskErrors),
      renderCell: (params) => <TaskCell params={params} taskErrors={taskErrors} />,
    },
    {
      field: 'altitude',
      headerName: 'Altitude',
      width: 90,
      editable: true,
      preProcessEditCellProps: validateCellProps('altitude', setTaskErrors),
      renderCell: (params) => <TaskCell params={params} taskErrors={taskErrors} />,
    },
    {
      field: 'dynamicStateType',
      headerName: 'Dyn. State Type',
      type: 'singleSelect',
      valueOptions: dynStateTypeOptions,
      width: 120,
      editable: true,
      preProcessEditCellProps: validateCellProps('dynamicStateType', setTaskErrors),
      renderCell: (params) => <TaskCell params={params} taskErrors={taskErrors} />,
    },
    {
      field: 'integratorType',
      headerName: 'Integrator',
      width: 90,
      editable: true,
      preProcessEditCellProps: validateCellProps('integratorType', setTaskErrors),
      renderCell: (params) => <TaskCell params={params} taskErrors={taskErrors} />,
    },
    {
      field: 'eomsType',
      headerName: 'EOMS',
      width: 90,
      editable: true,
      preProcessEditCellProps: validateCellProps('eomsType', setTaskErrors),
      renderCell: (params) => <TaskCell params={params} taskErrors={taskErrors} />,
     },
  ];

  const removeModalMessage = selectedTaskName === '' ? 'Are you sure you want to remove this task (unnamed)?' : `Are you sure you want to remove ${selectedTaskName}?`;
  const locationModalTitle = selectedTaskName === '' ? 'Edit location for this task (unnamed)' : `Edit location for ${selectedTaskName}`;

  return (
    <>
      {confirmModalOpen && (
        <div className='stacking-context'>
          <ConfirmationModal
            title={'Remove Task?'}
            message={removeModalMessage}
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
            confirmText={"Remove"}
            cancelText={"Cancel"}
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
      <Paper
        className={`tasks-table ${navOpen ? 'tasks-table-nav-open' : 'tasks-table-nav-closed'}`}
        sx={{ padding: 1, backgroundColor: '#282D3d' }}
      >
        <StyledGrid>
          <DataGrid
            rows={taskList}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            getCellClassName={getCellClassName}
            slots={{
              toolbar: TaskTableToolbar,
            }}
            slotProps={{
              toolbar: { setTaskList, setRowModesModel },
            }}
            density="compact"
            sx={{
              '& .error': {
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                color: theme.palette.error.main,
              },
            }}
          />
        </StyledGrid>
      </Paper>
    </>
  );

}