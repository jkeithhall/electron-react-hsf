// Need to move this to a file open event response...
import './App.css';
import './App.scss'
import { useRef, useState } from 'react';
//import ListGroupItem from 'react-bootstrap/esm/ListGroupItem';
import Header from './components/Header';
import HSFNav from './components/HSFNav';
import HSFCards from './components/HSFCards';
import Footer from './components/Footer';
import InformationBar from './components/InformationBar';

import parseJSONFile from './utils/parseJSONFile';

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

  // Bundling state variables
  const sources = { sourceName, baseSource, modelSource, targetSource, pythonSource, outputPath, version };
  const setSources = { setSourceName, setBaseSource, setModelSource, setTargetSource, setPythonSource, setOutputPath, setVersion };
  const simulationParameters = { startJD, startSeconds, endSeconds, primaryStepSeconds };
  const setSimulationParameters = { setStartJD, setStartSeconds, setEndSeconds, setPrimaryStepSeconds };
  const schedulerParameters = { maxSchedules, cropRatio };
  const setSchedulerParameters = { setMaxSchedules, setCropRatio };

  const setStateMethods = {
    setSourceName, setBaseSource, setModelSource, setTargetSource, setPythonSource, setOutputPath, setVersion, setStartJD, setStartSeconds, setEndSeconds, setPrimaryStepSeconds, setMaxSchedules, setCropRatio
  };

  const readFile = async (e) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      parseJSONFile(text, setStateMethods);
    };
    reader.readAsText(e.target.files[0]);
  }

  return (
    <div className="App">
      <div className="grid-container">
        <Header readFile={readFile}/>
        <HSFNav activeStep={activeStep} setActiveStep={setActiveStep}/>
        <HSFCards
          sources={sources}
          simulationParameters={simulationParameters}
          schedulerParameters={schedulerParameters}
          setStateMethods={setStateMethods}
        />
        <InformationBar/>
        <Footer/>
      </div>
    </div>
  );
}

