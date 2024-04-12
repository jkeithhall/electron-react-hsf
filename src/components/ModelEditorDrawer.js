import { useState } from 'react';
import EditingPalette from './EditingPalette';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

import ConfirmationModal from './ConfirmationModal';

const drawerWidth = 600;
const headerHeight = 100;

export default function ModelEditorDrawer({
  data,
  componentList,
  paletteOpen,
  handlePaletteClose,
  setComponentList,
  setDependencyList,
  setNodes,
  setEdges,
  pythonSrc,
  modelErrors,
  setModelErrors,
 }) {
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleDeleteClick = () => {
    setConfirmationModalOpen(true);
    setDeleteId(data.id);
  }

  const handleDeleteSubComponent = () => {
    setComponentList((prevList) => prevList.filter((component) => component.id !== deleteId));
    setDependencyList((prevList) => prevList.filter((dependency) => dependency.subsystem !== deleteId && dependency.depSubsystem !== deleteId));
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== deleteId));
    setEdges((prevEdges) => prevEdges.filter((edge) => edge.source !== deleteId && edge.target !== deleteId));
    closePaletteAndModal();
  }

  const handleDeleteAsset = () => {
    setComponentList((prevList) => {
      const filteredList = prevList.filter((component) => component.id !== deleteId)
      if (filteredList.length > 0) {
        return filteredList.map((component) => {
          if (component.parent === deleteId) {
            return { ...component, parent: null };
          } else {
            return component;
          }
        });
      } else {
        return [];
      }
    });
    setDependencyList((prevList) => {
      const filteredList = prevList.filter((dependency) => dependency.subsystem !== deleteId && dependency.depSubsystem !== deleteId);
      console.log({filteredList});
      if (filteredList.length > 0) {
        return filteredList.map((dependency) => {
          let newDependency = { ...dependency };
          if (newDependency.asset === deleteId) {
            newDependency.asset = null;
          }
          if (newDependency.depAsset === deleteId) {
            newDependency.depAsset = null;
          }
          return newDependency;
        });
      } else {
        return [];
      }
    });
    setNodes((prevNodes) => {
      const filteredNodes = prevNodes.filter((node) => node.id !== deleteId);
      if (filteredNodes.length > 0) {
        return filteredNodes.map((node) => {
          if (node.parentNode === deleteId) {
            const newNode = { ...node };
            newNode.parentNode = null;
            delete newNode['extent'];
            const newNodeData = { ...newNode.data };
            newNodeData.data.parent = null;
            newNode.data = newNodeData;
            return newNode;
          } else {
            return node;
          }
        });
      } else {
        return [];
      }
    });
    setEdges((prevEdges) => prevEdges.filter((edge) => edge.source !== deleteId && edge.target !== deleteId));
    closePaletteAndModal();
  }

  const closePaletteAndModal = () => {
    handlePaletteClose();
    setConfirmationModalOpen(false);
    setDeleteId(null);
  }

  const handleDeleteCancel = () => {
    setConfirmationModalOpen(false);
    setDeleteId(null);
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
        />
      </div>
      <div className="confirm-close-icons" style={{ marginBottom: 120 }}>
        <Button
          onClick={handleDeleteClick}
          variant="contained"
          color="error"
          size="large"
          startIcon={<DeleteIcon/>}
          >
            Delete Component
        </Button>
      </div>
      {confirmationModalOpen &&
        <ConfirmationModal
          onCancel={handleDeleteCancel}
          onConfirm={data.className === 'asset' ? handleDeleteAsset : handleDeleteSubComponent }
          title={`Delete ${data.name}?`}
          message={`Are you sure you want to delete ${data.name}?`}
          confirmText="Delete"
          cancelText="Cancel"
        />}
    </Drawer>
  );
}
