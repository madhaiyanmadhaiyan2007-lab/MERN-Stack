import { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Avatar,
    Alert,
    Grid,
} from '@mui/material';
import { Save, Person, CheckCircle } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
        location: user?.location || '',
        avatar: user?.avatar || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const { data } = await authAPI.updateProfile(formData);
            updateUser(data);
            setSuccess('Profile updated successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const inputStyles = {
        '& .MuiOutlinedInput-root': {
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'translateY(-2px)',
            },
            '&.Mui-focused': {
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
                transform: 'translateY(-2px)',
            },
        },
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper
                sx={{
                    p: { xs: 3, md: 5 },
                    borderRadius: 3,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        boxShadow: '0 15px 50px rgba(0,0,0,0.1)',
                    },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        mb: 4,
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
                        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s',
                    }}
                >
                    <Avatar
                        src={formData.avatar}
                        sx={{
                            width: 80,
                            height: 80,
                            fontSize: '2rem',
                            transition: 'all 0.3s ease',
                            border: '4px solid transparent',
                            background: 'linear-gradient(white, white), linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            backgroundOrigin: 'border-box',
                            backgroundClip: 'padding-box, border-box',
                            '&:hover': {
                                transform: 'scale(1.1) rotate(5deg)',
                                boxShadow: '0 0 30px rgba(102, 126, 234, 0.4)',
                            },
                        }}
                    >
                        {formData.name?.charAt(0) || <Person />}
                    </Avatar>
                    <Box>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Edit Profile
                        </Typography>
                        <Typography color="text.secondary">
                            Update your account information
                        </Typography>
                    </Box>
                </Box>

                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            mb: 3,
                            animation: 'shake 0.5s ease-in-out',
                        }}
                    >
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert
                        severity="success"
                        sx={{
                            mb: 3,
                            animation: 'bounceIn 0.5s ease-out',
                        }}
                        icon={<CheckCircle sx={{ animation: 'pulse 1s ease-in-out infinite' }} />}
                    >
                        {success}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid
                            item
                            xs={12}
                            sx={{
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                                transition: 'all 0.5s ease 0.2s',
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                sx={inputStyles}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sx={{
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                                transition: 'all 0.5s ease 0.3s',
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="City, Country"
                                sx={inputStyles}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sx={{
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                                transition: 'all 0.5s ease 0.4s',
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Avatar URL"
                                name="avatar"
                                value={formData.avatar}
                                onChange={handleChange}
                                placeholder="https://example.com/avatar.jpg"
                                sx={inputStyles}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sx={{
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                                transition: 'all 0.5s ease 0.5s',
                            }}
                        >
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Tell other traders about yourself..."
                                sx={inputStyles}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sx={{
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                                transition: 'all 0.5s ease 0.6s',
                            }}
                        >
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                startIcon={<Save />}
                                disabled={loading}
                                sx={{
                                    py: 1.5,
                                    px: 4,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: '-100%',
                                        width: '100%',
                                        height: '100%',
                                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                        transition: 'left 0.5s',
                                    },
                                    '&:hover': {
                                        transform: 'translateY(-3px)',
                                        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                                        '&::before': {
                                            left: '100%',
                                        },
                                    },
                                    '&:active': {
                                        transform: 'translateY(-1px)',
                                    },
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default Profile;
