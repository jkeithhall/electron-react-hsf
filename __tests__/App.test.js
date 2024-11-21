import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./src/components/App";
import NavDrawer from "./src/components/NavDrawer";

test("renders App component", () => {
  render(<App />);
  // Check if header is rendered
  const header = screen.getByText(/HSF Builder/i);
  expect(header).toBeInTheDocument();

  // Check if NavDrawer is rendered
  const hsfNav = screen.getByText(/Scenario/i);
  expect(hsfNav).toBeInTheDocument();

  // Check if ScenaroioParameters is rendered
  const scenarioCards = screen.getByText(/Sources/i);
  expect(scenarioCards).toBeInTheDocument();

  // Check if Footer is rendered
  const footer = screen.getByText(/Copyright/i);
  expect(footer).toBeInTheDocument();
});

test("clicking on NavDrawer buttons changes activeStep", () => {
  const activeStep = "Scenario";
  const setActiveStep = jest.fn(); // Mock the setActiveStep function

  render(<NavDrawer activeStep={activeStep} setActiveStep={setActiveStep} />);

  // Click on the 'Tasks' button
  fireEvent.click(screen.getByText("Tasks"));
  expect(setActiveStep).toHaveBeenCalledWith("Tasks");
});
