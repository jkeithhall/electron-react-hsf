import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export default function ConfirmationModal({ onCancel, onConfirm, title, message }) {
  return (
    <div className="overlay">
      <Card sx={{ zIndex: 2, padding: '20px', width: '400 px', borderRadius: "5px"}}>
        <Typography variant="h4" my={2}>{title}</Typography>
        <Typography variant="body1">{message}</Typography>
        <div className='confirm-close-icons'>
          <Button variant="contained" color="info" onClick={onConfirm} startIcon={<CheckIcon/>}>Confirm</Button>
          <Button variant="contained" color="primary" onClick={onCancel} startIcon={<CloseIcon/>}>Cancel</Button>
        </div>
      </Card>
    </div>
  );
}