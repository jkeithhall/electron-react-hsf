import { Fragment } from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import RuleIcon from "@mui/icons-material/Rule";
import DeleteParameterButton from "./DeleteButton";
import { convertDisplayName } from "../../utils/displayNames";

export default function VectorState({
  name,
  value,
  errorMessage,
  constraint,
  scrollToConstraint,
  handleChange,
  handleBlur,
  index,
  markedForDeletion,
  hovered,
  setHovered,
  setMarkedForDeletion,
  handleDeleteClicked,
}) {
  const invalidComponents = [];
  if (errorMessage) {
    ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].forEach(
      (component, index) => {
        if (errorMessage.indexOf(component) !== -1) {
          invalidComponents.push(index);
        }
      },
    );
  }

  return (
    <>
      <Typography variant="body2" color="secondary" my={2}>
        {convertDisplayName(name)}
      </Typography>
      {errorMessage && (
        <Typography variant="body2" color="error" sx={{ my: 1 }}>
          {errorMessage}
        </Typography>
      )}
      <Stack direction="row" mt={2}>
        <Grid container spacing={2}>
          {value.map((component, index) => {
            const componentKey = name + "_" + index;
            return (
              <Grid item xs={4} key={componentKey}>
                <TextField
                  id={componentKey}
                  label={`Component ${index}`}
                  variant="outlined"
                  color="primary"
                  name={componentKey}
                  value={component}
                  type="text"
                  fullWidth
                  onChange={handleChange}
                  error={errorMessage && invalidComponents.includes(index)}
                  onBlur={handleBlur}
                />
              </Grid>
            );
          })}
        </Grid>
        {constraint ? (
          <IconButton size="medium" onClick={() => scrollToConstraint(index)}>
            <RuleIcon fontSize="inherit" color="primary" />
          </IconButton>
        ) : (
          <DeleteParameterButton
            index={index}
            markedForDeletion={markedForDeletion}
            hovered={hovered}
            setHovered={setHovered}
            setMarkedForDeletion={setMarkedForDeletion}
            handleDeleteClicked={handleDeleteClicked}
          />
        )}
      </Stack>
    </>
  );
}
