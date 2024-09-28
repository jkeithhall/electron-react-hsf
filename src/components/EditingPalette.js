import ComponentEditor from './ComponentEditor';
import NewAssetEditor from './NewAssetEditor';
import NewSubComponentEditor from './NewSubComponentEditor';
import DependencyEditor from './DependencyEditor';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const drawerWidth = 500;
const headerHeight = 100;

export default function EditingPalette({
  data,
  componentA,
  componentB,
  editingMode,
  clipboardData,
  componentList,
  paletteOpen,
  handlePaletteClose,
  setComponentList,
  nodes,
  setEdges,
  dependencyList,
  setDependencyList,
  constraints,
  setConstraints,
  setEvaluator,
  setNodes,
  pythonSrc,
  modelErrors,
  setModelErrors,
  dependencyErrors,
  setDependencyErrors,
  constraintErrors,
  setConstraintErrors,
 }) {

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
      {editingMode === 'componentEditor' && <ComponentEditor
        handlePaletteClose={handlePaletteClose}
        data={data}
        componentList={componentList}
        setComponentList={setComponentList}
        setDependencyList={setDependencyList}
        constraints={constraints}
        setConstraints={setConstraints}
        pythonSrc={pythonSrc}
        modelErrors={modelErrors}
        setModelErrors={setModelErrors}
        constraintErrors={constraintErrors}
        setConstraintErrors={setConstraintErrors}
        setEvaluator={setEvaluator}
        setNodes={setNodes}
        setEdges={setEdges}
      />}
      {editingMode === 'newAssetEditor' && <NewAssetEditor
        componentList={componentList}
        setComponentList={setComponentList}
        clipboardData={clipboardData}
      />}
      {editingMode === 'newComponentEditor' && <NewSubComponentEditor
        componentList={componentList}
        setComponentList={setComponentList}
        constraints={constraints}
        setConstraints={setConstraints}
        pythonSrc={pythonSrc}
        clipboardData={clipboardData}
      />}
      {editingMode === 'dependencyEditor' && <DependencyEditor
        componentA={componentA}
        componentB={componentB}
        componentList={componentList}
        setEdges={setEdges}
        dependencyList={dependencyList}
        setDependencyList={setDependencyList}
        dependencyErrors={dependencyErrors}
        setDependencyErrors={setDependencyErrors}
      />}
    </Drawer>
  );
}
