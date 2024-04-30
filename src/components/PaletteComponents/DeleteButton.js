import { useEffect, useRef } from 'react';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

export default function DeleteParameterButton({index, markedForDeletion, hovered, setHovered, setMarkedForDeletion, handleDeleteClicked}) {
  const buttonRef = useRef(null);

  const handleClickOutside = (e) => {
    if (buttonRef.current && !buttonRef.current.contains(e.target)) {
      setHovered(-1);
      setMarkedForDeletion(-1);
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    }
  }, []);


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