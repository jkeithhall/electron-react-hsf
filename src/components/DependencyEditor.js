import { useState } from 'react';
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
  data,
  status,
  componentList,
  setDependencyList,
  setNodes,
  handlePaletteClose,
}) {
  const {
    toolTipLabel,
    dependencyId,
    fcnName,
  } = data;

  const handleDepFcnChange = (e) => {
    setDependencyList((prevDependencyList) => {
      return prevDependencyList.map((dependency) => {
        if (dependency.id === dependencyId) {
          return { ...dependency, fcnName: e.target.value };
        }
        return dependency;
      });
    });
  }

  const handleRemoveDependency = () => {
    setDependencyList((prevDependencyList) => {
      return prevDependencyList.filter((dependency) => dependency.id !== dependencyId);
    });
    setNodes((prevNodes) => {
      return prevNodes.map((node) => {
        if (node.data.dependencyId === dependencyId) {
          return {
            ...node,
            data: {
              ...node.data,
              status: 'independent',
              fcnName: null,
            },
            style: { ...node.style, backgroundColor: '#888888' },
          }
        }
        return node;
      });
    });
    handlePaletteClose();
  }


  return (
    <>
      <Box sx={{ margin: '0 20px', padding: '10px', backgroundColor: '#eeeeee', borderRadius: '5px' }}>
        <Typography
          variant="h4"
          color="secondary"
          my={2}
          sx={{ flexGrow: 1, textAlign: 'center' }}
        >
          {toolTipLabel ? toolTipLabel : ' '}
        </Typography>
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          sx={{ position: 'relative', width: '100%', padding: '0 10px' }}
        >
          {status === 'dependent' ? <LinkIcon color="success"/> : <LinkOffIcon color="secondary"/>}
          <Typography
            variant="bod1"
            color="secondary"
            mx={1}
            my={2}
            sx={{ textAlign: 'left' }}
          >
            {`(${status.charAt(0).toUpperCase() + status.slice(1)})`}
          </Typography>
        </Stack>
        {fcnName && <TextField
            id='depFcnName'
            key='depFcnName'
            fullWidth
            sx={{ my: 2 }}
            label='Dependency Function'
            variant="outlined"
            color='primary'
            value={fcnName}
            type='text'
            onChange={handleDepFcnChange}
          />
        }
      </Box>
      <div className="confirm-close-icons" style={{ marginBottom: 120 }}>
        {status === 'independent' &&
          <Button
            onClick={() => {}}
            variant="contained"
            color="success"
            size="large"
            startIcon={<AutoAwesomeMotionIcon />}
            >
              Add Dependency
          </Button>
        }
        {status === 'dependent' &&
          <Button
            onClick={handleRemoveDependency}
            variant="contained"
            color="error"
            size="large"
            startIcon={<RemoveCircleIcon />}
            sx={{ backgroundColor: '#888888' }}
            >
              Remove Dependency
          </Button>
        }
      </div>
    </>
  );
}