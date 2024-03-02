import { styled } from '@mui/system';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const StyledAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open, drawerWidth }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function AppBar({ open, drawerWidth }) {
  return (
    <StyledAppBar position="fixed" open={open} >
      <Toolbar >
        <Box component="img" alt="SimLabLogo" src="/SimLabLogo.png" sx={{ width: 80, height: 80, margin: '20px' }} />
        <Typography variant="h1" noWrap component="div" color="light">PICASSO &#8211; HSF Builder</Typography>
      </Toolbar>
    </StyledAppBar>
  );
}
