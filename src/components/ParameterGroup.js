import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import EventIcon from "@mui/icons-material/Event";
import FolderIcon from "@mui/icons-material/Folder";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import { shortenPath } from "../utils/shortenPath.js";
import { findInvalidPythonFiles } from "../utils/validatePythonFiles";
import { convertDisplayName } from "../utils/displayNames";
import { validateScenario } from "../utils/validateScenario";
import { julianToDate, dateToJulian } from "../utils/julianConversion.js";

const parametersWithSeconds = ["startSeconds", "endSeconds", "stepSeconds"];
const numericalParameters = parametersWithSeconds.concat([
  "version",
  "maxSchedules",
  "cropTo",
]);
const fileParameters = ["pythonSrc", "outputPath"];

export default function ParameterGroup({
  parameters,
  setParameters,
  formErrors,
  setFormErrors,
  pythonSourceFiles,
}) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateCalendarValue, setDateCalendarValue] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParameters({ ...parameters, [name]: value });
  };

  const handleBlur = (e) => {
    validateScenario(parameters, setFormErrors, pythonSourceFiles);
  };

  const handleFileClick = (key) => async (e) => {
    if (window.electronApi) {
      window.electronApi.onDirectorySelect(async (absolutePath) => {
        // Update the state with the new path
        setParameters({ ...parameters, [key]: absolutePath });
        // If the key is pythonSrc, check that all files are present in the directory
        if (key === "pythonSrc") {
          const invalidSources = findInvalidPythonFiles(
            absolutePath,
            pythonSourceFiles,
          );
          if (invalidSources.length > 0) {
            setFormErrors({
              ...formErrors,
              [key]:
                "Python source files for one or more system components not found in the selected directory.",
            });
          } else {
            // Remove error message from the pythonSrc key of the object
            setFormErrors((formErrors) => {
              const newFormErrors = { ...formErrors };
              delete newFormErrors[key];
              return newFormErrors;
            });
          }
        }
        // If the key is outputPath and the path is empty, set an error message
        if (key === "outputPath") {
          if (absolutePath === "") {
            setFormErrors({ ...formErrors, [key]: "Output Path is required" });
          } else {
            setFormErrors((formErrors) => {
              const newFormErrors = { ...formErrors };
              delete newFormErrors[key];
              return newFormErrors;
            });
          }
        }
      });
    } else {
      try {
        const directoryHandle = await window.showDirectoryPicker();
        setParameters({ ...parameters, [key]: directoryHandle.name });
      } catch (error) {
        console.error("Error selecting directory:", error);
      }
    }
  };

  const toggleCalendar = (e) => {
    setShowCalendar(!showCalendar);
  };

  // Takes a dateJS object and updates the startJD parameter in the state
  const handleDateChange = async (date) => {
    setDateCalendarValue(date);
    const newJD = await dateToJulian(date);
    setParameters({ ...parameters, startJD: newJD });
  };

  // Sets the startJD parameter to the current date
  const setCurrentDate = async () => {
    const currentDate = dayjs(new Date());
    const newJD = await dateToJulian(currentDate);
    setParameters({ ...parameters, startJD: newJD });
  };

  useEffect(() => {
    (async () => {
      if (parameters.startJD) {
        const date = await julianToDate(parameters.startJD);
        setDateCalendarValue(date);
      }
    })();
  }, [parameters.startJD]);

  return (
    <Box
      sx={{ padding: "5px", backgroundColor: "#eeeeee", borderRadius: "5px" }}
    >
      {Object.entries(parameters).map(([key, value]) => {
        const displayName = convertDisplayName(key);

        const valid = !formErrors[key];
        const errorMessage = valid ? "" : formErrors[key];

        const type = numericalParameters.includes(key) ? "number" : "text";
        const isFile = fileParameters.includes(key);

        const startAdornment =
          key === "startJD" ? (
            <InputAdornment position="start">
              <EventIcon onClick={toggleCalendar} />
            </InputAdornment>
          ) : null;

        let endAdornment = null;
        if (parametersWithSeconds.includes(key)) {
          endAdornment = <InputAdornment position="end">s</InputAdornment>;
        } else if (key === "startJD") {
          endAdornment = <InputAdornment position="end">JD</InputAdornment>;
        } else if (isFile) {
          endAdornment = (
            <InputAdornment position="end">
              <FolderIcon />
            </InputAdornment>
          );
        }

        return (
          <Box key={key} my={1}>
            <TextField
              id={key}
              fullWidth
              label={displayName}
              variant="outlined"
              color="primary"
              name={key}
              value={isFile ? shortenPath(value, 50) : value}
              type={type}
              onChange={isFile ? undefined : handleChange}
              onClick={isFile ? handleFileClick(key) : undefined}
              onBlur={handleBlur}
              error={!valid}
              helperText={errorMessage}
              InputProps={{ startAdornment, endAdornment }}
            />
            {showCalendar && key === "startJD" && (
              <div className="calendar-stacking-context">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar
                    value={dateCalendarValue}
                    onChange={handleDateChange}
                  />
                </LocalizationProvider>
                <div
                  style={{
                    display: "flex",
                    alignSelf: "flex-end",
                    gap: "10px",
                    marginRight: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <Button
                    onClick={setCurrentDate}
                    color="light"
                    size="small"
                    variant="contained"
                  >
                    Today
                  </Button>
                  <Button
                    onClick={toggleCalendar}
                    color="primary"
                    size="small"
                    variant="contained"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
