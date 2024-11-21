import {
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
  useGridApiContext,
  gridFilteredSortedRowIdsSelector,
  gridVisibleColumnFieldsSelector,
} from "@mui/x-data-grid";
import MenuItem from "@mui/material/MenuItem";
import { reformatTasks } from "../utils/parseTasks";

const getJson = (apiRef) => {
  // Select rows and columns
  const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
  const visibleColumnsField = gridVisibleColumnFieldsSelector(apiRef);

  // Format the data. Here we only keep the value
  const tableData = filteredSortedRowIds.map((id) => {
    const row = {};
    visibleColumnsField.forEach((field) => {
      if (field !== "Delete Row Button" && field !== "Map Selector") {
        row[field] = apiRef.current.getCellParams(id, field).value;
      }
    });
    return row;
  });
  const reformattedTasks = { tasks: reformatTasks(tableData) };

  return JSON.stringify(reformattedTasks, null, 2);
};

const exportBlob = (blob, filename) => {
  // Save the blob in a json file
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  });
};

function JsonExportMenuItem(props) {
  const apiRef = useGridApiContext();

  const { hideMenu } = props;

  return (
    <MenuItem
      onClick={() => {
        const jsonString = getJson(apiRef);
        const blob = new Blob([jsonString], {
          type: "text/json",
        });
        exportBlob(blob, "tasks.json");

        // Hide the export menu after the export
        hideMenu?.();
      }}
    >
      Export JSON
    </MenuItem>
  );
}

const csvOptions = { delimiter: ";", allColumns: true };

export default function TaskExportButton(props) {
  return (
    <GridToolbarExportContainer {...props}>
      <JsonExportMenuItem />
      <GridCsvExportMenuItem options={csvOptions} />
    </GridToolbarExportContainer>
  );
}
