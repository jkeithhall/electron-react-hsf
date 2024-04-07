import EditingPalette from './EditingPalette';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

const drawerWidth = 600;
const headerHeight = 100;

export default function ModelEditorDrawer({
  data,
  componentList,
  paletteOpen,
  handlePaletteClose,
  setComponentList,
  setDependencyList,
  pythonSrc,
  modelErrors,
  setModelErrors,
  componentIds
 }) {
  const handleDelete = () => {
    // setComponentList((prevList) => {
    //   return prevList.filter((component) => component.id !== data.id);
    // });
    // setDependencyList((prevList) => {
    //   return prevList.filter((dependency) => dependency.source !== data.id && dependency.target !== data.id);
    // });
    // handlePaletteClose();
  }

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
        },
      }}
      PaperProps={{
        sx: {
          align: 'right',
          top: headerHeight,
          bottom: headerHeight,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
      variant="persistent"
      anchor="right"
      open={paletteOpen}
    >
      <IconButton
        color="primary"
        size="large"
        m={4}
        sx={{
          minHeight: 58,
          alignSelf: 'flex-start',
          marginRight: 2,
          justifyContent: 'flex-start',
        }}
        onClick={handlePaletteClose}
      >
        <CloseIcon/>
      </IconButton>
      <div className="editing-palette-content">
        <EditingPalette
          data={data}
          componentList={componentList}
          setComponentList={setComponentList}
          setDependencyList={setDependencyList}
          pythonSrc={pythonSrc}
          modelErrors={modelErrors}
          setModelErrors={setModelErrors}
          componentIds={componentIds}
        />
      </div>
      <div className="confirm-close-icons" style={{ marginBottom: 120 }}>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            size="large"
            startIcon={<DeleteIcon/>}
            >
              Delete Component
          </Button>
        </div>
    </Drawer>
  );
}
