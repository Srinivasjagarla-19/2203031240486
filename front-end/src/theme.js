import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976D2',
      contrastText: '#fff',
    },
    secondary: {
      main: '#F5F5F5',
      contrastText: '#212121',
    },
    success: {
      main: '#43A047',
      contrastText: '#fff',
    },
    background: {
      default: '#FFFFFF', 
      paper: '#F5F5F5',
    },
    text: {
      primary: '#212121',
      secondary: '#1976D2',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: 'Montserrat, Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 800,
      letterSpacing: 1.5,
      color: '#1976D2',
    },
    h5: {
      fontWeight: 700,
      letterSpacing: 1.2,
      color: '#1976D2',
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      letterSpacing: 1,
    },
    body1: {
      color: '#212121',
    },
  },
});

export default theme; 