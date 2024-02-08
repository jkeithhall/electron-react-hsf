import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import AppBar from './AppBar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import PlaceIcon from '@mui/icons-material/Place';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import FunctionsIcon from '@mui/icons-material/Functions';
import RuleIcon from '@mui/icons-material/Rule';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import QueryStatsIcon from '@mui/icons-material/QueryStats';

const navCategories = ['Scenario', 'Tasks', 'System Model', 'Dependencies', 'Constraints', 'Simulate', 'Analyze'];

const openedMixin = (theme, drawerWidth) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open, drawerWidth }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme, drawerWidth),
      '& .MuiDrawer-paper': openedMixin(theme, drawerWidth),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function NavDrawer({ navOpen, toggleNav, drawerWidth, activeStep, setActiveStep, children }) {
  return (
    <Box sx={{ display: 'flex', className: "App" }}>
      <AppBar open={navOpen} drawerWidth={drawerWidth} />
      <Drawer variant="permanent" open={navOpen} mt={2} PaperProps={{
          sx: {
            height: 'calc(100% - 100px)',
            top: 100,
          },
        }}>
        <IconButton
          onClick={toggleNav}
          color="info"
          size="large"
          sx={{
            minHeight: 58,
            alignSelf: navOpen ? 'flex-end' : 'none',
            marginRight: navOpen ? 2 : 0,
          }}>
          {navOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
        <Divider />
        <List>
          {navCategories.map((step) => {
            return (
              <ListItem key={step} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  sx={{
                    minHeight: 50,
                    px: 2.5,
                  }}
                  onClick={() => setActiveStep(step)}
                >
                  <ListItemIcon
                    sx={{
                      color: 'inherit',
                      minWidth: 0,
                      mr: navOpen ? 2 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {
                      {
                        'Scenario': <SatelliteAltIcon color={activeStep === step ? 'info' : 'inherit'}/>,
                        'Tasks': <PlaceIcon color={activeStep === step ? 'info' : 'inherit'}/>,
                        'System Model': <AccountTreeIcon color={activeStep === step ? 'info' : 'inherit'}/>,
                        'Dependencies': <FunctionsIcon color={activeStep === step ? 'info' : 'inherit'}/>,
                        'Constraints': <RuleIcon color={activeStep === step ? 'info' : 'inherit'}/>,
                        'Simulate': <PlayCircleIcon color={activeStep === step ? 'info' : 'inherit'}/>,
                        'Analyze': <QueryStatsIcon color={activeStep === step ? 'info' : 'inherit'}/>
                      }[step]
                    }
                  </ListItemIcon>
                  <ListItemText primary={step} sx={{ opacity: navOpen ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, marginTop: '100px', marginLeft: `calc(100vw - ${navOpen ? drawerWidth : 60}px)` }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}