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

import { validateDependency } from '../utils/validateDependencies';

export default function DependencyEditor ({
  componentA,
  componentB,
  componentList,
  setEdges,
  dependencyList,
  setDependencyList,
  dependencyErrors,
  setDependencyErrors,
}) {
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
      asset: direction === 'ab' ? componentB.parent : componentA.parent,
      depAsset: direction === 'ab' ? componentA.parent : componentB.parent,
      fcnName: '',
    };
    setDependencyList((prevDependencyList) => {
      return [...prevDependencyList, newDependency];
    });

    let sourceHandle = 'right';
    let targetHandle = 'top';
    const firstComponent = componentList.find(c => c.id === componentA.id || c.id === componentB.id);
    if ((direction === 'ab' && firstComponent.id === componentB.id) ||
        (direction === 'ba' && firstComponent.id === componentA.id)) {
      sourceHandle = 'left';
      targetHandle = 'bottom';
    }

    setEdges((prevEdges) => {
      return [...prevEdges, {
        id: newDependencyId,
        source: newDependency.depSubsystem,
        target: newDependency.subsystem,
        sourceHandle,
        targetHandle,
        data: newDependency.fcnName,
        type: 'function',
        label: newDependency.fcnName ? '⨍' : null,
        markerEnd: {
          type: 'arrowclosed',
          width: 15,
          height: 15,
          color: '#eee',
        },
        style: {
          strokeWidth: 1,
          stroke: '#EEE'
        },
        selected: true,
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

  const handleBlur = (direction) => () => {
    const dependencyId = direction === 'ab' ? abDependencyID : baDependencyID;
    const dependency = dependencyList.find((dependency) => dependency.id === dependencyId);
    validateDependency(dependency, setDependencyErrors, componentList);
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
            error={dependencyErrors[abDependencyID]?.fcnName !== undefined}
            helperText={dependencyErrors[abDependencyID]?.fcnName}
            type='text'
            onChange={handleDepFcnChange('ab')}
            onBlur={handleBlur('ab')}
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
            error={dependencyErrors[baDependencyID]?.fcnName !== undefined}
            helperText={dependencyErrors[baDependencyID]?.fcnName}
            type='text'
            onChange={handleDepFcnChange('ba')}
            onBlur={handleBlur('ba')}
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