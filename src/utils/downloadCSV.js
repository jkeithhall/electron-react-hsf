export default function downloadCSV(setTaskList) {
  let csv = '';
  setTaskList((currentState) => {
    // const csvInfo = "data:text/csv;charset=utf-8,";
    const header = 'Task Name;Type;Max Times;Target Name;Target Type;Value;Latitude;Longitude;Altitude;Dyn. State Type;Integrator;EOMS\r\n';
    const csvRows = currentState.map((task) => {
      const { name, type, maxTimes, targetName, targetType, targetValue, latitude, longitude, altitude, dynamicStateType, integratorType, eomsType } = task;
      return `${name};${type};${maxTimes};${targetName};${targetType};${targetValue};${latitude};${longitude};${altitude};${dynamicStateType};${integratorType};${eomsType}`;
    });
    csv += header + csvRows.join('\r\n');
    return currentState;
  });
  const blob = new Blob([csv], { type: 'data:text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tasks.csv';
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
  });
}