import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import HSFNav from './components/HSFNav';
import parseJSONFile from './utils/parseJSONFile';

test('renders App component', () => {
  render(<App />);
  // Check if header is rendered
  const header = screen.getByText(/HSF Builder/i);
  expect(header).toBeInTheDocument();

  // Check if FileSelector is rendered
  const fileSelector = screen.getByText(/Choose File/i);
  expect(fileSelector).toBeInTheDocument();

  // Check if HSFNav is rendered
  const hsfNav = screen.getByText(/Scenario/i);
  expect(hsfNav).toBeInTheDocument();

  // Check if ScenarioCards is rendered
  const scenarioCards = screen.getByText(/Sources/i);
  expect(scenarioCards).toBeInTheDocument();

  // Check if InformationBar is rendered
  const informationBar = screen.getByText(/Information/i);
  expect(informationBar).toBeInTheDocument();

  // Check if Footer is rendered
  const footer = screen.getByText(/Copyright/i);
  expect(footer).toBeInTheDocument();
});

test('clicking on HSFNav changes activeStep', () => {
  const activeStep = 'Scenario';
  const setActiveStep = jest.fn(); // Mock the setActiveStep function

  render(<HSFNav activeStep={activeStep} setActiveStep={setActiveStep} />);

  // Check if the component is rendered
  const navElement = screen.getByRole('navigation');
  expect(navElement).toBeInTheDocument();

  // Check if the active step is highlighted
  const activeButton = screen.getByText(activeStep);
  expect(activeButton).toHaveClass('MuiButton-contained'); // Assuming you are using Material-UI

  // Click on a different category
  const newCategory = 'Tasks';
  fireEvent.click(screen.getByText(newCategory));

  // Check if setActiveStep is called with the correct argument
  expect(setActiveStep).toHaveBeenCalledWith(newCategory);
});

test('parseJSONFile parses a JSON file', () => {
  const setStateMethods = {
    setSourceName: jest.fn(),
    setBaseSource: jest.fn(),
    setModelSource: jest.fn(),
    setTargetSource: jest.fn(),
    setPythonSource: jest.fn(),
    setOutputPath: jest.fn(),
    setVersion: jest.fn(),
    setStartJD: jest.fn(),
    setStartSeconds: jest.fn(),
    setEndSeconds: jest.fn(),
    setPrimaryStepSeconds: jest.fn(),
    setMaxSchedules: jest.fn(),
    setCropRatio: jest.fn()
  };

  const fileContents = `{
    "Sources":{
      "Name": "Aeolus",
      "Base Source": "./samples/aeolus/",
      "Model Source": "DSAC_Static_Mod_Scripted.xml",
      "Target Source": "v2.2-300targets.xml",
      "Python Source": "pythonScripts/",
      "Output Path": "none",
      "Version": 2.0
    },
    "Simulation Parameters": {
        "Start JD": 2454685.0,
        "Start Seconds": 3.0,
        "End Seconds" : 63.0,
        "Primary Step Seconds": 15
      },
    "Scheduler Parameters": {
      "Max Schedules": 12,
      "Crop Ratio": 9
    }
  }`;

  const expectedStateArguments = {
    setSourceName: 'Aeolus',
    setBaseSource: './samples/aeolus/',
    setModelSource: 'DSAC_Static_Mod_Scripted.xml',
    setTargetSource: 'v2.2-300targets.xml',
    setPythonSource: 'pythonScripts/',
    setOutputPath: 'none',
    setVersion: 2.0,
    setStartJD: 2454685.0,
    setStartSeconds: 3.0,
    setEndSeconds: 63.0,
    setPrimaryStepSeconds: 15,
    setMaxSchedules: 12,
    setCropRatio: 9
  };

  parseJSONFile(fileContents, setStateMethods);

  // Check if setStateMethods is called with the correct arguments
  for (const method in setStateMethods) {
    expect(setStateMethods[method]).toHaveBeenCalledWith(expectedStateArguments[method]);
  }
});