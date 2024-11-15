import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import WarningIcon from "@mui/icons-material/Warning";
import CloseIcon from "@mui/icons-material/Close";

export default function SaveConfirmationModal({
  onSaveConfirm,
  onDontSaveConfirm,
  onClose,
}) {
  return (
    <div className="overlay">
      <Card
        sx={{
          zIndex: 2,
          padding: "20px",
          height: "200px",
          width: "550 px",
          borderRadius: "5px",
        }}
      >
        <Typography variant="h4" my={2}>
          Save your current changes?
        </Typography>
        <Typography variant="body1">
          If you do not save the current changes will be lost.
        </Typography>
        <div className="confirm-close-icons">
          <Button
            variant="contained"
            onClick={onSaveConfirm}
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="light"
            onClick={onDontSaveConfirm}
            startIcon={<WarningIcon />}
          >
            Don't Save
          </Button>
          <Button
            variant="contained"
            color="light"
            onClick={onClose}
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}
