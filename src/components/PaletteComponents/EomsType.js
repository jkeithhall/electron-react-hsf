import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

export default function EomsType({ value, setComponentList, id, errors, handleBlur }) {
  const eomsOptions = ['orbitalEOMS', 'EarthPerts', 'scriptedEOMS'];
  const handleChange = (e) => {
    let { name, value } = e.target;

    setComponentList((prevList) => {
      return prevList.map((component) => {
        if (component.id === id) {
          return { ...component, [name]: value };
        } else {
          return component;
        }
      });
    });
  }

  return (
    <Grid item xs={6}>
      <TextField
        id='eomsType'
        fullWidth
        label='EOMs Type'
        variant="outlined"
        color='primary'
        name='eomsType'
        value={value}
        select
        align='left'
        onChange={handleChange}
        error={errors.eomsType !== undefined}
        helperText={errors.eomsType}
        onBlur={handleBlur}
      >
        {eomsOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
      </TextField>
    </Grid>
  )
}