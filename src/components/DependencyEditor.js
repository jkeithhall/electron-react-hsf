import { useState } from 'react';
import { randomId } from '@mui/x-data-grid-generator';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';

export default function DependencyEditor ({
  selectedComponents,
  componentList,
  nodes,
  edges,
  setEdges,
  dependencyList,
  setDependencyList,
  setNodes,
  onNodesChange,
}) {
  const componentA = selectedComponents[0].id < selectedComponents[1].id ? selectedComponents[0] : selectedComponents[1];
  const componentB = selectedComponents[0].id < selectedComponents[1].id ? selectedComponents[1] : selectedComponents[0];

  const [ abDependencyID, setABDependencyID ] = useState(() => {
    return dependencyList.find((dependency) => {
      return dependency.depSubsystem === componentA.id && dependency.subsystem === componentB.id;
    })?.id;
  })
  const [ baDependencyID, setBADependencyID ] = useState(() => {
    return dependencyList.find((dependency) => {
      return dependency.depSubsystem === componentB.id && dependency.subsystem === componentA.id;
    })?.id;
  });

  const handleDepFcnChange = (direction) => (e) => {
    const dependencyId = direction === 'ab' ? abDependencyID : baDependencyID;

    setDependencyList((prevDependencyList) => {
      return prevDependencyList.map((dependency) => {
        if (dependency.id === dependencyId) {
          return { ...dependency, fcnName: e.target.value };
        }
        return dependency;
      });
    });
    setEdges((prevEdges) => {
      return prevEdges.map((edge) => {
        if (edge.id === dependencyId) {
          return {
            ...edge,
            label: e.target.value.length > 0 ? '⨍' : null,
            data: e.target.value
          };
        }
        return edge;
      });
    });
  }

  const handleAddDependency = (direction) => () => {
    const newDependencyId = randomId();
    const newDependency = {
      id: newDependencyId,
      depSubsystem: direction === 'ab' ? componentA.id : componentB.id,
      subsystem: direction === 'ab' ? componentB.id : componentA.id,
      fcnName: '',
    };
    setDependencyList((prevDependencyList) => {
      return [...prevDependencyList, newDependency];
    });
    setEdges((prevEdges) => {
      return [...prevEdges, {
        id: newDependencyId,
        source: newDependency.depSubsystem,
        target: newDependency.subsystem,
        data: newDependency.fcnName,
        type: 'smoothstep',
        label: newDependency.fcnName ? '⨍' : null,
        markerEnd: {
          type: 'arrowclosed',
          width: 15,
          height: 15,
          color: '#333',
        },
        style: {
          strokeWidth: 2,
          stroke: '#333',
        },
      }];
    });
    direction === 'ab' ? setABDependencyID(newDependencyId) : setBADependencyID(newDependencyId);
  }

  const handleRemoveDependency = (direction) => () => {
    const dependencyId = direction === 'ab' ? abDependencyID : baDependencyID;

    setDependencyList((prevDependencyList) => {
      return prevDependencyList.filter((dependency) => {
        return dependency.id !== dependencyId;
      });
    });
    setEdges((prevEdges) => {
      return prevEdges.filter((edge) => {
        return edge.id !== dependencyId;
      });
    });
    direction === 'ab' ? setABDependencyID(null) : setBADependencyID(null);
  }

  const abFcnName = dependencyList.find((dependency) => dependency.id === abDependencyID)?.fcnName ?? '';
  const baFcnName = dependencyList.find((dependency) => dependency.id === baDependencyID)?.fcnName ?? '';

  const assetAName = componentList.find((component) => component.id === componentA.parent)?.name;
  const assetBName = componentList.find((component) => component.id === componentB.parent)?.name;

  return (
    <>
      <Box sx={{ margin: '0 20px', padding: '10px', backgroundColor: '#eeeeee', borderRadius: '5px' }}>
        <Typography
          variant="h4"
          color="secondary"
          my={2}
          sx={{ flexGrow: 1, textAlign: 'center' }}
        >
          {`${componentA.name} (${assetAName}) → ${componentB.name} (${assetBName})`}
        </Typography>
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          sx={{ position: 'relative', width: '100%', padding: '0 10px' }}
        >
          {abDependencyID ? <LinkIcon color="success"/> : <LinkOffIcon color="secondary"/>}
          <Typography
            variant="bod1"
            color="secondary"
            mx={1}
            my={2}
            sx={{ textAlign: 'left' }}
          >
            {abDependencyID ? 'Dependency Exists' : 'No Dependency'}
          </Typography>
        </Stack>
        {abDependencyID && <TextField
            id='depFcnName'
            key='depFcnName'
            fullWidth
            sx={{ my: 2 }}
            label='Dependency Function'
            variant="outlined"
            color='primary'
            value={abFcnName}
            type='text'
            onChange={handleDepFcnChange('ab')}
          />
        }
      </Box>
      <div className="confirm-close-icons">
        {abDependencyID ?
          <Button
            onClick={handleRemoveDependency('ab')}
            variant="contained"
            color="error"
            size="large"
            startIcon={<RemoveCircleIcon />}
            sx={{ backgroundColor: '#888888' }}
            >
              Remove Dependency
          </Button> :
          <Button
            onClick={handleAddDependency('ab')}
            variant="contained"
            color="success"
            size="large"
            startIcon={<AutoAwesomeMotionIcon />}
            >
              Add Dependency
          </Button>
        }
      </div>
      <Box sx={{ margin: '0 20px', padding: '10px', backgroundColor: '#eeeeee', borderRadius: '5px' }}>
        <Typography
          variant="h4"
          color="secondary"
          my={2}
          sx={{ flexGrow: 1, textAlign: 'center' }}
        >
          {`${componentB.name} (${assetBName}) → ${componentA.name} (${assetAName})`}
        </Typography>
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          sx={{ position: 'relative', width: '100%', padding: '0 10px' }}
        >
          {baDependencyID ? <LinkIcon color="success"/> : <LinkOffIcon color="secondary"/>}
          <Typography
            variant="bod1"
            color="secondary"
            mx={1}
            my={2}
            sx={{ textAlign: 'left' }}
          >
            {baDependencyID ? 'Dependency Exists' : 'No Dependency'}
          </Typography>
        </Stack>
        {baDependencyID && <TextField
            id='depFcnName'
            key='depFcnName'
            fullWidth
            sx={{ my: 2 }}
            label='Dependency Function'
            variant="outlined"
            color='primary'
            value={baFcnName}
            type='text'
            onChange={handleDepFcnChange('ba')}
          />
        }
      </Box>
      <div className="confirm-close-icons" style={{ marginBottom: 120 }}>
        {baDependencyID ?
          <Button
            onClick={handleRemoveDependency('ba')}
            variant="contained"
            color="error"
            size="large"
            startIcon={<RemoveCircleIcon />}
            sx={{ backgroundColor: '#888888' }}
            >
              Remove Dependency
          </Button> :
          <Button
            onClick={handleAddDependency('ba')}
            variant="contained"
            color="success"
            size="large"
            startIcon={<AutoAwesomeMotionIcon />}
            >
              Add Dependency
          </Button>
        }
      </div>
    </>
  );
}