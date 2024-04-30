import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

export default function SubsystemType({ type, setComponentList, id, errors, handleBlur }) {
  const typeOptions = ['scripted', 'unscripted']

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
        id='type'
        key='type'
        fullWidth
        label='Type'
        variant="outlined"
        color='primary'
        value={type}
        name='type'
        select
        align='left'
        onChange={handleChange}
        error={errors.type !== undefined}
        helperText={errors.type}
        onBlur={handleBlur}
      >
        {typeOptions.map((option) => <MenuItem key={option} value={option}>{option.toUpperCase()}</MenuItem>)}
      </TextField>
    </Grid>
  )
}