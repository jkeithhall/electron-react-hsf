import { string, number, object } from "yup";
import { noInjection, throwErrorIfMissingFields } from "./validateScenario";
import { dynStateTypeOptions } from "../components/PaletteComponents/DynamicStateType";

// Task schema
const taskSchema = (taskList) =>
  object({
    name: string("Task Name must be a string")
      // Min test should be before required test so that the required test is not triggered if the string is empty
      // (required test will throw import error rather than allowing formErrors to be set)
      .min(1, "Task Name must be at least 1 character")
      .required("Task Name is required")
      .test(
        "no-injection",
        "Task Name contains invalid characters",
        noInjection,
      ),
    type: string("Task Type must be a string")
      .min(1, "Task Type must be at least 1 character")
      .required("Task type is required")
      .oneOf(["COMM", "IMAGING"])
      .test(
        "no-injection",
        "Task Type contains invalid characters",
        noInjection,
      ),
    maxTimes: number("Max Times must be a number")
      .required("Max Times is required")
      .min(0, "Max Times must be greater than or equal to 0")
      .typeError("Max Times must be a number"),
    targetName: string("Target Name must be a string")
      .min(1, "Target Name must be at least 1 character")
      .required("Target Name is required")
      .min(1, "Target Name must be at least 1 character")
      .test(
        "no-injection",
        "Target Name contains invalid characters",
        noInjection,
      )
      .test(
        "unique-parameters",
        "A different target already exists with this name (targets with different parameters must have different names)",
        (value, { parent: currTask }) => {
          return (
            taskList.filter(
              (task) =>
                task.targetName === value &&
                !(
                  task.type === currTask.type &&
                  task.targetType === currTask.targetType &&
                  task.targetValue === currTask.targetValue &&
                  task.latitude === currTask.latitude &&
                  task.longitude === currTask.longitude &&
                  task.altitude === currTask.altitude &&
                  task.dynamicStateType === currTask.dynamicStateType &&
                  task.integratorType === currTask.integratorType &&
                  task.eomsType === currTask.eomsType
                ),
            ).length === 0
          );
        },
      ),
    targetType: string("Target Type must be a string")
      .min(1, "Target Type must be at least 1 character")
      .required("Target Type is required")
      .oneOf(["FacilityTarget", "LocationTarget"])
      .test(
        "no-injection",
        "Target Type contains invalid characters",
        noInjection,
      ),
    targetValue: number("Target Value must be a number")
      .required("Target Value is required")
      .typeError("Target Value must be a number"),
    latitude: number("Latitude must be a number")
      .required("Latitude is required")
      .min(-90, "Latitude must be ≥-90")
      .max(90, "Latitude must be ≤90")
      .typeError("Latitude must be a number"),
    longitude: number("Longitude must be a number")
      .required("Longitude is required")
      .min(-180, "Longitude must be ≥-180")
      .max(180, "Longitude must be ≤180")
      .typeError("Longitude must be a number"),
    altitude: number("Altitude must be a number")
      .required("Altitude is required")
      .min(0, "Altitude must be ≥0")
      .typeError("Altitude must be a number"),
    dynamicStateType: string("Dynamic State Type must be a string")
      .min(1, "Dynamic State Type must be at least 1 character")
      .required("Dynamic State Type is required")
      .oneOf(dynStateTypeOptions)
      .test(
        "no-injection",
        "Dynamic State Type contains invalid characters",
        noInjection,
      ),
    integratorType: string("Integrator Type must be a string")
      .min(1, "Integrator Type must be at least 1 character")
      .required("Integrator Type is required")
      .test(
        "no-injection",
        "Integrator Type contains invalid characters",
        noInjection,
      ),
    eomsType: string("EOMS Type must be a string")
      .min(1, "EOMS Type must be at least 1 character")
      .required("EOMS Type is required")
      .test(
        "no-injection",
        "EOMS Type contains invalid characters",
        noInjection,
      ),
  });

function validateTaskAt(
  task,
  name,
  taskList,
  setFormErrors,
  throwable = false,
) {
  if (name === "id") return; // Skip id
  let importError = null;

  setFormErrors((formErrors) => {
    try {
      const newFormErrors = { ...formErrors };
      const currErrors = newFormErrors[task.id] || {};

      try {
        taskSchema(taskList).validateSyncAt(name, task);
        // Remove error message from the name key of the object
        delete currErrors[name];
      } catch (error) {
        console.log(error);
        const { message } = error;

        // Throw error if the missing fields are required
        if (throwable) throwErrorIfMissingFields(message);
        currErrors[name] = message;
      }

      if (Object.keys(currErrors).length > 0) {
        newFormErrors[task.id] = currErrors;
      } else {
        delete newFormErrors[task.id];
      }
      return newFormErrors;
    } catch (thrownImportError) {
      importError = thrownImportError;
      return formErrors;
    }
  });
  if (importError) throw importError;
}

function validateTask(task, taskList, setFormErrors, throwable = false) {
  let importError = null;

  setFormErrors((formErrors) => {
    try {
      const newFormErrors = { ...formErrors };
      const currErrors = newFormErrors[task.id] || {};

      Object.entries(task).forEach(([name, value]) => {
        if (name === "id") return; // Skip id

        try {
          taskSchema(taskList).validateSyncAt(name, task);
          // Remove error message from the name key of the object
          delete currErrors[name];
        } catch (error) {
          console.log(error);
          const { message } = error;

          // Throw error if the missing fields are required
          if (throwable) throwErrorIfMissingFields(message);
          currErrors[name] = message;
        }
      });

      if (Object.keys(currErrors).length > 0) {
        newFormErrors[task.id] = currErrors;
      } else {
        delete newFormErrors[task.id];
      }
      return newFormErrors;
    } catch (thrownImportError) {
      importError = thrownImportError;
      return formErrors;
    }
  });
  if (importError) throw importError;
}

// Validate each task and update formErrors if there are errors or throw an error if a required field is missing
function validateAllTasks(tasks, setFormErrors, throwable = false) {
  let importError = null;

  setFormErrors((formErrors) => {
    try {
      const newFormErrors = { ...formErrors };
      tasks.forEach((task) => {
        const currErrors = newFormErrors[task.id] || {};

        Object.entries(task).forEach(([name, value]) => {
          if (name === "id") return; // Skip id

          try {
            taskSchema(tasks).validateSyncAt(name, task);
            // Remove error message from the name key of the object
            delete currErrors[name];
          } catch (error) {
            console.log(error);
            const { message } = error;

            // Throw error if the missing fields are required
            if (throwable) throwErrorIfMissingFields(message);
            currErrors[name] = message;
          }
        });

        if (Object.keys(currErrors).length > 0) {
          newFormErrors[task.id] = currErrors;
        } else {
          delete newFormErrors[task.id];
        }
      });

      return newFormErrors;
    } catch (thrownImportError) {
      importError = thrownImportError;
      return formErrors;
    }
  });

  if (importError) throw importError;
}

export { validateTaskAt, validateTask, validateAllTasks };
