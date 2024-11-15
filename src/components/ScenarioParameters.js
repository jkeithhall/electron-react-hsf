import { useEffect } from "react";
import ParameterGroup from "./ParameterGroup";
import { Evaluator } from "./Evaluator";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { validateScenario } from "../utils/validateScenario";

export default function ScenarioParameters({
  activeStep,
  setActiveStep,
  simulationInput,
  setSimulationInput,
  componentList,
  evaluator,
  setEvaluator,
  formErrors,
  setFormErrors,
}) {
  const {
    name,
    version,
    dependencies,
    simulationParameters,
    schedulerParameters,
  } = simulationInput;
  const { pythonSrc, outputPath, ...otherDependencies } = dependencies;
  const sources = { name, version, pythonSrc, outputPath };

  const pythonSourceFiles = componentList
    .filter(
      (component) =>
        component.parent && component.type.toLowerCase() === "scripted",
    )
    .map((component) => component.src);

  const setSources = (newSources) => {
    const { name, version, pythonSrc, outputPath } = newSources;
    setSimulationInput({
      name,
      version,
      dependencies: { pythonSrc, outputPath, ...otherDependencies },
      simulationParameters,
      schedulerParameters,
    });
  };
  const setSimulationParameters = (newParameters) => {
    setSimulationInput({
      name,
      version,
      dependencies,
      simulationParameters: newParameters,
      schedulerParameters,
    });
  };
  const setSchedulerParameters = (newParameters) => {
    setSimulationInput({
      name,
      version,
      dependencies,
      simulationParameters,
      schedulerParameters: newParameters,
    });
  };

  useEffect(() => {
    const flattenedParameters = {
      ...sources,
      ...simulationParameters,
      ...schedulerParameters,
    };
    validateScenario(flattenedParameters, setFormErrors, pythonSourceFiles);
  }, []); // Only run on initial render; subsequent verification is handled by handleBlur and handleFileClick

  return (
    <div className="scenario-parameters-container">
      <div className="sources">
        <Paper
          elevation={3}
          sx={{ backgroundColor: "#282D3D", padding: "10px" }}
        >
          <Typography variant="h5" color="light.main" mt={1} mb={1.5}>
            Sources
          </Typography>
          <ParameterGroup
            parameters={sources}
            setParameters={setSources}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            pythonSourceFiles={pythonSourceFiles}
          />
        </Paper>
      </div>
      <div className="evaluator-parameters">
        <Paper
          elevation={3}
          sx={{ backgroundColor: "#282D3D", padding: "10px" }}
        >
          <Typography variant="h5" color="light.main" mt={1} mb={1.5}>
            Evaluator
          </Typography>
          <Evaluator
            evaluator={evaluator}
            setEvaluator={setEvaluator}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            componentList={componentList}
            pythonDirectorySrc={pythonSrc}
          />
        </Paper>
      </div>
      <div className="simulation-parameters">
        <Paper
          elevation={3}
          sx={{ backgroundColor: "#282D3D", padding: "10px" }}
        >
          <Typography variant="h5" color="light.main" mt={1} mb={1.5}>
            Simulation Parameters
          </Typography>
          <ParameterGroup
            parameters={simulationParameters}
            setParameters={setSimulationParameters}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
          />
        </Paper>
      </div>
      <div className="scheduler-parameters">
        <Paper
          elevation={3}
          sx={{ backgroundColor: "#282D3D", padding: "10px" }}
        >
          <Typography variant="h5" color="light.main" mt={1} mb={1.5}>
            Scheduler Parameters
          </Typography>
          <ParameterGroup
            parameters={schedulerParameters}
            setParameters={setSchedulerParameters}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            p
          />
        </Paper>
      </div>
    </div>
  );
}
