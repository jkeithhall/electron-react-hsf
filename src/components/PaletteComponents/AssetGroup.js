import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

export default function AssetGroup({ name }) {

  return (
    <Grid item xs={6}>
      <TextField
        id='parent'
        fullWidth
        label='Asset Group'
        variant="outlined"
        color='primary'
        name='parent'
        value={name}
        align='left'
        disabled
      />
    </Grid>
  )
}