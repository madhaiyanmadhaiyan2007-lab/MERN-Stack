import { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Paper,
    Box,
    Avatar,
    Skeleton,
    Chip,
    useTheme,
    alpha
} from '@mui/material';
import { MenuBook, SwapHoriz, CheckCircle, Pending, TrendingUp, ArrowForward } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { booksAPI, tradesAPI } from '../services/api';
import BookCard from '../components/books/BookCard';

const Dashboard = () => {
    const { user } = useAuth();
    const theme = useTheme();
    const [books, setBooks] = useState([]);
    const [tradeStats, setTradeStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [booksRes, statsRes] = await Promise.all([
                booksAPI.getMyBooks(),
                tradesAPI.getStats()
            ]);
            setBooks(booksRes.data);
            setTradeStats(statsRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { icon: <MenuBook fontSize="large" />, value: books.length, label: 'My Books', color: theme.palette.primary.main, bg: alpha(theme.palette.primary.main, 0.1) },
        { icon: <Pending fontSize="large" />, value: tradeStats?.pending || 0, label: 'Pending Trades', color: theme.palette.warning.main, bg: alpha(theme.palette.warning.main, 0.1) },
        { icon: <SwapHoriz fontSize="large" />, value: tradeStats?.accepted || 0, label: 'Active Trades', color: theme.palette.info.main, bg: alpha(theme.palette.info.main, 0.1) },
        { icon: <CheckCircle fontSize="large" />, value: tradeStats?.completed || 0, label: 'Completed', color: theme.palette.success.main, bg: alpha(theme.palette.success.main, 0.1) },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Welcome Section */}
                <Box component={motion.div} variants={itemVariants} sx={{ mb: 6 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 3, md: 5 },
                            borderRadius: 4,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)',
                        }}
                    >
                        {/* Decorative Background Shapes */}
                        <Box sx={{
                            position: 'absolute',
                            top: -100,
                            right: -100,
                            width: 400,
                            height: 400,
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.1)',
                            filter: 'blur(50px)',
                        }} />
                        <Box sx={{
                            position: 'absolute',
                            bottom: -50,
                            left: -50,
                            width: 300,
                            height: 300,
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.1)',
                            filter: 'blur(30px)',
                        }} />

                        <Grid container alignItems="center" spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
                            <Grid item>
                                <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
                                    <Avatar
                                        src={user?.avatar}
                                        sx={{
                                            width: { xs: 80, md: 100 },
                                            height: { xs: 80, md: 100 },
                                            border: '4px solid rgba(255,255,255,0.3)',
                                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                            fontSize: '2.5rem'
                                        }}
                                    >
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </Avatar>
                                </motion.div>
                            </Grid>
                            <Grid item xs>
                                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                    Welcome back, {user?.name?.split(' ')[0]}!
                                </Typography>
                                <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400, mb: 2, maxWidth: 600 }}>
                                    {user?.bio || "Ready to discover your next favorite book? manage your collection and trades here."}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    {user?.location && (
                                        <Chip
                                            icon={<TrendingUp sx={{ color: 'white !important' }} />}
                                            label={user.location}
                                            sx={{
                                                bgcolor: 'rgba(255,255,255,0.2)',
                                                color: 'white',
                                                backdropFilter: 'blur(10px)',
                                                fontWeight: 600,
                                                border: '1px solid rgba(255,255,255,0.3)'
                                            }}
                                        />
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>

                {/* Stats Grid */}
                <Grid container spacing={3} component={motion.div} variants={containerVariants} sx={{ mb: 6 }}>
                    {statCards.map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index} component={motion.div} variants={itemVariants}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 4,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    background: 'rgba(255,255,255,0.7)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255,255,255,0.5)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                                        borderColor: stat.color,
                                    }
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            bgcolor: stat.bg,
                                            color: stat.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {stat.icon}
                                    </Box>
                                    <Chip
                                        label="+2% this week"
                                        size="small"
                                        sx={{
                                            bgcolor: alpha(theme.palette.success.main, 0.1),
                                            color: theme.palette.success.main,
                                            fontWeight: 600,
                                            fontSize: '0.7rem',
                                            height: 20
                                        }}
                                    />
                                </Box>
                                <Box>
                                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
                                        {loading ? <Skeleton width={60} /> : stat.value}
                                    </Typography>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                                        {stat.label}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Recent Books Section */}
                <Box component={motion.div} variants={itemVariants}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            Recent Uploads
                        </Typography>
                        <Box
                            component={RouterLink}
                            to="/my-books"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                color: 'primary.main',
                                textDecoration: 'none',
                                fontWeight: 600,
                                transition: 'all 0.2s',
                                '&:hover': { gap: 1.5 }
                            }}
                        >
                            View All <ArrowForward fontSize="small" />
                        </Box>
                    </Box>

                    <Grid container spacing={3}>
                        {loading ? (
                            [...Array(4)].map((_, i) => (
                                <Grid item key={i} xs={12} sm={6} md={3}>
                                    <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 4 }} />
                                </Grid>
                            ))
                        ) : books.length > 0 ? (
                            books.slice(0, 4).map((book) => (
                                <Grid item key={book._id} xs={12} sm={6} md={3}>
                                    <BookCard book={book} />
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Paper
                                    sx={{
                                        p: 8,
                                        textAlign: 'center',
                                        borderRadius: 4,
                                        border: '2px dashed rgba(0,0,0,0.1)',
                                        bgcolor: 'transparent'
                                    }}
                                >
                                    <MenuBook sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        No books listed yet
                                    </Typography>
                                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                                        Start building your library by adding books you want to trade.
                                    </Typography>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Box
                                            component={RouterLink}
                                            to="/add-book"
                                            sx={{
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                px: 4,
                                                py: 1.5,
                                                borderRadius: 2,
                                                textDecoration: 'none',
                                                fontWeight: 600,
                                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                                            }}
                                        >
                                            Add Your First Book
                                        </Box>
                                    </motion.div>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </motion.div>
        </Container>
    );
};

export default Dashboard;
