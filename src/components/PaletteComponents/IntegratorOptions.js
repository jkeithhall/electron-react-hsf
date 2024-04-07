import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

export default function IntegratorOptions({ data, setComponentList, id }) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setComponentList((prevList) => {
      return prevList.map((component) => {
        if (component.id === id) {
          const newIntegratorOptions = { ...component.integratorOptions };
          newIntegratorOptions[name] = parseFloat(value); // Assumes all integrator options are doubles
          return { ...component, integratorOptions: newIntegratorOptions };
        } else {
          return component;
        }
      });
    });
  }

  return (
    <>
      {Object.keys(data).length > 0 && <>
        <Typography variant="h6" color="secondary" my={2}>Integrator Options</Typography>
        <Grid container spacing={2}>
          {Object.entries(data).map(([key, value]) => (
            <Grid item xs={6} key={key}>
              <TextField
                id={key}
                label={key}
                key={key}
                variant="outlined"
                color="primary"
                name={key}
                value={value}
                type='text'
                fullWidth
                onChange={handleChange}
              />
            </Grid>
          ))}
        </Grid>
      </>}
    </>
  )
}