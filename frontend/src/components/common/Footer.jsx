import { Box, Container, Typography, Link, Grid, IconButton, Divider } from '@mui/material';
import { GitHub, Twitter, LinkedIn } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 6,
                px: 2,
                mt: 'auto',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                color: 'white',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                            📚 BookTrade
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                            Trade your books with fellow readers. Give your books a new home and discover new stories.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton sx={{ color: 'white' }}>
                                <GitHub />
                            </IconButton>
                            <IconButton sx={{ color: 'white' }}>
                                <Twitter />
                            </IconButton>
                            <IconButton sx={{ color: 'white' }}>
                                <LinkedIn />
                            </IconButton>
                        </Box>
                    </Grid>

                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            Quick Links
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link component={RouterLink} to="/" color="inherit" underline="hover" sx={{ opacity: 0.7 }}>
                                Browse Books
                            </Link>
                            <Link component={RouterLink} to="/search" color="inherit" underline="hover" sx={{ opacity: 0.7 }}>
                                Search
                            </Link>
                            <Link component={RouterLink} to="/register" color="inherit" underline="hover" sx={{ opacity: 0.7 }}>
                                Join Us
                            </Link>
                        </Box>
                    </Grid>

                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            Categories
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link component={RouterLink} to="/?genre=Fiction" color="inherit" underline="hover" sx={{ opacity: 0.7 }}>
                                Fiction
                            </Link>
                            <Link component={RouterLink} to="/?genre=Non-Fiction" color="inherit" underline="hover" sx={{ opacity: 0.7 }}>
                                Non-Fiction
                            </Link>
                            <Link component={RouterLink} to="/?genre=Science Fiction" color="inherit" underline="hover" sx={{ opacity: 0.7 }}>
                                Sci-Fi
                            </Link>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            About BookTrade
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            BookTrade is a community-driven platform where book lovers can exchange their favorite reads.
                            Whether you're looking for rare finds or popular titles, connect with fellow readers and grow your collection.
                        </Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

                <Typography variant="body2" align="center" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    © {new Date().getFullYear()} BookTrade. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;
