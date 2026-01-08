import { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Pagination,
    Skeleton,
    Paper,
    Button,
    useTheme,
    alpha,
} from '@mui/material';
import { AutoStories, TrendingUp, People, ArrowForward } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BookCard from '../components/books/BookCard';
import { booksAPI } from '../services/api';

const genres = [
    'All', 'Fiction', 'Non-Fiction', 'Mystery', 'Thriller', 'Romance',
    'Science Fiction', 'Fantasy', 'Horror', 'Biography', 'History',
    'Self-Help', 'Children', 'Young Adult', 'Comics', 'Poetry', 'Other'
];

const conditions = ['All', 'New', 'Like New', 'Very Good', 'Good', 'Acceptable', 'Poor'];

const Home = () => {
    const theme = useTheme();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [genre, setGenre] = useState('All');
    const [condition, setCondition] = useState('All');

    useEffect(() => {
        fetchBooks();
    }, [page, genre, condition]);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const params = { page, limit: 12 };
            if (genre !== 'All') params.genre = genre;
            if (condition !== 'All') params.condition = condition;

            const { data } = await booksAPI.getAll(params);
            setBooks(data.books);
            setTotalPages(data.pages);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { icon: <AutoStories fontSize="large" />, value: '10k+', label: 'Books Listed' },
        { icon: <TrendingUp fontSize="large" />, value: '5k+', label: 'Trades Done' },
        { icon: <People fontSize="large" />, value: '2.5k+', label: 'Community' },
    ];

    return (
        <Box sx={{ overflow: 'hidden' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    position: 'relative',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.9)} 0%, ${alpha(theme.palette.secondary.dark, 0.95)} 100%)`,
                    color: 'white',
                    pt: { xs: 12, md: 20 },
                    pb: { xs: 10, md: 15 },
                    clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
                    overflow: 'hidden',
                }}
            >
                {/* Abstract Background Elements */}
                <Box
                    component={motion.div}
                    animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    sx={{
                        position: 'absolute',
                        top: '-20%',
                        right: '-10%',
                        width: '600px',
                        height: '600px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0) 70%)',
                        filter: 'blur(50px)',
                        zIndex: 0,
                    }}
                />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={7}>
                            <Box
                                component={motion.div}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontSize: { xs: '3rem', md: '4.5rem' },
                                        fontWeight: 800,
                                        mb: 3,
                                        lineHeight: 1.1,
                                        background: 'linear-gradient(to right, #fff, #e0e7ff)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    Trade Books,<br /> Share Stories.
                                </Typography>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        mb: 5,
                                        color: alpha('#fff', 0.8),
                                        maxWidth: '600px',
                                        fontWeight: 400,
                                        lineHeight: 1.6,
                                    }}
                                >
                                    Join thousands of book lovers in the most vibrant trading community.
                                    Discover your next favorite read without spending a dime.
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    <Button
                                        component={RouterLink}
                                        to="/register"
                                        variant="contained"
                                        size="large"
                                        endIcon={<ArrowForward />}
                                        sx={{
                                            bgcolor: 'white',
                                            color: 'primary.main',
                                            px: 4,
                                            py: 1.5,
                                            fontSize: '1.1rem',
                                            '&:hover': {
                                                bgcolor: '#f8fafc',
                                                transform: 'translateY(-2px)',
                                            },
                                        }}
                                    >
                                        Start Trading
                                    </Button>
                                    <Button
                                        component={RouterLink}
                                        to="/search"
                                        variant="outlined"
                                        size="large"
                                        sx={{
                                            borderColor: alpha('#fff', 0.5),
                                            color: 'white',
                                            px: 4,
                                            py: 1.5,
                                            fontSize: '1.1rem',
                                            '&:hover': {
                                                borderColor: 'white',
                                                bgcolor: alpha('#fff', 0.1),
                                            },
                                        }}
                                    >
                                        Browse Library
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={5}>
                            <Box
                                component={motion.div}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 3,
                                    pt: { xs: 4, md: 0 }
                                }}
                            >
                                {stats.map((stat, index) => (
                                    <Paper
                                        key={index}
                                        component={motion.div}
                                        whileHover={{ scale: 1.02, x: 10 }}
                                        sx={{
                                            p: 3,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 3,
                                            background: alpha('#fff', 0.1),
                                            backdropFilter: 'blur(10px)',
                                            border: `1px solid ${alpha('#fff', 0.2)}`,
                                            borderRadius: 4,
                                            color: 'white',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                p: 1.5,
                                                borderRadius: '50%',
                                                bgcolor: alpha('#fff', 0.15),
                                                display: 'flex',
                                            }}
                                        >
                                            {stat.icon}
                                        </Box>
                                        <Box>
                                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                                {stat.value}
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: alpha('#fff', 0.7) }}>
                                                {stat.label}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                ))}
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ my: 8 }}>
                {/* Filters */}
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    sx={{
                        mb: 6,
                        p: 3,
                        borderRadius: 4,
                        bgcolor: 'background.paper',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 3,
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        Fresh Arrivals
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Genre</InputLabel>
                            <Select
                                value={genre}
                                label="Genre"
                                onChange={(e) => setGenre(e.target.value)}
                                sx={{ borderRadius: 2 }}
                            >
                                {genres.map((g) => (
                                    <MenuItem key={g} value={g}>{g}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Condition</InputLabel>
                            <Select
                                value={condition}
                                label="Condition"
                                onChange={(e) => setCondition(e.target.value)}
                                sx={{ borderRadius: 2 }}
                            >
                                {conditions.map((c) => (
                                    <MenuItem key={c} value={c}>{c}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                {/* Grid */}
                <Grid container spacing={4}>
                    <AnimatePresence mode='wait'>
                        {loading ? (
                            [...Array(8)].map((_, i) => (
                                <Grid item key={i} xs={12} sm={6} md={4} lg={3}>
                                    <Skeleton
                                        variant="rectangular"
                                        height={380}
                                        sx={{ borderRadius: 4 }}
                                    />
                                </Grid>
                            ))
                        ) : books.length > 0 ? (
                            books.map((book, index) => (
                                <Grid
                                    item
                                    key={book._id}
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    lg={3}
                                    component={motion.div}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                >
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
                                        bgcolor: 'background.paper',
                                        border: '1px dashed #cbd5e1'
                                    }}
                                >
                                    <Typography variant="h5" color="text.secondary" gutterBottom>
                                        No books found matching your criteria.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        component={RouterLink}
                                        to="/add-book"
                                        sx={{ mt: 2 }}
                                    >
                                        List a Book
                                    </Button>
                                </Paper>
                            </Grid>
                        )}
                    </AnimatePresence>
                </Grid>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(e, value) => setPage(value)}
                            color="primary"
                            size="large"
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                }
                            }}
                        />
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default Home;
