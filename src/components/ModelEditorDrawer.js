import { useState, useCallback } from 'react';

import EditingPalette from './EditingPalette';
import NewAssetPalette from './NewAssetPalette';
import NewSubComponentPalette from './NewSubComponentPalette';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import ConfirmationModal from './ConfirmationModal';

const drawerWidth = 500;
const headerHeight = 100;

export default function ModelEditorDrawer({
  data,
  newNodeType,
  componentList,
  paletteOpen,
  handlePaletteClose,
  setComponentList,
  setDependencyList,
  constraints,
  setConstraints,
  evaluator,
  setEvaluator,
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

  const handleDeleteSubComponent = useCallback(() => {
    setComponentList((prevList) => prevList.filter((component) => component.id !== deleteId));
    setDependencyList((prevList) => prevList.filter((dependency) => dependency.subsystem !== deleteId && dependency.depSubsystem !== deleteId));
    setConstraints((prevConstraints) => prevConstraints.filter((constraint) => constraint.subsystem !== deleteId));
    setEvaluator((prevEvaluator) => {
      const { keyRequests } = prevEvaluator;
      const newKeyRequests = keyRequests.filter((keyRequest) => keyRequest.subsystem !== deleteId);
      return { ...prevEvaluator, keyRequests: newKeyRequests };
    })
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== deleteId));
    setEdges((prevEdges) => prevEdges.filter((edge) => edge.source !== deleteId && edge.target !== deleteId));
    closePaletteAndModal();
  }, [deleteId]);

  const handleDeleteAsset = useCallback(() => {
    setComponentList((prevList) => {
      return prevList.filter((component) => component.id !== deleteId)
        .map((component) => {
          if (component.parent === deleteId) {
            return { ...component, parent: null };
          }
          return component;
        });
    });
    setDependencyList((prevList) => {
      return prevList
        .filter((dependency) => dependency.subsystem !== deleteId && dependency.depSubsystem !== deleteId)
        .map((dependency) => {
          let newDependency = { ...dependency };
          if (newDependency.asset === deleteId) {
            newDependency.asset = null;
          }
          if (newDependency.depAsset === deleteId) {
            newDependency.depAsset = null;
          }
          return newDependency;
        });
    });
    setEvaluator((prevEvaluator) => {
      const { keyRequests } = prevEvaluator;
      const newKeyRequests = keyRequests.filter((keyRequest) => keyRequest.asset !== deleteId);
      return { ...prevEvaluator, keyRequests: newKeyRequests };
    })
    setNodes((prevNodes) => {
      return prevNodes.filter((node) => node.id !== deleteId)
        .map((node) => {
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
    });
    setEdges((prevEdges) => prevEdges.filter((edge) => edge.source !== deleteId && edge.target !== deleteId));
    closePaletteAndModal();
  }, [deleteId]);

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
      {data && <EditingPalette
        data={data}
        componentList={componentList}
        setComponentList={setComponentList}
        setDependencyList={setDependencyList}
        pythonSrc={pythonSrc}
        modelErrors={modelErrors}
        setModelErrors={setModelErrors}
        handleDeleteClick={handleDeleteClick}
      />}
      {!data && newNodeType === 'asset' && <NewAssetPalette
        componentList={componentList}
        setComponentList={setComponentList}
      />}
      {!data && newNodeType === 'subComponent' && <NewSubComponentPalette
        componentList={componentList}
        setComponentList={setComponentList}
        pythonSrc={pythonSrc}
      />}
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
