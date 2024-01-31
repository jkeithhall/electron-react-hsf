import { useState } from 'react';
import Header from './components/Header';
import HSFNav from './components/HSFNav';
import ScenarioCards from './components/ScenarioCards';
import TaskTable from './components/TaskTable';
import Footer from './components/Footer';

import { randomId } from '@mui/x-data-grid-generator';

export default function App() {
  // State variables
  const [activeStep, setActiveStep] = useState('Scenario');
  const [sourceName, setSourceName] = useState('Aeolus');
  const [baseSource, setBaseSource] = useState('./samples/aeolus/');
  const [modelSource, setModelSource] = useState('DSAC_Static_Mod_Scripted.xml');
  const [targetSource, setTargetSource] = useState('v2.2-300targets.xml');
  const [pythonSource, setPythonSource] = useState('pythonScripts/');
  const [outputPath, setOutputPath] = useState('none');
  const [version, setVersion] = useState(1.0);
  const [startJD, setStartJD] = useState(2454680.0);
  const [startSeconds, setStartSeconds] = useState(0.0);
  const [endSeconds, setEndSeconds] = useState(60.0);
  const [primaryStepSeconds, setPrimaryStepSeconds] = useState(30);
  const [maxSchedules, setMaxSchedules] = useState(10);
  const [cropRatio, setCropRatio] = useState(5);
  const [taskList, setTaskList] = useState([{
    id: randomId(),
    taskName: 't6',
    type: 'gt',
    latitude: 37.7749,
    longitude: -122.4194,
    altitude: 0.0,
    priority: 2,
    value: 4,
    minQuality: 5.0,
    desiredCapTime: 28800,
    nonzeroValCapTime: 28800,
  }, {
    id: randomId(),
    taskName: 't7',
    type: 'gt',
    latitude: 47.6061,
    longitude: -122.3328,
    altitude: 0.0,
    priority: 2,
    value: 4,
    minQuality: 5.0,
    desiredCapTime: 28800,
    nonzeroValCapTime: 28800,
  }, {
    id: randomId(),
    taskName: 't8',
    type: 'gt',
    latitude: 34.4208,
    longitude: -119.6982,
    altitude: 0.0,
    priority: 2,
    value: 4,
    minQuality: 5.0,
    desiredCapTime: 28800,
    nonzeroValCapTime: 28800,
  }]);

  // Bundling state variables
  const sources = { sourceName, baseSource, modelSource, targetSource, pythonSource, outputPath, version };
  const simulationParameters = { startJD, startSeconds, endSeconds, primaryStepSeconds };
  const schedulerParameters = { maxSchedules, cropRatio };

  // Bundling state methods
  const setStateMethods = {
    setSourceName, setBaseSource, setModelSource, setTargetSource, setPythonSource, setOutputPath, setVersion, setStartJD, setStartSeconds, setEndSeconds, setPrimaryStepSeconds, setMaxSchedules, setCropRatio, setTaskList
  };

  return (
    <div className="App">
      <Header/>
      <div className="grid-container">
        <HSFNav activeStep={activeStep} setActiveStep={setActiveStep}/>
        <div className='work-space'>
          {activeStep === 'Scenario' &&
            <ScenarioCards
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              sources={sources}
              simulationParameters={simulationParameters}
              schedulerParameters={schedulerParameters}
              setStateMethods={setStateMethods}
            />
          }
          {activeStep === 'Tasks' &&
            <TaskTable
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              setStateMethods={setStateMethods}
              taskList={taskList}
              setTaskList={setTaskList}
            />
          }
        </div>
      </div>
      <Footer/>
    </div>
  );
}

