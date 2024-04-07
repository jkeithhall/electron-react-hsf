import { useState, useEffect } from 'react';

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

import { validatePythonFile } from '../utils/validatePythonFiles';

export default function EditingPalette ({
  data,
  componentList,
  setComponentList,
  setDependencyList,
  pythonSrc,
  modelErrors,
  setModelErrors,
  componentIds,
}) {
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);


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
  let parentName = componentIds.getName(parent);

  const validateSrc = (src) => {
    const currentNodeErrors = modelErrors[id] ? modelErrors[id] : {};
    if (!validatePythonFile(pythonSrc, src)) {
      const message = 'Source File must be in the Python source directory listed in the scenario parameters.';
      currentNodeErrors['src'] = message;
      console.log({currentNodeErrors});
      setModelErrors((prevErrors) => {
        // Add error message to the src key of the object with the id key
        return { ...prevErrors, [id]: {...currentNodeErrors} };
      });
    } else {
      // Remove error message from the src key of the object with the id key
      delete currentNodeErrors['src'];
      setModelErrors((prevErrors) => {
        if (Object.keys(currentNodeErrors) > 0) {
          return { ...prevErrors, [id]: {...currentNodeErrors} };
        } else {
          delete prevErrors[id];
          return prevErrors;
        }
      });
    }
  }

  useEffect(() => {
    // TO DO: Add validation for other fields
    if (className !== 'asset') {
      validateSrc(src);
    }
  }, [id, src]);

  const stateComponents = ['x', 'y', 'z', 'v_x', 'v_y', 'v_z'];

  return (
    <>
      <Box sx={{ margin: '0 20px', padding: '10px', backgroundColor: '#eeeeee', borderRadius: '5px' }}>
        <Typography variant="h4" color="secondary" mt={2}>{`${name ? name : ' '}`}</Typography>
        <Grid container spacing={2} my={2}>
          <NameField name={name} setComponentList={setComponentList} id={id}/>
          <ClassName className={className} setcompid={id}/>
        </Grid>
        {className === 'asset' && <>
          <Grid container spacing={2}>
            <DynamicStateType value={dynamicStateType} setComponentList={setComponentList} id={id}/>
            <EomsType value={eomsType} setComponentList={setComponentList} id={id}/>
          </Grid>
          <StateData data={stateData} id={id} setComponentList={setComponentList} stateComponents={stateComponents} />
          <IntegratorOptions data={integratorOptions} id={id} setComponentList={setComponentList} />
          <IntegratorParameters data={integratorParameters} id={id} setComponentList={setComponentList} stateComponents={stateComponents} />
        </>}
        {className !== 'asset' && <>
          <Grid container spacing={2}>
            <SubsystemType type={type} setComponentList={setComponentList} id={id} />
            <AssetGroup name={parentName}/>
          </Grid>
          <SourceFile
            src={src}
            errorMessage={modelErrors[id] && modelErrors[id]['src'] ? modelErrors[id]['src'] : ''}
            setComponentList={setComponentList}
            id={id}
            pythonSrc={pythonSrc}
            validateSrc={validateSrc}
          />
          <SubsystemParameters data={parameters} id={id} setComponentList={setComponentList}/>
          <SubsystemStates data={states} id={id} setComponentList={setComponentList}/>
        </>}
      </Box>
    </>
  );
}