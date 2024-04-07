import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { shortenPath } from '../../utils/shortenPath';

export default function SourceFile({ src, errorMessage, setComponentList, id, pythonSrc, validateSrc }) {
  const handleFileSelected = (filePath) => {
    console.log('handleFileSelected:', filePath);
    setComponentList((prevList) => {
      return prevList.map((component) => {
        if (component.id === id) {
          return { ...component, src: filePath };
        } else {
          return component;
        }
      });
    });
    validateSrc(filePath);
  }

  const handleClick = () => {
    if (window.electronApi) {
      window.electronApi.selectFile(pythonSrc, 'Python', handleFileSelected);
    }
  }

  if (!src) {
    return (
      <>
        <Typography variant="h6" color="secondary" my={2}>Source File</Typography>
        <TextField
          id="src"
          fullWidth
          value=""
          placeholder="Select File"
          onClick={handleClick}
          readOnly
          error={errorMessage ? true : false}
          helperText={errorMessage ? errorMessage : ''}
          InputProps={{ endAdornment: <InputAdornment position="end"><InsertDriveFileIcon /></InputAdornment> }}
        />
      </>
    )
  } else {
    return (
      <>
        <Typography variant="h6" color="secondary" my={2}>Source File</Typography>
        <TextField
          id="src"
          fullWidth
          value={shortenPath(src, 55)}
          placeholder="Select File"
          onClick={handleClick}
          readOnly
          error={errorMessage ? true : false}
          helperText={errorMessage ? errorMessage : ''}
          InputProps={{ endAdornment: <InputAdornment position="end"><InsertDriveFileIcon /></InputAdornment> }}
        />
      </>
    )
  }
}