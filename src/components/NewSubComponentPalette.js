import { useState } from 'react';
import { validateAssetParameters } from '../utils/validateParameters';

import NameField from './PaletteComponents/NameField';
import ClassName from './PaletteComponents/ClassName';
import SubsystemType from './PaletteComponents/SubsystemType';
import ParentSelector from './PaletteComponents/ParentSelector';
import SourceFile from './PaletteComponents/SourceFile';
import SubsystemParameters from './PaletteComponents/SubsystemParameters';
import SubsystemStates from './PaletteComponents/SubsystemStates';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

import { randomId } from '@mui/x-data-grid-generator';

export default function NewSubComponentPalette({
  componentList,
  setComponentList,
  pythonSrc,
}) {
  const [ id, setId ] = useState(randomId());
  const [ name, setName ] = useState('');
  const [ className, setClassName ] = useState('power');
  const [ parent, setParent ] = useState(null);
  const [ type, setType ] = useState('scripted');
  const [ src, setSrc ] = useState(pythonSrc);
  const [ states, setStates ] = useState([]);
  const [ parameters, setParameters ] = useState([]);
  const [ newNodeErrors, setNewNodeErrors ] = useState({});

  const data = {
    id,
    name,
    className,
    parent,
    type,
    src,
    states,
    parameters,
  };

  const updateNewComponent = (updaterFunc) => {
    // func is a function that takes the current state (componentList) and returns an updated state (componentList)
    const [ updatedData ] = updaterFunc([data]);
    setName(updatedData.name);
    setClassName(updatedData.className);
    setParent(updatedData.parent);
    setType(updatedData.type);
    setSrc(updatedData.src);
    setStates([...updatedData.states]);
    setParameters([...updatedData.parameters]);
  }

  const handleBlur = () => {
    validateAssetParameters(data, setNewNodeErrors, pythonSrc);
  }

  const handleDragStart = (e) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify({ data }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const componentKeys = ['id', 'name', 'className', 'parent', 'type', 'src'];
  states.forEach((state) => { componentKeys.push(state.key) });
  parameters.forEach((parameter) => { componentKeys.push(parameter.name) });

  const currentNodeErrors = newNodeErrors[id] ? newNodeErrors[id] : {};

  return (
    <>
      <Box sx={{ margin: '0 20px', padding: '10px', backgroundColor: '#eeeeee', borderRadius: '5px' }}>
        <Typography variant="h4" color="secondary" mt={2}>{`Create New Subcomponent`}</Typography>
        <Grid container spacing={2} my={2}>
          <NameField name={name} setComponentList={updateNewComponent} id={id} errors={currentNodeErrors} handleBlur={handleBlur}/>
          <ClassName className={className} id={id} setComponentList={updateNewComponent} errors={currentNodeErrors} handleBlur={handleBlur}/>
        </Grid>
        <Grid container spacing={2}>
          <SubsystemType type={type} setComponentList={updateNewComponent} id={id} errors={currentNodeErrors} handleBlur={handleBlur}/>
          <ParentSelector id={id} parent={parent} componentList={componentList} setComponentList={updateNewComponent} errors={updateNewComponent} handleBlur={handleBlur}/>
        </Grid>
        <SourceFile
          src={src}
          setComponentList={updateNewComponent}
          id={id}
          pythonSrc={pythonSrc}
          errors={currentNodeErrors}
          handleBlur={handleBlur}
        />
        <SubsystemParameters data={parameters} id={id} setComponentList={updateNewComponent} componentKeys={componentKeys} errors={currentNodeErrors} handleBlur={handleBlur}/>
        <SubsystemStates data={states} id={id} setComponentList={updateNewComponent} componentKeys={componentKeys} errors={currentNodeErrors} handleBlur={handleBlur}/>
      </Box>
      <div className="drag-drop-container" style={{ marginBottom: 120 }}>
        {name && Object.keys(currentNodeErrors).length === 0 && <>
          <Typography variant="body2" color="light" mt={2} >{'Drag and drop this component into the model.'}</Typography>
          <div className="new-node-origin">
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '20px',
                padding: '10px',
                backgroundColor: '#eeeeee',
                borderRadius: '5px',
                height: 50,
                width: 200,
                cursor: 'grab',
                gap: 1,
              }}
              onDragStart={handleDragStart}
              draggable
            >
              <Typography variant="h6" color="secondary">{name}</Typography>
            </Card>
          </div>
        </>}
      </div>
    </>
  );
}