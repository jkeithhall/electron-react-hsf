import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FileUploadButton from "./FileUploadButton";
import SaveButton from "./SaveButton";

export default function FileHeader({
  activeStep,
  valid,
  activeStepState,
  setStateMethod,
  handleNextButtonClick,
}) {
  return (
    <Box
      my={1}
      sx={{
        display: "flex",
        alignSelf: "flex-end",
        justifyContent: "space-evenly",
        gap: "15px",
      }}
    >
      <FileUploadButton
        activeStep={activeStep}
        setStateMethod={setStateMethod}
      />
      <SaveButton activeStep={activeStep} activeStepState={activeStepState} />
      <Button
        variant="contained"
        onClick={handleNextButtonClick}
        disabled={!valid}
      >
        Next
      </Button>
    </Box>
  );
}
