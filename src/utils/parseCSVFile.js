import { randomId } from '@mui/x-data-grid-generator';
import { validateAllTasks } from './validateTasks';

export default function parseCSVFile(content, setTaskList, setTaskErrors) {
  try {
    const parsedCSV = content.split('\r\n').map(row => row.split(';'));

    const header = parsedCSV[0];
    let columnIndex = {
      'Task Name': null,
      'Type': null,
      'Max Times': null,
      'Target Name': null,
      'Target Type': null,
      'Value': null,
      'Dyn. State Type': null,
      'Integrator': null,
      'Latitude': null,
      'Longitude': null,
      'Altitude': null,
      'EOMS': null,
    }
    header.forEach((column, index) => {
      if (column in columnIndex) {
        columnIndex[column] = index;
      }
    });

    const taskList = parsedCSV.slice(1).map((row, index) => {
      return {
        id: randomId(),
        name: row[columnIndex['Task Name']],
        type: row[columnIndex['Type']],
        maxTimes: row[columnIndex['Max Times']],
        targetName: row[columnIndex['Target Name']],
        targetType: row[columnIndex['Target Type']],
        targetValue: row[columnIndex['Value']],
        dynamicStateType: row[columnIndex['Dyn. State Type']],
        integratorType: row[columnIndex['Integrator']],
        latitude: row[columnIndex['Latitude']],
        longitude: row[columnIndex['Longitude']],
        altitude: row[columnIndex['Altitude']],
        eomsType: row[columnIndex['EOMS']],
      };
    });

    // Throw error if required fields are missing rather than setting validation errors in state
    const throwable = true;
    validateAllTasks(taskList, setTaskErrors, throwable);
    setTaskList(taskList);
  } catch (error) {
    console.log(`Error parsing CSV file: ${error.message}`);
    throw new Error(`Error parsing CSV file: ${error.message}`);
  }
}