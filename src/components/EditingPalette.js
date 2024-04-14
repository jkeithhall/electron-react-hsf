import { useEffect } from 'react';

import NameField from './PaletteComponents/NameField';
import ClassName from './PaletteComponents/ClassName';
import StateData from './PaletteComponents/StateData';
import DynamicStateType from './PaletteComponents/DynamicStateType';
import EomsType from './PaletteComponents/EomsType';
import IntegratorOptions from './PaletteComponents/IntegratorOptions';
import IntegratorParameters from './PaletteComponents/IntegratorParameters';
import SubsystemType from './PaletteComponents/SubsystemType';
import AssetGroup from './PaletteComponents/AssetGroup';
import SourceFile from './PaletteComponents/SourceFile';
import SubsystemParameters from './PaletteComponents/SubsystemParameters';
import SubsystemStates from './PaletteComponents/SubsystemStates';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import { validateAssetParameters } from '../utils/validateParameters';

export default function EditingPalette ({
  data,
  componentList,
  setComponentList,
  setDependencyList,
  pythonSrc,
  modelErrors,
  setModelErrors,
}) {

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

  useEffect(() => {
    validateAssetParameters(data, setModelErrors, pythonSrc);
  }, [id, src]);

  let parentName = componentList.find((component) => component.id === parent)?.name;

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
        <Typography variant="h4" color="secondary" mt={2}>{`${name ? name : ' '}`}</Typography>
        <Grid container spacing={2} my={2}>
          <NameField name={name} setComponentList={setComponentList} id={id} errors={currentNodeErrors} handleBlur={handleBlur}/>
          <ClassName className={className} setcompid={id} errors={currentNodeErrors} handleBlur={handleBlur}/>
        </Grid>
        {className === 'asset' && <>
          <Grid container spacing={2}>
            <DynamicStateType value={dynamicStateType} setComponentList={setComponentList} id={id} errors={currentNodeErrors} handleBlur={handleBlur}/>
            <EomsType value={eomsType} setComponentList={setComponentList} id={id} errors={currentNodeErrors} handleBlur={handleBlur}/>
          </Grid>
          <StateData data={stateData} id={id} setComponentList={setComponentList} errors={currentNodeErrors} handleBlur={handleBlur}/>
          <IntegratorOptions data={integratorOptions} id={id} setComponentList={setComponentList} errors={currentNodeErrors} componentKeys={componentKeys} handleBlur={handleBlur}/>
          <IntegratorParameters data={integratorParameters} id={id} setComponentList={setComponentList} errors={currentNodeErrors} componentKeys={componentKeys} handleBlur={handleBlur}/>
        </>}
        {className !== 'asset' && <>
          <Grid container spacing={2}>
            <SubsystemType type={type} setComponentList={setComponentList} id={id} errors={currentNodeErrors} handleBlur={handleBlur}/>
            <AssetGroup name={parentName} errors={currentNodeErrors} handleBlur={handleBlur}/>
          </Grid>
          <SourceFile
            src={src}
            setComponentList={setComponentList}
            id={id}
            pythonSrc={pythonSrc}
            errors={currentNodeErrors}
            handleBlur={handleBlur}
          />
          <SubsystemParameters data={parameters} id={id} setComponentList={setComponentList} componentKeys={componentKeys} errors={currentNodeErrors} handleBlur={handleBlur}/>
          <SubsystemStates data={states} id={id} setComponentList={setComponentList} componentKeys={componentKeys} errors={currentNodeErrors} handleBlur={handleBlur}/>
        </>}
      </Box>
    </>
  );
}