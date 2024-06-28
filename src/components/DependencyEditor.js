import { useState, useEffect, useCallback } from 'react';
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
  selectedNodeId,
  componentList,
  nodes,
  dependencyList,
  setDependencyList,
  setNodes,
  onNodesChange,
}) {
  const data = nodes.find((node) => node.id === selectedNodeId)?.data;
  const { fromComponent, toComponent, status, dependencyId, fromAsset, toAsset } = data;

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

  const handleAddDependency = () => {
    const newDependencyId = randomId();
    const newDependency = {
      id: newDependencyId,
      depSubsystem: fromComponent.id,
      subsystem: toComponent.id,
      fcnName: '',
    };
    setDependencyList((prevDependencyList) => {
      return [...prevDependencyList, newDependency];
    });
    setNodes((prevNodes) => {
      return prevNodes.map((node) => {
        if (node.id === selectedNodeId) {
          node.data.dependencyId = newDependencyId;
          node.data.status = 'dependent';
          // node.style.backgroundColor = '#4caf50';
          node.selected = true;
          return node;
        }
        return node;
      });
    });
  }

  const handleRemoveDependency = () => {
    setDependencyList((prevDependencyList) => {
      return prevDependencyList.filter((dependency) => dependency.id !== dependencyId);
    });
    setNodes((prevNodes) => {
      return prevNodes.map((node) => {
        if (node.id === selectedNodeId) {
          node.data.dependencyId = null;
          node.data.status = 'independent';
          // node.style.backgroundColor = '#888888';
          node.selected = true;
          return node;
        }
        return node;
      });
    });
  }

  const toolTipLabel = `${fromComponent.name} (${fromAsset}) → ${toComponent.name} (${toAsset})`;
  const fcnName = dependencyList.find((dependency) => dependency.id === dependencyId)?.fcnName

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
        {status === 'dependent' && <TextField
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
            onClick={handleAddDependency}
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