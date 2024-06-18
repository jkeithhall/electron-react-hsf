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
  clipboardData,
  componentList,
  paletteOpen,
  handlePaletteClose,
  setComponentList,
  setDependencyList,
  constraints,
  setConstraints,
  setEvaluator,
  setNodes,
  setEdges,
  pythonSrc,
  modelErrors,
  setModelErrors,
 }) {
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Opens a confirmation modal when the delete button is clicked
  const handleDeleteClick = () => {
    setConfirmationModalOpen(true);
    setDeleteId(data.id);
  }

  // Deletes a subcomponent and all of its dependencies
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

  // Deletes an asset and all of its subcomponents
  const handleDeleteAsset = useCallback(() => {
    setComponentList((prevList) => prevList
      .filter((component) => component.id !== deleteId && component.parent !== deleteId)
    );
    setDependencyList((prevList) => prevList
      .filter((dependency) => dependency.asset !== deleteId && dependency.depAsset !== deleteId &&
        dependency.subsystem !== deleteId && dependency.depSubsystem !== deleteId)
    );
    setEvaluator((prevEvaluator) => {
      const { keyRequests } = prevEvaluator;
      const newKeyRequests = keyRequests.filter((keyRequest) => keyRequest.asset !== deleteId);
      return { ...prevEvaluator, keyRequests: newKeyRequests };
    })
    setNodes((prevNodes) => {
      return prevNodes.filter((node) => node.id !== deleteId && node.parentNode !== deleteId);
    });
    setEdges((prevEdges) => prevEdges.filter((edge) => edge.source !== deleteId && edge.target !== deleteId));
    closePaletteAndModal();
  }, [deleteId]);

  // Closes the palette and modal
  const closePaletteAndModal = () => {
    handlePaletteClose();
    setConfirmationModalOpen(false);
    setDeleteId(null);
  }

  // Closes the confirmation modal
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
        constraints={constraints}
        setConstraints={setConstraints}
        pythonSrc={pythonSrc}
        modelErrors={modelErrors}
        setModelErrors={setModelErrors}
        handleDeleteClick={handleDeleteClick}
      />}
      {!data && newNodeType === 'asset' && <NewAssetPalette
        componentList={componentList}
        setComponentList={setComponentList}
        clipboardData={clipboardData}
      />}
      {!data && newNodeType === 'subComponent' && <NewSubComponentPalette
        componentList={componentList}
        setComponentList={setComponentList}
        constraints={constraints}
        setConstraints={setConstraints}
        pythonSrc={pythonSrc}
        clipboardData={clipboardData}
      />}
      {confirmationModalOpen &&
        <ConfirmationModal
          onCancel={handleDeleteCancel}
          onConfirm={!data.className ? handleDeleteAsset : handleDeleteSubComponent }
          title={`Delete ${data.name}?`}
          message={`Are you sure you want to delete ${data.name}?`}
          submessage={!data.className ? ' This will also delete all subcomponents.' : ''}
          confirmText="Delete"
          cancelText="Cancel"
        />}
    </Drawer>
  );
}
