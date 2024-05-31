import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

export default function ParentSelector({ id, parent, componentList, setComponentList, errors, handleBlur, disabled }) {
  const options = componentList.filter((component) => component.className === 'asset').map((component) => component.name);
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
        placeholder='Select Asset Group'
        value={name || options[0]}
        align='left'
        select={!disabled}
        disabled={disabled}
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