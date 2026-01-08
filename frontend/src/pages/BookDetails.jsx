import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';

// Material UI Components
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Chip,
    Avatar,
    Button,
    Skeleton,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Alert,
    IconButton,
    alpha,
    Snackbar,
} from '@mui/material';

// Icons
import {
    LocationOn,
    Visibility,
    SwapHoriz,
    CalendarToday,
    Edit,
    Delete,
    ArrowBack,
    Share,
    Flag
} from '@mui/icons-material';

// Third Party
import { motion, AnimatePresence } from 'framer-motion';

// Local Context & Services
import { useAuth } from '../context/AuthContext';
import { booksAPI, tradesAPI } from '../services/api';
import ConfirmDialog from '../components/common/ConfirmDialog';

const conditionColors = {
    'New': 'success',
    'Like New': 'success',
    'Very Good': 'info',
    'Good': 'warning',
    'Acceptable': 'warning',
    'Poor': 'error',
};

const BookDetails = () => {
    // Hooks
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    // State
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tradeDialog, setTradeDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [myBooks, setMyBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState('');
    const [message, setMessage] = useState('');
    const [tradeLoading, setTradeLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Effects
    useEffect(() => {
        let mounted = true;
        const fetchBook = async () => {
            try {
                const { data } = await booksAPI.getById(id);
                if (mounted) setBook(data);
            } catch (error) {
                console.error('Error fetching book:', error);
                if (mounted) showSnackbar('Failed to load book details', 'error');
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchBook();
        return () => { mounted = false; };
    }, [id]);

    // Handlers
    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleOpenTrade = async () => {
        try {
            const { data } = await booksAPI.getMyBooks();
            setMyBooks(data.filter(b => b.isAvailable));
            setTradeDialog(true);
        } catch (error) {
            console.error('Error fetching my books:', error);
            showSnackbar('Failed to load your library', 'error');
        }
    };

    const handleTrade = async () => {
        if (!selectedBook) {
            showSnackbar('Please select a book to offer', 'warning');
            return;
        }

        setTradeLoading(true);

        try {
            await tradesAPI.create({
                bookOffered: selectedBook,
                bookRequested: book._id,
                message
            });
            setTradeDialog(false);
            showSnackbar('Trade request sent successfully!', 'success');
            setTimeout(() => navigate('/trades'), 1500);
        } catch (err) {
            showSnackbar(err.response?.data?.message || 'Failed to send trade request', 'error');
        } finally {
            setTradeLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await booksAPI.delete(id);
            navigate('/my-books');
        } catch (error) {
            console.error('Error deleting book:', error);
            showSnackbar('Failed to delete book', 'error');
        }
    };

    // Derived Logic
    const isOwner = user && book?.owner?._id === user._id;

    // Render Loading
    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Grid container spacing={6}>
                    <Grid item xs={12} md={5}>
                        <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 4 }} />
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Skeleton variant="text" height={60} width="80%" />
                        <Skeleton variant="text" height={30} width="40%" />
                        <Box sx={{ my: 4 }}>
                            <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        );
    }

    // Render Error / Not Found
    if (!book) {
        return (
            <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Typography variant="h4" gutterBottom>Book not found</Typography>
                    <Button variant="contained" component={RouterLink} to="/search" sx={{ mt: 2 }}>
                        Browse Library
                    </Button>
                </motion.div>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(-1)}
                    sx={{ mb: 4, color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'transparent' } }}
                    aria-label="Back to previous page"
                >
                    Back to browse
                </Button>
            </motion.div>

            <Grid container spacing={6}>
                {/* Book Image Section */}
                <Grid item xs={12} md={5}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 4,
                                overflow: 'hidden',
                                position: 'relative',
                                background: 'transparent',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                            }}
                        >
                            <Box sx={{ paddingTop: '140%', position: 'relative', bgcolor: 'grey.100' }}>
                                <motion.img
                                    src={book.coverImage || 'https://via.placeholder.com/400x600?text=No+Cover'}
                                    alt={book.title}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.4 }}
                                />
                            </Box>
                        </Paper>
                    </motion.div>
                </Grid>

                {/* Book Details Section */}
                <Grid item xs={12} md={7}>
                    <Box component={motion.div} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                <Chip
                                    label={book.genre}
                                    color="primary"
                                    variant="soft"
                                    sx={{
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        bgcolor: alpha('#6366F1', 0.1),
                                        color: '#6366F1'
                                    }}
                                />
                                <Chip
                                    label={book.condition}
                                    color={conditionColors[book.condition]}
                                    sx={{ borderRadius: 2, fontWeight: 600 }}
                                />
                                {!book.isAvailable && (
                                    <Chip label="Not Available" color="error" variant="outlined" sx={{ borderRadius: 2 }} />
                                )}
                            </Box>
                            <Box>
                                <IconButton size="small" aria-label="Share book">
                                    <Share fontSize="small" />
                                </IconButton>
                                <IconButton size="small" aria-label="Report book">
                                    <Flag fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>

                        <Typography variant="h2" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
                            {book.title}
                        </Typography>

                        <Typography variant="h5" color="text.secondary" sx={{ mb: 4, fontWeight: 500 }}>
                            by {book.author}
                        </Typography>

                        <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: 3, bgcolor: alpha('#fff', 0.6), backdropFilter: 'blur(10px)' }}>
                            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                                {book.description || "No description provided for this book."}
                            </Typography>
                            {book.isbn && (
                                <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${alpha('#000', 0.05)}` }}>
                                    <Typography variant="caption" color="text.secondary">ISBN: {book.isbn}</Typography>
                                </Box>
                            )}
                        </Paper>

                        {/* Looking For */}
                        {book.lookingFor?.length > 0 && (
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.primary', fontWeight: 700 }}>
                                    INTERESTED IN EXCHANGING FOR
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {book.lookingFor.map((item, i) => (
                                        <Chip key={i} label={item} variant="outlined" sx={{ borderRadius: 2 }} />
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {/* Action Buttons */}
                        <Box sx={{ mb: 6, display: 'flex', gap: 2 }}>
                            {isOwner ? (
                                <>
                                    <Button
                                        variant="contained"
                                        startIcon={<Edit />}
                                        component={RouterLink}
                                        to={`/edit-book/${book._id}`}
                                        size="large"
                                        sx={{ px: 4, borderRadius: 3 }}
                                    >
                                        Edit Book
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<Delete />}
                                        onClick={() => setDeleteDialog(true)}
                                        size="large"
                                        sx={{ px: 4, borderRadius: 3 }}
                                    >
                                        Delete
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<SwapHoriz />}
                                    onClick={isAuthenticated ? handleOpenTrade : () => navigate('/login')}
                                    disabled={!book.isAvailable}
                                    fullWidth
                                    sx={{
                                        py: 2,
                                        borderRadius: 3,
                                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                                        fontSize: '1.1rem',
                                        boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)',
                                        '&:hover': {
                                            boxShadow: '0 15px 30px rgba(99, 102, 241, 0.4)',
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                >
                                    {isAuthenticated ? 'Propose Exchange' : 'Login to Trade'}
                                </Button>
                            )}
                        </Box>

                        <Divider sx={{ mb: 4 }} />

                        {/* Owner Profile */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar src={book.owner?.avatar} sx={{ width: 60, height: 60, border: `2px solid ${alpha('#000', 0.1)}` }}>
                                    {book.owner?.name?.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                        {book.owner?.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                                        <LocationOn sx={{ fontSize: 16 }} />
                                        <Typography variant="body2">{book.owner?.location || 'Unknown Location'}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={{ textAlign: 'right', color: 'text.secondary' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end', mb: 0.5 }}>
                                    <Visibility fontSize="small" />
                                    <Typography variant="body2">{book.views} views</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                                    <CalendarToday fontSize="small" />
                                    <Typography variant="body2">Posted {new Date(book.createdAt).toLocaleDateString()}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            {/* Dialogs */}
            <Dialog
                open={tradeDialog}
                onClose={() => setTradeDialog(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 4, p: 2 } }}
            >
                <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>Propose a Trade</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom color="text.secondary">
                        What would you like to offer for <b>"{book.title}"</b>?
                    </Typography>

                    <FormControl fullWidth sx={{ mt: 2, mb: 3 }}>
                        <InputLabel>Select from your library</InputLabel>
                        <Select
                            value={selectedBook}
                            label="Select from your library"
                            onChange={(e) => setSelectedBook(e.target.value)}
                            sx={{ borderRadius: 2 }}
                        >
                            {myBooks.map((b) => (
                                <MenuItem key={b._id} value={b._id}>
                                    {b.title} <Typography component="span" variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>by {b.author}</Typography>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {myBooks.length === 0 && (
                        <Alert severity="info" sx={{ mb: 3 }}>
                            You have no available books. <RouterLink to="/add-book">List a book</RouterLink> first.
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Message (Optional)"
                        placeholder="Hi! I'd love to trade..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setTradeDialog(false)} size="large" sx={{ borderRadius: 2 }}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleTrade}
                        disabled={tradeLoading || myBooks.length === 0}
                        size="large"
                        sx={{ borderRadius: 2, px: 4 }}
                    >
                        {tradeLoading ? 'Sending...' : 'Send Proposal'}
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                open={deleteDialog}
                onClose={() => setDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Delete Book"
                content="Are you sure you want to delete this book? This action cannot be undone."
                confirmText="Delete"
                severity="error"
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default BookDetails;
