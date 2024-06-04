import { useRef, useEffect } from 'react';

import NameField from './PaletteComponents/NameField';
import ClassName from './PaletteComponents/ClassName';
import StateData from './PaletteComponents/StateData';
import DynamicStateType from './PaletteComponents/DynamicStateType';
import EomsType from './PaletteComponents/EomsType';
import IntegratorOptions from './PaletteComponents/IntegratorOptions';
import IntegratorParameters from './PaletteComponents/IntegratorParameters';
import SubsystemType from './PaletteComponents/SubsystemType';
import ParentSelector from './PaletteComponents/ParentSelector';
import SourceFile from './PaletteComponents/SourceFile';
import SubsystemParameters from './PaletteComponents/SubsystemParameters';
import SubsystemStates from './PaletteComponents/SubsystemStates';
import Constraints from './PaletteComponents/Constraints';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { validateAssetParameters } from '../utils/validateParameters';

export default function EditingPalette ({
  data,
  componentList,
  setComponentList,
  setDependencyList,
  constraints,
  setConstraints,
  pythonSrc,
  modelErrors,
  setModelErrors,
  handleDeleteClick
}) {
  const constraintRefs = useRef({});

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
    validateAssetParameters(data, setModelErrors, pythonSrc);
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
    validateAssetParameters(data, setModelErrors, pythonSrc);
  }, [id, src]);

  const componentKeys = ['id', 'name', 'className'];
  if (className === 'asset') {
    componentKeys.push('dynamicStateType', 'eomsType', 'stateData');
    Object.keys(integratorOptions).forEach((key) => { componentKeys.push(key) });
    integratorParameters.forEach((parameter) => { componentKeys.push(parameter.key) });
  } else {
    componentKeys.push('type', 'src', 'parent');
    states.forEach((state) => { componentKeys.push(state.key) });
    parameters.forEach((parameter) => { componentKeys.push(parameter.name) });
  }

  const currentNodeErrors = modelErrors[id] ? modelErrors[id] : {};

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
          <Box sx={{ position: 'absolute', right: 0 }}>
            <Tooltip title="Copy component">
              <IconButton
                onClick={handleCopyClick}
                color="secondary"
                size="small"
              >
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>
        {className === 'asset' && <>
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
          <StateData data={stateData} id={id} setComponentList={setComponentList} errors={currentNodeErrors} handleBlur={handleBlur}/>
          <IntegratorOptions
            data={integratorOptions}
            id={id}
            setComponentList={setComponentList}
            errors={currentNodeErrors}
            componentKeys={componentKeys}
            handleBlur={handleBlur}
          />
          <IntegratorParameters
            data={integratorParameters}
            id={id}
            setComponentList={setComponentList}
            errors={currentNodeErrors}
            componentKeys={componentKeys}
            handleBlur={handleBlur}
          />
        </>}
        {className !== 'asset' && <>
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
            setComponentList={setComponentList}
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
            Delete Component
        </Button>
      </div>
    </>
  );
}