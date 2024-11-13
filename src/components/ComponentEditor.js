import { useRef, useState, useEffect, useCallback } from 'react';

import NameField from './PaletteComponents/NameField';
import ClassName from './PaletteComponents/ClassName';
import StateData from './PaletteComponents/StateData';
import { DynamicStateType } from './PaletteComponents/DynamicStateType';
import { EomsType } from './PaletteComponents/EomsType';
import IntegratorOptions from './PaletteComponents/IntegratorOptions';
import IntegratorParameters from './PaletteComponents/IntegratorParameters';
import SubsystemType from './PaletteComponents/SubsystemType';
import ParentSelector from './PaletteComponents/ParentSelector';
import SourceFile from './PaletteComponents/SourceFile';
import SubsystemParameters from './PaletteComponents/SubsystemParameters';
import SubsystemStates from './PaletteComponents/SubsystemStates';
import { Constraints } from './PaletteComponents/Constraints';
import ConfirmationModal from './ConfirmationModal';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { validateComponent } from '../utils/validateComponents';

export default function ComponentEditor ({
  handlePaletteClose,
  data,
  componentList,
  setComponentList,
  setDependencyList,
  constraints,
  setConstraints,
  pythonSrc,
  modelErrors,
  setModelErrors,
  constraintErrors,
  setConstraintErrors,
  setEvaluator,
  setNodes,
  setEdges,
}) {
  const [deleteId, setDeleteId] = useState(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const constraintRefs = useRef({});

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
    setConstraints((prevConstraints) => prevConstraints.filter(({ subsystem }) => {
      const subcomponent = componentList.find(({ id }) => id === subsystem);
      return subcomponent ? subcomponent.parent !== deleteId : true;
    }));
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

  const {
    id,
    name,
    className,
    dynamicStateType,
    eomsType,
    stateData,
    integratorOptions,
    integratorParameters,
    // Subsystem-specific data
    type,
    parameters,
    states,
    src,
    parent,
  } = data;

  const handleBlur = () => {
    validateComponent(data, setModelErrors, componentList, pythonSrc);
  }

  const handleCopyClick = () => {
    if (window.electronApi) {
      window.electronApi.writeToClipboard(JSON.stringify(data, null, 2));
    }
  }

  const scrollToConstraint = (stateKey) => {
    if (constraintRefs.current[stateKey]) {
      constraintRefs.current[stateKey].scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    validateComponent(data, setModelErrors, componentList, pythonSrc);
  }, [id, src]);

  const componentKeys = ['id', 'name', 'className'];
  if (parent === undefined) { // Asset
    componentKeys.push('dynamicStateType', 'eomsType', 'stateData');
    Object.keys(integratorOptions).forEach((key) => { componentKeys.push(key) });
    integratorParameters.forEach((parameter) => { componentKeys.push(parameter.key) });
  } else { // Subcomponent
    componentKeys.push('type', 'src', 'parent');
    states.forEach((state) => { componentKeys.push(state.key) });
    parameters.forEach((parameter) => { componentKeys.push(parameter.name) });
  }

  const currentNodeErrors = modelErrors[id] ? modelErrors[id] : {};
  const noErrors = Object.keys(currentNodeErrors).length === 0 && Object.keys(constraintErrors).length === 0;

  return (
    <>
      <Box sx={{ margin: '0 20px', padding: '10px', backgroundColor: '#eeeeee', borderRadius: '5px' }}>
        <Stack direction="row" alignItems="center" sx={{ position: 'relative', width: '100%' }}>
          <Typography
            variant="h4"
            color="secondary"
            mt={2}
            sx={{ flexGrow: 1, textAlign: 'center' }}
          >
            {name ? name : ' '}
          </Typography>
          {noErrors && <Box sx={{ position: 'absolute', right: 0 }}>
            <Tooltip title={`Copy ${className ? 'Component' : 'Asset'} to Clipboard`}>
              <IconButton
                onClick={handleCopyClick}
                color="secondary"
                size="small"
              >
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Box>}
        </Stack>
        {parent === undefined && <>
          <NameField
            name={name}
            setComponentList={setComponentList}
            id={id} errors={currentNodeErrors}
            handleBlur={handleBlur}
          />
          <Grid container spacing={2}>
            <DynamicStateType
              value={dynamicStateType}
              setComponentList={setComponentList}
              id={id}
              errors={currentNodeErrors}
              handleBlur={handleBlur}
            />
            <EomsType
              value={eomsType}
              setComponentList={setComponentList}
              id={id}
              errors={currentNodeErrors}
              handleBlur={handleBlur}
            />
          </Grid>
          <StateData
            stateData={stateData}
            id={id}
            setComponentList={setComponentList}
            errors={currentNodeErrors}
            handleBlur={handleBlur}
          />
          <IntegratorOptions
            integratorOptions={integratorOptions}
            id={id}
            setComponentList={setComponentList}
            errors={currentNodeErrors}
            componentKeys={componentKeys}
            handleBlur={handleBlur}
          />
          <IntegratorParameters
            integratorParameters={integratorParameters}
            id={id}
            setComponentList={setComponentList}
            errors={currentNodeErrors}
            componentKeys={componentKeys}
            handleBlur={handleBlur}
          />
        </>}
        {parent && <>
          <NameField
            name={name}
            setComponentList={setComponentList}
            id={id}
            errors={currentNodeErrors}
            handleBlur={handleBlur}
          />
          <Grid container spacing={2} mb={2}>
            <SubsystemType
              type={type}
              setComponentList={setComponentList}
              id={id} errors={currentNodeErrors}
              handleBlur={handleBlur}
            />
            <ParentSelector
              id={id}
              parent={parent}
              componentList={componentList}
              setComponentList={setComponentList}
              errors={currentNodeErrors}
              handleBlur={handleBlur}
              disabled={true}
            />
          </Grid>
          {type === 'scripted' ?
            <SourceFile
              src={src}
              setComponentList={setComponentList}
              id={id}
              pythonSrc={pythonSrc}
              errors={currentNodeErrors}
              handleBlur={handleBlur}
            /> :
            <ClassName
              className={className}
              id={id}
              setComponentList={setComponentList}
              errors={currentNodeErrors}
              handleBlur={handleBlur}
            />
          }
          <SubsystemParameters
            parameters={parameters}
            id={id}
            setComponentList={setComponentList}
            componentKeys={componentKeys}
            errors={currentNodeErrors}
            handleBlur={handleBlur}
          />
          <SubsystemStates
            states={states}
            id={id}
            setComponentList={setComponentList}
            componentKeys={componentKeys}
            constraints={constraints}
            scrollToConstraint={scrollToConstraint}
            errors={currentNodeErrors}
            handleBlur={handleBlur}
          />
          {states.length > 0 && <Constraints
            states={states}
            componentId={id}
            constraints={constraints}
            setConstraints={setConstraints}
            componentList={componentList}
            setComponentList={setComponentList}
            errors={constraintErrors}
            setErrors={setConstraintErrors}
            ref={constraintRefs.current}
          />}
        </>}
      </Box>
      <div className="confirm-close-icons" style={{ marginBottom: 120 }}>
        <Button
          onClick={handleDeleteClick}
          variant="contained"
          color="error"
          size="large"
          startIcon={<DeleteIcon/>}
          >
            {`Delete ${data.className ? 'Component' : 'Asset'}`}
        </Button>
      </div>
      {confirmationModalOpen &&
        <ConfirmationModal
          onCancel={handleDeleteCancel}
          onConfirm={!data.className ? handleDeleteAsset : handleDeleteSubComponent }
          title={`Delete ${data.name}?`}
          message={`Are you sure you want to delete ${data.name}?`}
          submessage={!data.className ? ' This will also delete all subcomponents.' : ''}
          confirmText="Delete"
          cancelText="Cancel"
        />
      }
    </>
  );
}