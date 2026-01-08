import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Link,
    Alert,
    InputAdornment,
    IconButton,
    Grid,
    useTheme,
    useMediaQuery,
    alpha
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Person, AutoStories } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }

        try {
            await register(formData.name, formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            setShake(true);
            setTimeout(() => setShake(false), 500);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                position: 'relative',
                overflow: 'hidden',
                p: { xs: 2, md: 4 }
            }}
        >
            {/* Animated Background Elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -100,
                    right: -100,
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
                    animation: 'float 10s ease-in-out infinite',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: -50,
                    left: -50,
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)',
                    animation: 'float 8s ease-in-out infinite reverse',
                }}
            />

            <Grid container sx={{ maxWidth: 1000, minHeight: { md: 600 } }} component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                {/* Branding Side */}
                {!isMobile && (
                    <Grid item md={6} sx={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        p: 6,
                        color: 'white',
                        borderTopLeftRadius: 24,
                        borderBottomLeftRadius: 24,
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                    }}>
                        <Box sx={{ position: 'relative', zIndex: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                                <AutoStories sx={{ fontSize: 40 }} />
                                <Typography variant="h4" sx={{ fontWeight: 800 }}>BookTrade</Typography>
                            </Box>

                            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, lineHeight: 1.2 }}>
                                Start Your Journey.
                            </Typography>

                            <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 400 }}>
                                Create an account to access thousands of trading opportunities. It's free and easy to get started.
                            </Typography>
                        </Box>

                        {/* Decorative Circles */}
                        <Box sx={{ position: 'absolute', top: '20%', right: '-20%', width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', zIndex: 1 }} />
                    </Grid>
                )}

                {/* Register Form Side */}
                <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                    <Paper
                        elevation={0}
                        sx={{
                            width: '100%',
                            p: { xs: 4, md: 6 },
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            borderRadius: { xs: 4, md: '0 24px 24px 0' },
                            bgcolor: isMobile ? alpha('#fff', 0.9) : '#fff',
                            backdropFilter: 'blur(20px)',
                        }}
                    >
                        <Box sx={{ mb: 4, textAlign: 'center' }}>
                            {isMobile && (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2, color: 'primary.main' }}>
                                    <AutoStories />
                                    <Typography variant="h6" fontWeight={700}>BookTrade</Typography>
                                </Box>
                            )}
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>Create Account</Typography>
                            <Typography variant="body1" color="text.secondary">Join our community today</Typography>
                        </Box>

                        {error && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                sx={{ mb: 2 }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Person color="action" /></InputAdornment>,
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                sx={{ mb: 2 }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment>,
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                required
                                sx={{ mb: 2 }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Confirm Password"
                                name="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                sx={{ mb: 3 }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                                }}
                            />

                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    disabled={loading}
                                    sx={{
                                        py: 1.5,
                                        mb: 3,
                                        borderRadius: 2,
                                        fontSize: '1rem',
                                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                                        boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)',
                                    }}
                                >
                                    {loading ? 'Creating Account...' : 'Sign Up'}
                                </Button>
                            </motion.div>
                        </form>

                        <Typography align="center" color="text.secondary">
                            Already have an account?{' '}
                            <Link component={RouterLink} to="/login" sx={{ fontWeight: 600, color: 'primary.main', textDecoration: 'none' }}>
                                Sign in instead
                            </Link>
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Register;
