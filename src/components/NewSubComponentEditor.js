import { useState, useRef } from 'react';
import { validateAssetParameters } from '../utils/validateParameters';

import NameField from './PaletteComponents/NameField';
import ClassName from './PaletteComponents/ClassName';
import SubsystemType from './PaletteComponents/SubsystemType';
import ParentSelector from './PaletteComponents/ParentSelector';
import SourceFile from './PaletteComponents/SourceFile';
import SubsystemParameters from './PaletteComponents/SubsystemParameters';
import SubsystemStates from './PaletteComponents/SubsystemStates';
import { Constraints } from './PaletteComponents/Constraints';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';

import { randomId } from '@mui/x-data-grid-generator';

export default function NewSubComponentEditor({
  componentList,
  setComponentList,
  constraints,
  setConstraints,
  pythonSrc,
  clipboardData,
}) {
  const [ id ] = useState(randomId());
  const [ name, setName ] = useState('');
  const [ className, setClassName ] = useState('power');
  const [ parent, setParent ] = useState(() => {
    const asset = componentList.find((component) => !component.className);
    return asset ? asset.id : null;
  });
  const [ type, setType ] = useState('scripted');
  const [ src, setSrc ] = useState(pythonSrc);
  const [ states, setStates ] = useState([]);
  const [ parameters, setParameters ] = useState([]);
  const [ newNodeErrors, setNewNodeErrors ] = useState({});
  const [ newConstraints, setNewConstraints ] = useState([]);
  const constraintRefs = useRef({});

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
    // updaterFunc is a function that takes the current state (componentList) and returns an updated state (componentList of one new component)
    const [ updatedData ] = updaterFunc([data]);
    setName(updatedData.name);
    setClassName(updatedData.className);
    setParent(updatedData.parent);
    setType(updatedData.type);
    setSrc(updatedData.src);
    setStates([...updatedData.states]);
    setParameters([...updatedData.parameters]);
  }

  const handlePasteClick = () => {
    if (clipboardData) {
      const { name, className, parent, type, src, states, parameters } = clipboardData;
      setName(name);
      setClassName(className);
      setParent(parent);
      setType(type);
      setSrc(src);
      setStates([...states]);
      setParameters([...parameters]);

      // Copy constraints that are associated with the pasted component
      const copiedConstraints = constraints.filter((constraint) => constraint.subsystem === clipboardData.id).map((constraint) => {
        // Generate a new id for the copied constraint and use id of the new component as the subsystem id
        return { ...constraint, subsystem: id, id: randomId() }
      })
      // Add the copied constraints to the list of new constraints
      setNewConstraints(copiedConstraints);
      // Validate the parameters of the pasted component
      validateAssetParameters(clipboardData, setNewNodeErrors, src);
    }
  }

  const handleBlur = () => {
    validateAssetParameters(data, setNewNodeErrors, pythonSrc);
  }

  const handleDragStart = (e) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify({ data, newConstraints }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const scrollToConstraint = (stateKey) => {
    if (constraintRefs.current[stateKey]) {
      constraintRefs.current[stateKey].scrollIntoView({ behavior: 'smooth' });
    }
  };

  const componentKeys = ['id', 'name', 'className', 'parent', 'type', 'src'];
  states.forEach((state) => { componentKeys.push(state.key) });
  parameters.forEach((parameter) => { componentKeys.push(parameter.name) });

  const currentNodeErrors = newNodeErrors[id] ? newNodeErrors[id] : {};

  return (
    <>
      <Box sx={{ margin: '0 20px', padding: '10px', backgroundColor: '#eeeeee', borderRadius: '5px' }}>
      {clipboardData && clipboardData.className !== 'asset' ?
          <Stack direction="row" alignItems="center" sx={{ position: 'relative', width: '100%' }}>
            <Typography
              variant="h4"
              color="secondary"
              mt={2}
              sx={{ flexGrow: 1, textAlign: 'center' }}
            >
              {'Create New Subcomponent'}
            </Typography>
            <Box sx={{ position: 'absolute', right: 0 }}>
              <Tooltip title="Paste from clipboard">
                <IconButton
                  onClick={handlePasteClick}
                  color="secondary"
                  size="small"
                >
                  <ContentPasteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Stack> : <Typography variant="h4" color="secondary" mt={2}>{'Create New Subcomponent'}</Typography>
        }
        <NameField
          name={name}
          setComponentList={updateNewComponent}
          id={id}
          errors={currentNodeErrors}
          handleBlur={handleBlur}
        />
        <Grid container spacing={2} mb={2}>
          <SubsystemType
            type={type}
            setComponentList={updateNewComponent}
            id={id} errors={currentNodeErrors}
            handleBlur={handleBlur}
          />
          <ParentSelector
            id={id}
            parent={parent}
            componentList={componentList}
            setComponentList={updateNewComponent}
            errors={currentNodeErrors}
            handleBlur={handleBlur}
            disabled={false}
          />
        </Grid>
        {type === 'scripted' ?
          <SourceFile
            src={src}
            setComponentList={updateNewComponent}
            id={id}
            pythonSrc={pythonSrc}
            errors={currentNodeErrors}
            handleBlur={handleBlur}
          /> :
          <ClassName
            className={className}
            id={id}
            setComponentList={updateNewComponent}
            errors={currentNodeErrors}
            handleBlur={handleBlur}
          />
        }
        <SubsystemParameters
          parameters={parameters}
          id={id}
          setComponentList={updateNewComponent}
          componentKeys={componentKeys}
          errors={currentNodeErrors}
          handleBlur={handleBlur}
        />
        <SubsystemStates
          states={states}
          id={id}
          setComponentList={updateNewComponent}
          componentKeys={componentKeys}
          constraints={newConstraints}
          scrollToConstraint={scrollToConstraint}
          errors={currentNodeErrors}
          handleBlur={handleBlur}
        />
        {states.length > 0 && <Constraints
            states={states}
            componentId={id}
            constraints={newConstraints}
            setConstraints={setNewConstraints}
            setComponentList={setComponentList}
            ref={constraintRefs.current}
        />}
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