import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export default function ConfirmationModal({ onCancel, onConfirm, title, message, submessage, confirmText, cancelText}) {
  return (
    <div className="overlay">
      <Card sx={{ zIndex: 2, padding: '20px', width: '400 px', borderRadius: "5px"}}>
        <Typography variant="h4" my={2}>{title}</Typography>
        <Typography variant="body1" my={1}>{message}</Typography>
        {submessage && <Typography variant="body2">{submessage}</Typography>}
        <div className='confirm-close-icons'>
          <Button variant="contained" onClick={onConfirm} startIcon={<CheckIcon/>}>{confirmText}</Button>
          <Button variant="contained" color="light" onClick={onCancel} startIcon={<CloseIcon/>}>{cancelText}</Button>
        </div>
      </Card>
    </div>
  );
}