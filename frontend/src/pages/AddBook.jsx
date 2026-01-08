import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Grid,
    Chip,
    alpha,
} from '@mui/material';
import { Save, AutoStories, Image as ImageIcon } from '@mui/icons-material';
import { booksAPI } from '../services/api';
import { motion } from 'framer-motion';

const genres = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Thriller', 'Romance',
    'Science Fiction', 'Fantasy', 'Horror', 'Biography', 'History',
    'Self-Help', 'Children', 'Young Adult', 'Comics', 'Poetry', 'Other'
];

const conditions = ['New', 'Like New', 'Very Good', 'Good', 'Acceptable', 'Poor'];

const AddBook = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        isbn: '',
        genre: '',
        condition: '',
        description: '',
        coverImage: '',
        lookingFor: [],
    });
    const [lookingForInput, setLookingForInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleAddLookingFor = () => {
        if (lookingForInput.trim() && !formData.lookingFor.includes(lookingForInput.trim())) {
            setFormData({
                ...formData,
                lookingFor: [...formData.lookingFor, lookingForInput.trim()]
            });
            setLookingForInput('');
        }
    };

    const handleRemoveLookingFor = (item) => {
        setFormData({
            ...formData,
            lookingFor: formData.lookingFor.filter(i => i !== item)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await booksAPI.create(formData);
            navigate('/my-books');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add book');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{
                    p: { xs: 3, md: 5 },
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Decorative background element */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '300px',
                        height: '300px',
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                        filter: 'blur(40px)',
                        borderRadius: '50%',
                        transform: 'translate(30%, -30%)',
                        zIndex: 0,
                    }}
                />

                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                        <Box sx={{
                            p: 1.5,
                            borderRadius: '50%',
                            bgcolor: alpha('#667eea', 0.1),
                            color: '#667eea',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <AutoStories fontSize="large" />
                        </Box>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a202c' }}>
                                Add a New Book
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Share your book with the community
                            </Typography>
                        </Box>
                    </Box>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                        >
                            <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Book Title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            bgcolor: alpha('#fff', 0.6),
                                            transition: 'all 0.2s',
                                            '&:hover': { bgcolor: alpha('#fff', 0.9) },
                                            '&.Mui-focused': { bgcolor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Author"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleChange}
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            bgcolor: alpha('#fff', 0.6),
                                            transition: 'all 0.2s',
                                            '&:hover': { bgcolor: alpha('#fff', 0.9) },
                                            '&.Mui-focused': { bgcolor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="ISBN (optional)"
                                    name="isbn"
                                    value={formData.isbn}
                                    onChange={handleChange}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            bgcolor: alpha('#fff', 0.6),
                                            transition: 'all 0.2s',
                                            '&:hover': { bgcolor: alpha('#fff', 0.9) },
                                            '&.Mui-focused': { bgcolor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Genre</InputLabel>
                                    <Select
                                        name="genre"
                                        value={formData.genre}
                                        label="Genre"
                                        onChange={handleChange}
                                        sx={{
                                            bgcolor: alpha('#fff', 0.6),
                                            transition: 'all 0.2s',
                                            '&:hover': { bgcolor: alpha('#fff', 0.9) },
                                            '&.Mui-focused': { bgcolor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
                                        }}
                                    >
                                        {genres.map((g) => (
                                            <MenuItem key={g} value={g}>{g}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Condition</InputLabel>
                                    <Select
                                        name="condition"
                                        value={formData.condition}
                                        label="Condition"
                                        onChange={handleChange}
                                        sx={{
                                            bgcolor: alpha('#fff', 0.6),
                                            transition: 'all 0.2s',
                                            '&:hover': { bgcolor: alpha('#fff', 0.9) },
                                            '&.Mui-focused': { bgcolor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
                                        }}
                                    >
                                        {conditions.map((c) => (
                                            <MenuItem key={c} value={c}>{c}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Cover Image URL (optional)"
                                    name="coverImage"
                                    value={formData.coverImage}
                                    onChange={handleChange}
                                    placeholder="https://example.com/book-cover.jpg"
                                    InputProps={{
                                        startAdornment: <ImageIcon sx={{ color: 'text.secondary', mr: 1, my: 0.5 }} />
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            bgcolor: alpha('#fff', 0.6),
                                            transition: 'all 0.2s',
                                            '&:hover': { bgcolor: alpha('#fff', 0.9) },
                                            '&.Mui-focused': { bgcolor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe the book and any notable features..."
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            bgcolor: alpha('#fff', 0.6),
                                            transition: 'all 0.2s',
                                            '&:hover': { bgcolor: alpha('#fff', 0.9) },
                                            '&.Mui-focused': { bgcolor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        bgcolor: alpha('#fff', 0.4),
                                        borderColor: 'rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                                        What are you looking for in return? (optional)
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                        <TextField
                                            size="small"
                                            placeholder="e.g., Fantasy books, Stephen King..."
                                            value={lookingForInput}
                                            onChange={(e) => setLookingForInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLookingFor())}
                                            sx={{
                                                flexGrow: 1,
                                                '& .MuiOutlinedInput-root': { bgcolor: 'white' }
                                            }}
                                        />
                                        <Button
                                            variant="contained"
                                            onClick={handleAddLookingFor}
                                            sx={{ bgcolor: '#667eea', '&:hover': { bgcolor: '#5a6fd6' } }}
                                        >
                                            Add
                                        </Button>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', minHeight: 32 }}>
                                        {formData.lookingFor.length === 0 && (
                                            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                No preferences added yet
                                            </Typography>
                                        )}
                                        {formData.lookingFor.map((item, i) => (
                                            <Chip
                                                key={i}
                                                label={item}
                                                onDelete={() => handleRemoveLookingFor(item)}
                                                sx={{ bgcolor: 'white', fontWeight: 500 }}
                                            />
                                        ))}
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    startIcon={<Save />}
                                    disabled={loading}
                                    fullWidth
                                    sx={{
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.5)',
                                        }
                                    }}
                                >
                                    {loading ? 'Adding Book...' : 'Add Book'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Paper>
        </Container>
    );
};

export default AddBook;

