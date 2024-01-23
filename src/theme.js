import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#dddddd',
      light: '#ffffff',
      dark: '#blblbl',
    },
    secondary: {
      main: '#1f2330',
      light: '#292d3a',
      dark: '1a1d25',
    },
  },
  shape: {
    borderRadius: 5,
    square: false,
  },
  typography: {
    fontFamily: 'Poppins',
    h1: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 400,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
    },
    button: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          square: false,
          backgroundColor: '#282D3D',
          color: '#dddddd',
          borderRadius: '5px',
        },
      },
    },
    MuiBox: {
      styleOverrides: {
        root: {
          square: false,
          borderRadius: '5px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          square: false,
          borderRadius: '5px',
        },
      },
    },
  }
});

export default theme;