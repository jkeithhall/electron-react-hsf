import { useState } from "react";
import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import ConfirmationModal from "./ConfirmationModal";

import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

import { randomId } from "@mui/x-data-grid-generator";
import { shortenPath } from "../utils/shortenPath.js";
import { validateEvaluator } from "../utils/validateEvaluator";
import { convertDisplayName } from "../utils/displayNames";

const evaluatorTypeOptions = ["scripted", "TargetValueEvaluator", "default"];

function Evaluator({
  evaluator,
  setEvaluator,
  formErrors,
  setFormErrors,
  componentList,
  pythonDirectorySrc,
}) {
  const { type, src, className, keyRequests } = evaluator;
  const [rowModesModel, setRowModesModel] = useState({});
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState("");
  const [selectedKeyRequestName, setSelectedKeyRequestName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvaluator({ ...evaluator, [name]: value });
  };

  const handleBlur = () => {
    validateEvaluator(
      evaluator,
      setFormErrors,
      componentList,
      pythonDirectorySrc,
    );
  };

  const handleFileSelected = (filePath) => {
    setEvaluator((prevEvaluator) => {
      return { ...prevEvaluator, src: filePath };
    });
    validateEvaluator(
      { ...evaluator, src: filePath },
      setFormErrors,
      componentList,
      pythonDirectorySrc,
    );
  };

  const handleFileClick = () => {
    if (window.electronApi) {
      window.electronApi.selectFile(src, "Python", handleFileSelected);
    }
  };

  const componentNames = componentList.reduce((acc, component) => {
    acc[component.id] = component.name;
    return acc;
  }, {});

  const subsystemLabels = componentList.reduce((acc, component) => {
    const { id, parent } = component;
    if (parent) {
      acc[id] = `${componentNames[id]} (${componentNames[parent]})`;
    }
    return acc;
  }, {});

  const subsystemValueOptions = Object.entries(subsystemLabels).map(
    ([id, label]) => {
      return { value: id, label: label };
    },
  );

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  // Update the row in the DataGrid
  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    const asset = componentList.find(
      (component) => component.id === newRow.subsystem,
    ).parent;
    const newKeyRequest = { ...newRow, asset };
    delete newKeyRequest.isNew;
    setEvaluator({
      ...evaluator,
      keyRequests: keyRequests.map((keyreq) =>
        keyreq.id === newRow.id ? newKeyRequest : keyreq,
      ),
    });
    return updatedRow;
  };

  const handleRowEditStop = (params, event) => {
    const { id, reason } = params;
    if (reason === GridRowEditStopReasons.rowFocusOut) {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
      event.defaultMuiPrevented = true;
    }
  };

  const handleDeleteClick = (id) => {
    const keyRequest = keyRequests.find((row) => row.id === id);
    const { subsystem, type, asset } = keyRequest;
    if (!subsystem && !type && !asset) {
      handleDeleteConfirm(id);
    } else {
      setSelectedKeyRequestName(subsystemLabels[subsystem]);
      setSelectedRowId(id);
      setConfirmModalOpen(true);
    }
  };

  const handleDeleteConfirm = (deleteRowId) => {
    setEvaluator({
      ...evaluator,
      keyRequests: keyRequests.filter((row) => row.id !== deleteRowId),
    });
    setSelectedKeyRequestName("");
    setSelectedRowId("");
    setConfirmModalOpen(false);
  };

  const handleDeleteCancel = () => {
    setSelectedKeyRequestName("");
    setSelectedRowId("");
    setConfirmModalOpen(false);
  };

  const columns = [
    {
      field: "Delete Row Button",
      type: "actions",
      headerName: "",
      width: 50,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={
              <Tooltip title="Delete Key Request">
                <DeleteIcon />
              </Tooltip>
            }
            label="Delete"
            onClick={() => handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
    {
      field: "subsystem",
      headerName: "Subsystem",
      type: "singleSelect",
      valueOptions: subsystemValueOptions,
      width: 250,
      editable: true,
      preProcessEditCellProps: (params) => {
        const hasError = !Object.values(subsystemValueOptions)
          .map((option) => option.value)
          .includes(params.props.value);
        setFormErrors((prevErrors) => {
          const updatedErrors = { ...prevErrors };

          if (hasError) {
            updatedErrors[params.id] = {
              ...updatedErrors[params.id],
              subsystem: "Subsystem must be selected",
            };
          } else if (updatedErrors[params.id]) {
            delete updatedErrors[params.id].subsystem;

            // If the object is empty after deletion, remove the key entirely
            if (Object.keys(updatedErrors[params.id]).length === 0) {
              delete updatedErrors[params.id];
            }
          }

          return updatedErrors;
        });
        return { ...params.props, error: hasError };
      },
    },
    {
      field: "type",
      headerName: "Type",
      type: "singleSelect",
      valueOptions: ["float", "double", "int"],
      width: 100,
      editable: true,
      preProcessEditCellProps: (params) => {
        const hasError = !["float", "double", "int"].includes(
          params.props.value,
        );
        setFormErrors((prevErrors) => {
          const updatedErrors = { ...prevErrors };

          if (hasError) {
            updatedErrors[params.id] = {
              ...updatedErrors[params.id],
              evaluatorType: "Evaluator type must be selected",
            };
          } else if (updatedErrors[params.id]) {
            delete updatedErrors[params.id].evaluatorType;

            // If the object is empty after deletion, remove the key entirely
            if (Object.keys(updatedErrors[params.id]).length === 0) {
              delete updatedErrors[params.id];
            }
          }

          return updatedErrors;
        });
        return { ...params.props, error: hasError };
      },
    },
  ];

  return (
    <>
      {confirmModalOpen && (
        <div className="stacking-context">
          <ConfirmationModal
            title={"Remove Key Request?"}
            message={`Are you sure you want to remove the key request on ${selectedKeyRequestName}?`}
            onConfirm={() => handleDeleteConfirm(selectedRowId)}
            onCancel={handleDeleteCancel}
            confirmText={"Remove"}
            cancelText={"Cancel"}
          />
        </div>
      )}
      <Box
        sx={{
          padding: "5px",
          backgroundColor: "#eeeeee",
          borderRadius: "5px",
          height: 500,
          overflow: "scroll",
        }}
      >
        <Box my={1}>
          <TextField
            fullWidth
            align="left"
            label={"Type"}
            variant="outlined"
            color="primary"
            name={"type"}
            value={type}
            onChange={handleChange}
            select
          >
            {evaluatorTypeOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {convertDisplayName(option)}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box my={1}>
          {type === "scripted" ? (
            <TextField
              fullWidth
              label={"Source File"}
              variant="outlined"
              color="primary"
              name={src}
              value={shortenPath(src, 50)}
              type={"text"}
              onClick={handleFileClick}
              onBlur={handleBlur}
              error={formErrors["src"] !== undefined}
              helperText={formErrors["src"]}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <FolderIcon />
                  </InputAdornment>
                ),
              }}
            />
          ) : (
            <TextField
              fullWidth
              label={"Class Name"}
              variant="outlined"
              color="primary"
              name={"className"}
              value={className}
              type={"text"}
              onChange={handleChange}
              onBlur={handleBlur}
              error={formErrors["className"] !== undefined}
              helperText={formErrors["className"]}
            />
          )}
        </Box>
        <Box my={1} sx={{ height: 309 }}>
          <Typography variant="h6" my={1} color="secondary">
            Key Requests
          </Typography>
          <DataGrid
            rows={keyRequests}
            columns={columns}
            pageSizeOptions={[5]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5, page: 0 },
              },
            }}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            slots={{
              toolbar: KeyRequestToolbar,
            }}
            slotProps={{
              toolbar: { setEvaluator, setRowModesModel },
            }}
            sx={{ width: "100%", backgroundColor: "#eeeeee" }}
            density="compact"
          />
        </Box>
      </Box>
    </>
  );
}

function KeyRequestToolbar({ setEvaluator, setRowModesModel }) {
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
    setEvaluator((prevEvaluator) => {
      return {
        ...prevEvaluator,
        keyRequests: [
          { id, subsystem: "", type: "", asset: "" },
          ...prevEvaluator.keyRequests,
        ],
      };
    });
  };

  return (
    <GridToolbarContainer>
      <Button
        color="primary"
        size="small"
        startIcon={<AddIcon />}
        onClick={handleAddRowClick}
      >
        Add Key Request
      </Button>
    </GridToolbarContainer>
  );
}

export { Evaluator, evaluatorTypeOptions };
