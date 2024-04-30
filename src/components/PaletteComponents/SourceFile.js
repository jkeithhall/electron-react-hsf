import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { shortenPath } from '../../utils/shortenPath';

export default function SourceFile({ src, setComponentList, id, pythonSrc, errors, handleBlur }) {
  const handleFileSelected = (filePath) => {
    setComponentList((prevList) => {
      return prevList.map((component) => {
        if (component.id === id) {
          return { ...component, src: filePath };
        } else {
          return component;
        }
      });
    });
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
          error={errors.src !== undefined}
          helperText={errors.src}
          onBlur={handleBlur}
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
          value={shortenPath(src, 45)}
          placeholder="Select File"
          onClick={handleClick}
          readOnly
          error={errors.src !== undefined}
          helperText={errors.src}
          InputProps={{ endAdornment: <InputAdornment position="end"><InsertDriveFileIcon /></InputAdornment> }}
          onBlur={handleBlur}
        />
      </>
    )
  }
}