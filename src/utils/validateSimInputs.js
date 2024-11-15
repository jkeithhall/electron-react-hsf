import { validateScenario } from "./validateScenario";
import { validateAllTasks } from "./validateTasks";
import { validateAllComponents } from "./validateComponents";
import { validateAllDependencies } from "./validateDependencies";
import { validateAllConstraints } from "./validateConstraints";
import { validateEvaluator } from "./validateEvaluator";

export default function ValidateSimInputs(
  appState,
  setValidationErrors,
  throwable = false,
) {
  const {
    simulationInput,
    taskList,
    componentList,
    dependencyList,
    evaluator,
    constraints,
  } = appState;
  const {
    setScenarioErrors,
    setTaskErrors,
    setModelErrors,
    setDependencyErrors,
    setConstraintErrors,
  } = setValidationErrors;
  console.log("Validating all simulation inputs");
  const {
    name,
    version,
    dependencies,
    simulationParameters,
    schedulerParameters,
  } = simulationInput;
  const { pythonSrc, outputPath } = dependencies;
  const scenario = {
    name,
    version,
    pythonSrc,
    outputPath,
    ...simulationParameters,
    ...schedulerParameters,
  };
  const pythonSourceFiles = componentList
    .filter(
      (component) =>
        component.parent && component.type.toLowerCase() === "scripted",
    )
    .map((component) => component.src);

  validateScenario(scenario, setScenarioErrors, pythonSourceFiles);
  validateAllTasks(taskList, setTaskErrors);
  validateAllComponents(componentList, setModelErrors, pythonSrc);
  validateAllConstraints(constraints, setConstraintErrors, componentList);
  validateAllDependencies(dependencyList, setDependencyErrors, componentList);
  validateEvaluator(evaluator, setScenarioErrors, componentList, pythonSrc);
}
