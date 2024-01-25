import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export default function ConfirmationModal({ onCancel, onConfirm, title, message }) {
  return (
    <div className="overlay">
      <Card sx={{ zIndex: 2, padding: '15px', width: '40ch', borderRadius: "5px"}}>
        <Typography variant="h4" my={2}>{title}</Typography>
        <Typography variant="body1">{message}</Typography>
        <div className='confirm-delete-icons'>
          <CheckIcon onClick={onConfirm} />
          <CloseIcon onClick={onCancel} />
        </div>
      </Card>
    </div>
  );
}