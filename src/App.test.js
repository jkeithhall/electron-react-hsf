import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

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
  render(<App />);
  const scenarioNav = screen.getByText(/Scenario/i);
  fireEvent.click(scenarioNav);
  const scenarioCards = screen.getByText(/Sources/i);
  expect(scenarioCards).toBeInTheDocument();

  const tasksNav = screen.getByText(/Tasks/i);
  fireEvent.click(tasksNav);
  const tasksCards = screen.getByText(/Tasks/i);
  expect(tasksCards).toBeInTheDocument();
});
