import { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Collapse, Box, CircularProgress, Alert
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from 'axios';

const EXAMPLE_URLS = [
  {
    originalUrl: 'https://example.com/your/long/link',
    shortcode: 'exmpl123',
    expiry: new Date(Date.now() + 30 * 60000).toISOString(),
  },
];

function StatsPage() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openRows, setOpenRows] = useState({});
  const [stats, setStats] = useState({});
  const [showExample, setShowExample] = useState(false);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const res = await axios.get('http://localhost:5000/shorturls');
        setUrls(res.data);
      } catch (err) {
        setError('No statistics available yet. Try shortening a URL!');
        setShowExample(true);
      } finally {
        setLoading(false);
      }
    };
    fetchUrls();
  }, []);

  const handleRowClick = async (shortcode) => {
    setOpenRows((prev) => ({ ...prev, [shortcode]: !prev[shortcode] }));
    if (!stats[shortcode]) {
      try {
        const res = await axios.get(`http://localhost:5000/shorturls/${shortcode}`);
        setStats((prev) => ({ ...prev, [shortcode]: res.data }));
      } catch {
        setStats((prev) => ({ ...prev, [shortcode]: { error: 'Failed to fetch stats' } }));
      }
    }
  };

  const displayUrls = showExample ? EXAMPLE_URLS : urls;

  return (
    <Card sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, color: 'primary.main', mb: 2 }}>
          URL Statistics
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {error && (
              <Alert severity="info" sx={{ mb: 2 }}>{error}</Alert>
            )}
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'secondary.main' }}>
                    <TableCell />
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Original URL</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Short Link</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>Expiry</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayUrls.map((url) => (
                    <>
                      <TableRow key={url.shortcode} hover>
                        <TableCell>
                          <IconButton size="small" onClick={() => handleRowClick(url.shortcode)}>
                            {openRows[url.shortcode] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                          </IconButton>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <a href={url.originalUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#1976D2', fontWeight: 500 }}>{url.originalUrl}</a>
                        </TableCell>
                        <TableCell>
                          <a href={`http://localhost:5000/${url.shortcode}`} target="_blank" rel="noopener noreferrer" style={{ color: '#1976D2', fontWeight: 700, textDecoration: 'underline' }}>{`http://localhost:5000/${url.shortcode}`}</a>
                        </TableCell>
                        <TableCell>{url.expiry ? new Date(url.expiry).toLocaleString() : '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                          <Collapse in={openRows[url.shortcode]} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 2 }}>
                              {stats[url.shortcode] ? (
                                stats[url.shortcode].error ? (
                                  <Alert severity="error">{stats[url.shortcode].error}</Alert>
                                ) : (
                                  <>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                                      Clicks: {stats[url.shortcode].totalClicks || 0}
                                    </Typography>
                                    {stats[url.shortcode].clickHistory && stats[url.shortcode].clickHistory.length === 0 ? (
                                      <Typography>No clicks yet.</Typography>
                                    ) : (
                                      <Table size="small">
                                        <TableHead>
                                          <TableRow>
                                            <TableCell>Timestamp</TableCell>
                                            <TableCell>IP</TableCell>
                                            <TableCell>Referrer</TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {stats[url.shortcode].clickHistory && stats[url.shortcode].clickHistory.map((click, idx) => (
                                            <TableRow key={idx}>
                                              <TableCell>{new Date(click.timestamp).toLocaleString()}</TableCell>
                                              <TableCell>{click.ip}</TableCell>
                                              <TableCell>{click.referrer || '-'}</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    )}
                                  </>
                                )
                              ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
                                  <CircularProgress size={24} sx={{ mr: 2 }} />
                                  <Typography>Loading stats...</Typography>
                                </Box>
                              )}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default StatsPage; 