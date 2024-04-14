import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

function titleCase(str) {
  if (str === 'adcs' || str === 'ssdr') return str.toUpperCase();
  if (str === 'eosensor') return 'EOSensor';
  return str.toLowerCase().split(' ').map(function(word) {
    return word.replace(word[0], word[0].toUpperCase());
  }).join(' ');
}

export default function ClassName({ className, id, setComponentList, errors, handleBlur }) {
  const classNames = className === 'asset' ? ['asset'] : ['adcs', 'power', 'comm', 'eosensor', 'ssdr'];

  const handleChange = (e) => {
    let { name, value } = e.target;

    setComponentList((prevList) => {
      return prevList.map((component) => {
        if (component.id === id) {
          return { ...component, [name]: value.toLowerCase() };
        } else {
          return component;
        }
      });
    });
  }

  return (
    <Grid item xs={6}>
      <TextField
        id='className'
        fullWidth
        label='Class'
        variant="outlined"
        color='primary'
        name='className'
        value={className}
        select
        align='left'
        onChange={handleChange}
        error={errors.className !== undefined}
        helperText={errors.className}
        onBlur={handleBlur}
      >
        {classNames.map((option) => <MenuItem key={option} value={option}>{titleCase(option)}</MenuItem>)}
      </TextField>
    </Grid>
  )
}