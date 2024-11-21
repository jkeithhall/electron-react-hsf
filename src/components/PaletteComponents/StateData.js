import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

const stateComponents = ["x", "y", "z", "v_x", "v_y", "v_z"];

export default function StateData({
  stateData,
  setComponentList,
  id,
  errors,
  handleBlur,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setComponentList((prevList) => {
      return prevList.map((component) => {
        if (component.id === id) {
          const newStateData = component.stateData;
          const index = stateComponents.indexOf(name);
          newStateData[index] = value;
          return { ...component, stateData: newStateData };
        } else {
          return component;
        }
      });
    });
  };

  let stateDataError = errors.stateData;
  const stateDataErrorIndices = [];
  if (stateDataError) {
    stateComponents.forEach((component, index) => {
      if (stateDataError.includes(index)) {
        stateDataErrorIndices.push(index);
      }
      stateDataError = stateDataError.replace(
        new RegExp(`\\b${index}\\b`, "g"),
        component,
      );
    });
  }

  const componentError = (index) => {
    return stateDataError && stateDataErrorIndices.includes(index);
  };
  const uniquenessError = (index) => {
    return index < 3 ? stateDataError.includes("unique") : false;
  };

  return (
    <>
      <Typography variant="h6" color="secondary" my={2}>
        State Data
      </Typography>
      {stateDataError && (
        <Typography variant="body2" color="error" sx={{ my: 1 }}>
          {stateDataError}
        </Typography>
      )}
      <Grid container spacing={2}>
        {stateData.map((value, index) => {
          const key = stateComponents[index];

          return (
            <Grid item xs={4} key={key}>
              <TextField
                id={key}
                key={key}
                label={key}
                variant="outlined"
                color="primary"
                name={key}
                value={value}
                type="text"
                fullWidth
                onChange={handleChange}
                error={
                  stateDataError &&
                  (componentError(index) || uniquenessError(index))
                }
                onBlur={handleBlur}
                // Units are km
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {index < 3 ? "km" : "km/s"}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}
