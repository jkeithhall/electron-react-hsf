export default function parseJSONFile(text, setStateMethods) {
  const { setSourceName, setBaseSource, setModelSource, setTargetSource, setPythonSource, setOutputPath, setVersion, setStartJD, setStartSeconds, setEndSeconds, setPrimaryStepSeconds, setMaxSchedules, setCropRatio } = setStateMethods;
  const parsedJSON = JSON.parse(text);

  // NOTE: Javascript favors camelCase convention (no spaces), which allows for easier variable naming via destructuring:
  const { Sources } = parsedJSON;
  // If variables have spaces in them, you can still access them via bracket notation:
  const simulationParameters = parsedJSON['Simulation Parameters'];
  const schedulerParameters = parsedJSON['Scheduler Parameters'];

  setSourceName(Sources['Name']);
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
}