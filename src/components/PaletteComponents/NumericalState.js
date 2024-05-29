import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import RuleIcon from '@mui/icons-material/Rule';
import DeleteParameterButton from './DeleteButton';
import { convertDisplayName } from '../../utils/displayNames';

export default function NumericalState({
  name,
  value,
  errors,
  constraint,
  scrollToConstraint,
  handleChange,
  handleBlur,
  index,
  markedForDeletion,
  hovered,
  setHovered,
  setMarkedForDeletion,
  handleDeleteClicked
}) {

  return (
    <Stack direction="row" mt={2}>
      <TextField
        id={name}
        fullWidth
        label={convertDisplayName(name)}
        variant="outlined"
        color='primary'
        name={name}
        value={value}
        type='text'
        onChange={handleChange}
        error={errors[name] !== undefined}
        helperText={errors[name]}
        onBlur={handleBlur}
      />
      {constraint ?
        <IconButton
          size="medium"
          onClick={() => scrollToConstraint(index)}
        >
          <RuleIcon fontSize="inherit" color="primary"/>
        </IconButton>
       : <DeleteParameterButton
          index={index}
          markedForDeletion={markedForDeletion}
          hovered={hovered}
          setHovered={setHovered}
          setMarkedForDeletion={setMarkedForDeletion}
          handleDeleteClicked={handleDeleteClicked}
        />
      }
    </Stack>
  )
}