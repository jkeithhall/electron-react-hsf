import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

export default function NameField({ name, setComponentList, id, errors, handleBlur }) {
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
        id='name'
        key='name'
        fullWidth
        label='Name'
        variant="outlined"
        color='primary'
        value={name}
        name='name'
        type='text'
        onChange={handleChange}
        error={errors.name !== undefined}
        helperText={errors.name}
        onBlur={handleBlur}
      />
    </Grid>
  )
}