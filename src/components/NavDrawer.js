import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import AppBar from './AppBar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import LayersIcon from '@mui/icons-material/Layers';
import RuleIcon from '@mui/icons-material/Rule';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import SaveIcon from '@mui/icons-material/Save';

const drawerWidth = 220;
const headerHeight = 100;
const navCategories = ['Scenario', 'Tasks', 'System Model', 'Dependencies', 'Constraints', 'Simulate', 'Analyze'];

const openedMixin = (theme) => ({
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
  height: headerHeight,
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);



export default function NavDrawer({ navOpen, toggleNav, activeStep, setActiveStep, childComponents, hasUnsavedChanges, handleSaveFile, setStateMethods, children }) {
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
          color="primary"
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
                        'Scenario': <SatelliteAltIcon color={activeStep === step ? 'primary' : 'inherit'}/>,
                        'Tasks': <GpsFixedIcon color={activeStep === step ? 'primary' : 'inherit'}/>,
                        'System Model': <AccountTreeIcon color={activeStep === step ? 'primary' : 'inherit'}/>,
                        'Dependencies': <LayersIcon color={activeStep === step ? 'primary' : 'inherit'}/>,
                        'Constraints': <RuleIcon color={activeStep === step ? 'primary' : 'inherit'}/>,
                        'Simulate': <PlayCircleIcon color={activeStep === step ? 'primary' : 'inherit'}/>,
                        'Analyze': <AnalyticsOutlinedIcon color={activeStep === step ? 'primary' : 'inherit'}/>
                      }[step]
                    }
                  </ListItemIcon>
                  <ListItemText primary={step} sx={{ opacity: navOpen ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            )
          })}
              <Divider />
              {window.electronApi &&
                <ListItem key={'save'} disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    disabled={!hasUnsavedChanges}
                    sx={{
                      minHeight: 50,
                      px: 2.5,
                    }}
                    onClick={() => handleSaveFile(() => {})}
                  >
                    <ListItemIcon
                      sx={{
                        color: 'inherit',
                        minWidth: 0,
                        mr: navOpen ? 2 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <SaveIcon color={hasUnsavedChanges ? 'inherit' : 'light'}/>
                    </ListItemIcon>
                    <ListItemText primary={'Save'} sx={{ opacity: navOpen ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
              }
        </List>
      </Drawer>
      <div component="main" >
        <DrawerHeader />
        {children}
      </div>
    </Box>
  );
}