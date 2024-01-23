import { useState } from 'react';
import Header from './components/Header';
import HSFNav from './components/HSFNav';
import FileSelector from './components/FileSelector';
import HSFCards from './components/HSFCards';
import Footer from './components/Footer';
import InformationBar from './components/InformationBar';

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
  const simulationParameters = { startJD, startSeconds, endSeconds, primaryStepSeconds };
  const schedulerParameters = { maxSchedules, cropRatio };

  // Bundling state methods
  const setStateMethods = {
    setSourceName, setBaseSource, setModelSource, setTargetSource, setPythonSource, setOutputPath, setVersion, setStartJD, setStartSeconds, setEndSeconds, setPrimaryStepSeconds, setMaxSchedules, setCropRatio
  };

  return (
    <div className="App">
      <Header/>
      <div className="grid-container">
        <HSFNav activeStep={activeStep} setActiveStep={setActiveStep}/>
        <div className='work-space'>
          {(activeStep === 'Scenario' || activeStep === 'Tasks') &&
            <FileSelector setStateMethods={setStateMethods} activeStep={activeStep}/>
          }
          {activeStep === 'Scenario' &&
            <HSFCards
              sources={sources}
              simulationParameters={simulationParameters}
              schedulerParameters={schedulerParameters}
              setStateMethods={setStateMethods}
              setActiveStep={setActiveStep}
            />
          }
        </div>
        <InformationBar/>
      </div>
      <Footer/>
    </div>
  );
}

