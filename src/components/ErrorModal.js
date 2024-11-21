import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";

export default function ErrorModal({ onConfirm, title, message }) {
  return (
    <div className="overlay">
      <Card
        sx={{
          zIndex: 2,
          padding: "15px",
          width: "40ch",
          border: "2px",
          borderRadius: "5px",
        }}
      >
        <Typography variant="h4" my={2} color="error">
          Error
        </Typography>
        <Typography variant="body1">{message}</Typography>
        <div className="confirm-close-icons">
          <Button variant="contained" color="light" onClick={onConfirm}>
            <CheckIcon />
          </Button>
        </div>
      </Card>
    </div>
  );
}
