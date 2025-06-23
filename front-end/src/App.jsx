import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import ShortenerPage from './ShortenerPage';
import StatsPage from './StatsPage';

function NavBar() {
  const location = useLocation();
  return (
    <AppBar position="static" color="primary" elevation={1} sx={{ boxShadow: 'none', bgcolor: 'primary.main' }}>
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', letterSpacing: 1 }}>
          URL Shortener
        </Typography>
        <Box>
          <Button
            component={Link}
            to="/"
            disableElevation
            sx={{
              color: location.pathname === '/' ? 'primary.main' : 'white',
              bgcolor: location.pathname === '/' ? 'secondary.main' : 'transparent',
              fontWeight: 700,
              mx: 1,
              px: 2,
              borderRadius: 2,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#e3e3e3',
                color: 'primary.main',
                boxShadow: 'none',
              },
              transition: 'all 0.15s',
            }}
          >
            Shorten URLs
          </Button>
          <Button
            component={Link}
            to="/stats"
            disableElevation
            sx={{
              color: location.pathname === '/stats' ? 'primary.main' : 'white',
              bgcolor: location.pathname === '/stats' ? 'secondary.main' : 'transparent',
              fontWeight: 700,
              mx: 1,
              px: 2,
              borderRadius: 2,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#e3e3e3',
                color: 'primary.main',
                boxShadow: 'none',
              },
              transition: 'all 0.15s',
            }}
          >
            Statistics
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function App() {
  return (
    <Router>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ minHeight: '80vh' }}>
          <Routes>
            <Route path="/" element={<ShortenerPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}

export default App;
