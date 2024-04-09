import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

export default function StateData({ data, setComponentList, id, stateComponents }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setComponentList((prevList) => {
      return prevList.map((component) => {
        if (component.id === id) {
          const newStateData = component.stateData;
          const index = stateComponents.indexOf(name);
          newStateData[index] = parseFloat(value); // Assumes all state data components are doubles
          return { ...component, stateData: newStateData };
        } else {
          return component;
        }
      });
    });
  }

  return (
    <>
      <Typography variant="h6" color="secondary" my={2}>State Data</Typography>
      <Grid container spacing={2}>
        {data.map((value, index) => {
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
              />
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}