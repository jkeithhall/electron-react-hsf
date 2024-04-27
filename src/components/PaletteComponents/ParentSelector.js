import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

export default function ParentSelector({ id, parent, componentList, setComponentList, errors, handleBlur }) {
  const options = componentList.filter((component) => component.className === 'asset').map((component) => component.name).concat('None');
  const name = componentList.find((component) => component.id === parent)?.name;

  const handleChange = (e) => {
    const { value } = e.target;
    const newParent = componentList.find((component) => component.name === value)?.id;

    setComponentList((prevList) => {
      return prevList.map((component) => {
        if (component.id === id) {
          return { ...component, parent: newParent };
        } else {
          return component;
        }
      });
    });
  }

  return (
    <Grid item xs={6}>
      <TextField
        id='parent'
        fullWidth
        label='Asset Group'
        variant="outlined"
        color='primary'
        name='parent'
        placeholder='None'
        value={name ? name : 'None'}
        align='left'
        select
        onChange={handleChange}
        error={errors.parent !== undefined}
        helperText={errors.parent}
        onBlur={handleBlur}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
    </Grid>
  )
}