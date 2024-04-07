import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

export default function DeleteParameterButton({index, buttonRef, markedForDeletion, hovered, setHovered, handleDeleteClicked}) {
  if (markedForDeletion !== index) {
    return (
      <IconButton
        size="medium"
        color={markedForDeletion === index || hovered === index ? 'error' : 'light.text'}
        onClick={(e) => handleDeleteClicked(e, index)}
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(-1)}
      >
        <RemoveCircleIcon fontSize="inherit"/>
      </IconButton>
    );
  } else {
    return (
      <Button
        ref={buttonRef}
        size="medium"
        color="error"
        sx={{ paddingTop: 0 }}
        onClick={(e) => handleDeleteClicked(e, index)}
        startIcon={<RemoveCircleIcon sx={{ '&.MuiSvgIcon-root': { fontSize: 52 }}}/>}
        fontSize="large"
      >
        Confirm
      </Button>
    );
  }
}