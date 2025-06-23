import { useState } from 'react';
import {
  Card, CardContent, Typography, TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Alert, IconButton, Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios';

const MAX_URLS = 5;

function ShortenerPage() {
  const [inputs, setInputs] = useState([
    { url: '', validity: '', shortcode: '' }
  ]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (idx, field, value) => {
    const newInputs = [...inputs];
    newInputs[idx][field] = value;
    setInputs(newInputs);
  };

  const addInput = () => {
    if (inputs.length < MAX_URLS) {
      setInputs([...inputs, { url: '', validity: '', shortcode: '' }]);
    }
  };

  const removeInput = (idx) => {
    if (inputs.length > 1) {
      setInputs(inputs.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setResults([]);
    try {
      const payload = {
        urls: inputs.map(i => ({
          url: i.url.trim(),
          validity: i.validity
            ? new Date(Date.now() + parseInt(i.validity, 10) * 60000).toISOString()
            : undefined,
          shortcode: i.shortcode || undefined,
        }))
      };
      const res = await axios.post('http://localhost:5000/shorturls', payload);
      setResults(res.data.results);
      setSuccess('Shortened successfully!');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '60vh',
      bgcolor: 'background.default',
      py: { xs: 2, md: 6 },
      px: { xs: 0, md: 2 },
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
    }}>
      <Card sx={{ maxWidth: 600, width: '100%', mx: 'auto', boxShadow: 2, borderRadius: 2, border: '1px solid #F5F5F5', bgcolor: 'background.paper' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, color: 'primary.main', textAlign: 'center', mb: 2, letterSpacing: 1 }}>
            Shorten Your URLs
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: 'text.primary', fontWeight: 500 }}>
            🧾 Enter the following to shorten your URL:
          </Typography>
          <form onSubmit={handleSubmit} autoComplete="off">
            <Grid container spacing={2}>
              {inputs.map((input, idx) => (
                <Grid item xs={12} key={idx}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                      <TextField
                        label="Original URL"
                        placeholder="https://example.com/your/long/link"
                        value={input.url}
                        onChange={e => handleInputChange(idx, 'url', e.target.value)}
                        required
                        fullWidth
                        size="medium"
                        helperText={
                          <span style={{ color: '#888' }}>
                            ➤ Example: <span style={{ color: '#1976D2' }}>https://example.com/your/long/link</span>
                          </span>
                        }
                        sx={{
                          bgcolor: 'secondary.main',
                          borderRadius: 2,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Validity in minutes (optional)"
                        placeholder="30"
                        value={input.validity}
                        onChange={e => handleInputChange(idx, 'validity', e.target.value.replace(/[^0-9]/g, ''))}
                        fullWidth
                        size="medium"
                        helperText={
                          <span style={{ color: '#888' }}>
                            ➤ Example: <span style={{ color: '#1976D2' }}>30</span> (Leave empty for default 30 minutes)
                          </span>
                        }
                        sx={{
                          bgcolor: 'secondary.main',
                          borderRadius: 2,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Custom shortcode (optional)"
                        placeholder="myCode123"
                        value={input.shortcode}
                        onChange={e => handleInputChange(idx, 'shortcode', e.target.value)}
                        fullWidth
                        size="medium"
                        helperText={
                          <span style={{ color: '#888' }}>
                            ➤ Example: <span style={{ color: '#1976D2' }}>myCode123</span> (Alphanumeric only)
                          </span>
                        }
                        sx={{
                          bgcolor: 'secondary.main',
                          borderRadius: 2,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: 'right' }}>
                      <IconButton onClick={() => removeInput(idx)} disabled={inputs.length === 1} color="error" sx={{
                        '&:hover': {
                          bgcolor: 'error.main',
                          color: 'white',
                        },
                        borderRadius: 2,
                        transition: 'all 0.2s',
                      }}>
                        <RemoveIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addInput}
                  disabled={inputs.length >= MAX_URLS}
                  sx={{
                    mb: 2,
                    fontWeight: 700,
                    borderRadius: 2,
                    bgcolor: 'background.default',
                    color: 'primary.main',
                    borderColor: 'primary.main',
                    px: 3,
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      borderColor: 'primary.main',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  Add URL
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{
                  fontWeight: 800,
                  borderRadius: 2,
                  px: 5,
                  py: 1.5,
                  fontSize: '1.1rem',
                  boxShadow: 'none',
                  letterSpacing: 1.2,
                  '&:hover': {
                    bgcolor: 'success.main',
                    color: 'white',
                  },
                  transition: 'all 0.2s',
                }}>
                  {loading ? 'Shortening...' : 'Shorten URLs'}
                </Button>
              </Grid>
            </Grid>
          </form>
          {results.length > 0 && (
            <TableContainer component={Paper} sx={{ mt: 4, borderRadius: 2, boxShadow: 1 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'secondary.main' }}>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Short Link</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Expiry</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((res, idx) => (
                    <TableRow key={idx} hover sx={{ transition: 'all 0.2s', '&:hover': { bgcolor: '#e3e3e3' } }}>
                      <TableCell>
                        {res.shortLink ? (
                          <a href={res.shortLink} target="_blank" rel="noopener noreferrer" style={{ color: '#1976D2', fontWeight: 700, textDecoration: 'underline', fontSize: '1.1rem' }}>{res.shortLink}</a>
                        ) : '-'}
                      </TableCell>
                      <TableCell>{res.expiry ? new Date(res.expiry).toLocaleString() : '-'}</TableCell>
                      <TableCell>{res.error ? <Alert severity="error">{res.error}</Alert> : <Alert severity="success">OK</Alert>}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
            <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          </Snackbar>
          <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess('')}>
            <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
              {success}
            </Alert>
          </Snackbar>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ShortenerPage; 