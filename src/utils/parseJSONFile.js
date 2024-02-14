import { randomId } from '@mui/x-data-grid-generator';

export default function parseJSONFile(fileType, content, setStateMethods) {
  const {
    setSourceName,
    setBaseSource,
    setModelSource,
    setTargetSource,
    setPythonSource,
    setOutputPath,
    setVersion,
    setStartJD,
    setStartSeconds,
    setEndSeconds,
    setPrimaryStepSeconds,
    setMaxSchedules,
    setCropRatio,
    setTaskList,
    setModel
   } = setStateMethods;

  const parsedJSON = JSON.parse(content);

  try {
    switch (fileType) {
      case 'Scenario':
        const { Sources } = parsedJSON;
        const simulationParameters = parsedJSON['Simulation Parameters'];
        const schedulerParameters = parsedJSON['Scheduler Parameters'];

        setSourceName(Sources['Source Name']);
        setBaseSource(Sources['Base Source']);
        setModelSource(Sources['Model Source']);
        setTargetSource(Sources['Target Source']);
        setPythonSource(Sources['Python Source']);
        setOutputPath(Sources['Output Path']);
        setVersion(Sources['Version']);

        setStartJD(simulationParameters['Start JD']);
        setStartSeconds(simulationParameters['Start Seconds']);
        setEndSeconds(simulationParameters['End Seconds']);
        setPrimaryStepSeconds(simulationParameters['Primary Step Seconds']);

        setMaxSchedules(schedulerParameters['Max Schedules']);
        setCropRatio(schedulerParameters['Crop Ratio']);
        break;
      case 'Tasks':
        const taskList = parsedJSON.map(task => {
          return { id: randomId(), ...task };
        });
        setTaskList(taskList);
        break;
      case 'System Model':
        setModel(parsedJSON);
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(`Error parsing JSON file: ${error.message}`);
    throw new Error(`Error parsing JSON file: ${error.message}`);
  }
}