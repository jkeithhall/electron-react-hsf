import { useState } from 'react';
import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import ConstraintsTableToolbar from './ConstraintsTableToolbar';
import ConfirmationModal from './ConfirmationModal';

import { constraintTypeOptions } from './PaletteComponents/Constraints';
import { convertDisplayName } from '../utils/displayNames';

const StyledGrid = styled('div')(({ theme }) => ({
  '& .Mui-error': {
    backgroundColor: `rgb(126,10,15, ${theme.palette.mode === 'dark' ? 0 : 0.1})`,
    color: theme.palette.error.main,
  },
}));

export default function ConstraintsTable({
  navOpen,
  constraints,
  setConstraints,
  componentList,
  constraintErrors,
  setConstraintErrors,
}) {
  const [ rowModesModel, setRowModesModel ] = useState({});
  const [ confirmModalOpen, setConfirmModalOpen ] = useState(false);
  const [ selectedConstraintId, setSelectedConstraintId ] = useState('');
  const [ selectedConstraintName, setSelectedConstraintName ] = useState('');

  console.log({ constraints, constraintErrors });

  // Create a map of component IDs to component names
  const componentNames = componentList.reduce((acc, component) => {
    acc[component.id] = component.name;
    return acc;
  }, {});

  // Create a map of subsystem IDs to subsystem labels: component name [(parent name)]
  const subsystemLabels = componentList.reduce((acc, component) => {
    const { id, parent, states } = component;
    if (parent) {
      const hasIntDoubleStates = states.some((state) => state.type === 'int' || state.type === 'double');
      if (hasIntDoubleStates) {
        acc[id] = `${componentNames[id]} (${componentNames[parent]})`;
      }
    }
    return acc;
  }, {});

  // Create an array of subsystem label options for the subsystem column
  const subsystemValueOptions = Object.entries(subsystemLabels).map(([id, label]) => {
    return { value: id, label: label };
  });

  const stateKeyOptions = ({ row }) => {
    const options = [];
    const { subsystem } = row;
    if (subsystem) {
      const states = componentList.find((component) => component.id === subsystem).states;
      states.forEach((state) => {
        if (state.type === 'int' || state.type === 'double') {
          const displayName = convertDisplayName(state.key);
          options.push({ value: state.key, label: `${displayName} (${state.type})`});
        }
      });
    }
    return options;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    const { stateKey } = newRow;
    const stateType = stateKey ? componentList.find((component) => component.id === newRow.subsystem).states.find((state) => state.key === newRow.stateKey).type : '';
    const newConstraint = { ...newRow, stateType };
    delete newConstraint.isNew;
    setConstraints(constraints.map((row) => (row.id === newRow.id ? newConstraint : row)));
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
    const constraint = constraints.find((row) => row.id === id);
    const { name, subsystem, stateKey, type, value } = constraint;
    if (!subsystem && !stateKey && !type && !value) {
      handleDeleteConfirm(id);
    } else {
      setSelectedConstraintName(name);
      setSelectedConstraintId(id);
      setConfirmModalOpen(true);
    }
  };

  const handleDeleteConfirm = (deleteRowId) => {
    setConstraints(constraints.filter((row) => row.id !== deleteRowId));
    setSelectedConstraintName('');
    setSelectedConstraintId('');
    setConfirmModalOpen(false);
  };

  const handleDeleteCancel = () => {
    setSelectedConstraintName('');
    setSelectedConstraintId('');
    setConfirmModalOpen(false);
  };

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
            icon={<Tooltip title="Delete Constraint"><DeleteIcon /></Tooltip>}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />
        ];
      },
    },
    {
      field: 'name',
      headerName: 'Constraint Name',
      width: 150,
      editable: true,
      preProcessEditCellProps: (params) => {
        let hasError = !params.props.value || params.props.value === '';
        if (hasError) {
          setConstraintErrors({ ...constraintErrors, [params.id]: 'Constraint name cannot be empty' });
        } else {
          setConstraintErrors(prevErrors => {
            delete prevErrors[params.id];
            return prevErrors;
          });
        }
        return { ...params.props, error: hasError };
      }
    },
    {
      field: 'subsystem',
      headerName: 'Subsystem',
      type: 'singleSelect',
      valueOptions: subsystemValueOptions,
      width: 200,
      editable: true,
      preProcessEditCellProps: (params) => {
        let hasError = !Object.keys(subsystemLabels).includes(params.props.value);
        if (hasError) {
          setConstraintErrors({ ...constraintErrors, [params.id]: 'Subsystem must be selected' });
        } else {
          setConstraintErrors(prevErrors => {
            delete prevErrors[params.id];
            return prevErrors;
          });
        }
        return { ...params.props, error: hasError };
      }
    },
    {
      field: 'stateKey',
      headerName: 'State Key',
      type: 'singleSelect',
      valueOptions: stateKeyOptions,
      width: 250,
      editable: true,
      preProcessEditCellProps: (params) => {
        console.log(params.props.value);
        console.log(stateKeyOptions(params));
        let hasError = !Object.values(stateKeyOptions(params)).map(option => option.value).includes(params.props.value);
        if (hasError) {
          setConstraintErrors({ ...constraintErrors, [params.id]: 'State key must be selected' });
        } else {
          setConstraintErrors(prevErrors => {
            delete prevErrors[params.id];
            return prevErrors;
          });
        }
        return { ...params.props, error: hasError };
      }
    },
    {
      field: 'type',
      headerName: 'Type',
      type: 'singleSelect',
      valueOptions: constraintTypeOptions,
      width: 270,
      editable: true,
      preProcessEditCellProps: (params) => {
        let hasError = !constraintTypeOptions.includes(params.props.value);
        if (hasError) {
          setConstraintErrors({ ...constraintErrors, [params.id]: 'Type must be selected' });
        } else {
          setConstraintErrors(prevErrors => {
            delete prevErrors[params.id];
            return prevErrors;
          });
        }
        return { ...params.props, error: hasError };
      }
    },
    {
      field: 'value',
      headerName: 'Value',
      width: 100,
      editable: true,
      preProcessEditCellProps: (params) => {
        let hasError = !params.props.value || params.props.value === '' || isNaN(params.props.value);
        if (hasError) {
          setConstraintErrors({ ...constraintErrors, [params.id]: 'Value cannot be empty' });
        } else {
          setConstraintErrors(prevErrors => {
            delete prevErrors[params.id];
            return prevErrors;
          });
        }
        return { ...params.props, error: hasError };
      }
    }
  ];

  const removeModalMessage = selectedConstraintName === '' ? 'Are you sure you want to remove this constraint (unnamed)?' : `Are you sure you want to remove the constraint "${selectedConstraintName}"?`;

  return (
    <>
      {confirmModalOpen && (
        <div className='stacking-context'>
          <ConfirmationModal
            title={'Remove Constraint?'}
            message={removeModalMessage}
            onConfirm={() => handleDeleteConfirm(selectedConstraintId)}
            onCancel={handleDeleteCancel}
            confirmText={"Remove"}
            cancelText={"Cancel"}
          />
      </div>)}
      <Paper
        className={`constraints-table ${navOpen ? 'constraints-table-nav-open' : 'constraints-table-nav-closed'}`}
        sx={{ padding: 1, backgroundColor: '#282D3d', height: 675, width: 1100 }}
      >
        <StyledGrid sx={{ width: '100%', backgroundColor: '#eeeeee' }}>
          <DataGrid
            rows={constraints}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            pageSizeOptions={[10]}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={console.error}
            slots={{
              toolbar: ConstraintsTableToolbar,
            }}
            slotProps={{
              toolbar: { setConstraints, setRowModesModel },
            }}
            density="compact"
          />
        </StyledGrid>
      </Paper>
    </>
  )
}