import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltop from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import RuleIcon from '@mui/icons-material/Rule';
import DeleteParameterButton from './DeleteButton';
import { convertDisplayName } from '../../utils/displayNames';

export default function NumericalState({
  name,
  value,
  error,
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
        error={error !== undefined}
        helperText={error}
        onBlur={handleBlur}
      />
      {constraint ?
        <Tooltop title="Scroll to constraint">
          <IconButton
            size="medium"
            onClick={() => scrollToConstraint(name)}
          >
            <RuleIcon fontSize="inherit" color="primary"/>
          </IconButton>
        </Tooltop>
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