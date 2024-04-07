import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { convertDisplayName } from '../../utils/displayNames';

export default function IntegratorParameters({data, id, setComponentList, stateComponents }) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setComponentList((prevList) => {
      return prevList.map((component) => {
        if (component.id === id) {
          const newIntegratorParameters = component.integratorParameters.map((integratorParameter) => {
            if (integratorParameter.key === name || integratorParameter.key === name.split('_')[0]) {
              switch (integratorParameter.type) {
                case 'double':
                  integratorParameter.value = parseFloat(value);
                  break;
                case 'int':
                  integratorParameter.value = parseInt(value);
                  break;
                default: // vector
                integratorParameter.value = integratorParameter.value.map((component, index) => {
                  const componentName = name.split('_')[1];
                  const i = stateComponents.indexOf(componentName);
                  if (i === index) {
                    return parseFloat(value); // Assumes all vector components are doubles
                  } else {
                    return component;
                  }
                });
              }
            }
            return integratorParameter;
          });
          return { ...component, integratorParameters: newIntegratorParameters };
        } else {
          return component;
        }
      });
    });
  }

  return (
    <>
      {data.length > 0 && <>
        <Typography variant="h6" color="secondary" my={2}>Integrator Parameters</Typography>
        {data.map((integratorParameter, index) => {
          const { key, value, type } = integratorParameter;
          if (type === 'double' || type === 'int') {
            return (
              <Box key={key} my={2}>
                <TextField
                  id={key}
                  key={key}
                  fullWidth
                  label={key}
                  variant="outlined"
                  color='primary'
                  name={key}
                  value={value}
                  type='text'
                  onChange={handleChange}
                  onClick={() => console.log('Clicked on', key)}
                />
              </Box>
            );
          } else {
            return (
              <>
                <Typography variant='body2' color="secondary" my={2}>{convertDisplayName(key)}</Typography>
                <Grid container spacing={2} key={key}>
                  {value.map((component, index) => {
                    const componentKey = key+'_'+ stateComponents[index]
                      return (
                      <Grid item xs={4} key={componentKey}>
                        <TextField
                          id={componentKey}
                          label={stateComponents[index]}
                          variant="outlined"
                          color="primary"
                          name={componentKey}
                          value={component}
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
        })}
      </>}
    </>
  )
}