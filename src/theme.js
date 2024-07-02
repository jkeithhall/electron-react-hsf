import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0288d1',
      light: '#349fda',
      dark: '#015f92',
      constrastText: '#eeeeee',
    },
    secondary: {
      main: '#282D3D',
      light: '#4f566f',
      dark: '#1e2330',
      constrastText: '#dddddd',
    },
    light: {
      main: '#eeeeee',
      light: '#ffffff',
      dark: '#dddddd',
      constrastText: '#222222',
    },
    dark: {
      main: '#222222',
      light: '#333333',
      dark: '#000000',
      constrastText: '#dddddd',
    },
    background: {
      default: '#dddddd',
      primary: '#282D3D',
    }
  },
  typography: {
    // fontFamily: 'Poppins, sans-serif',
    // fontFamily: 'Lato, sans-serif',
    fontFamily: 'Roboto, sans-serif',
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
    body: {
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
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1120,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    // MuiPaper: {
    //   styleOverrides: {
    //     root: {
    //       backgroundColor: '#eeeeee',
    //       padding: 1,
    //       elevation: 3,
    //     },
    //   },
    // },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        root: {
          color: '#0288d1',
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#0288d1',
            color: 'white',
          },
        },
      },
    },
    MuiCalendarDatePicker: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#282D3D',
          color: '#dddddd',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#282D3D',
          color: '#dddddd',
        },
      },
    },
  }
});

export default theme;