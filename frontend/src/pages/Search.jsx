import { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    TextField,
    Grid,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    InputAdornment,
    Skeleton,
    Paper,
    Pagination,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import BookCard from '../components/books/BookCard';
import { booksAPI } from '../services/api';

const genres = [
    'All', 'Fiction', 'Non-Fiction', 'Mystery', 'Thriller', 'Romance',
    'Science Fiction', 'Fantasy', 'Horror', 'Biography', 'History',
    'Self-Help', 'Children', 'Young Adult', 'Comics', 'Poetry', 'Other'
];

const conditions = ['All', 'New', 'Like New', 'Very Good', 'Good', 'Acceptable', 'Poor'];

const Search = () => {
    const [query, setQuery] = useState('');
    const [genre, setGenre] = useState('All');
    const [condition, setCondition] = useState('All');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleSearch = async (pageNum = 1) => {
        setLoading(true);
        setSearched(true);

        try {
            const params = { page: pageNum, limit: 12 };
            if (query) params.q = query;
            if (genre !== 'All') params.genre = genre;
            if (condition !== 'All') params.condition = condition;

            const { data } = await booksAPI.search(params);
            setBooks(data.books);
            setTotalPages(data.pages);
            setPage(pageNum);
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                    mb: 4,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                Search Books
            </Typography>

            {/* Search Form */}
            <Paper
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 3,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s',
                    '&:hover': {
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    },
                }}
            >
                <Grid container spacing={2} alignItems="flex-end">
                    <Grid item xs={12} md={5}>
                        <TextField
                            fullWidth
                            placeholder="Search by title, author, or keyword..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                    },
                                    '&.Mui-focused': {
                                        boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.2)',
                                        transform: 'translateY(-2px)',
                                    },
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon
                                            sx={{
                                                transition: 'all 0.3s ease',
                                                '.Mui-focused &': {
                                                    color: '#667eea',
                                                    transform: 'scale(1.1)',
                                                },
                                            }}
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <FormControl
                            fullWidth
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                    },
                                },
                            }}
                        >
                            <InputLabel>Genre</InputLabel>
                            <Select value={genre} label="Genre" onChange={(e) => setGenre(e.target.value)}>
                                {genres.map((g) => (
                                    <MenuItem key={g} value={g}>{g}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <FormControl
                            fullWidth
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                    },
                                },
                            }}
                        >
                            <InputLabel>Condition</InputLabel>
                            <Select value={condition} label="Condition" onChange={(e) => setCondition(e.target.value)}>
                                {conditions.map((c) => (
                                    <MenuItem key={c} value={c}>{c}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => handleSearch()}
                            sx={{
                                py: 1.5,
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
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                                    '&::before': {
                                        left: '100%',
                                    },
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            Search
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Results */}
            {loading ? (
                <Grid container spacing={3}>
                    {[...Array(8)].map((_, i) => (
                        <Grid item key={i} xs={12} sm={6} md={4} lg={3}>
                            <Skeleton
                                variant="rectangular"
                                height={300}
                                sx={{
                                    borderRadius: 3,
                                    animation: 'pulse 1.5s ease-in-out infinite',
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : searched ? (
                books.length > 0 ? (
                    <>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mb: 2,
                                animation: 'fadeIn 0.4s ease-out',
                            }}
                        >
                            Found {books.length} books
                        </Typography>
                        <Grid container spacing={3}>
                            {books.map((book, index) => (
                                <Grid
                                    item
                                    key={book._id}
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    lg={3}
                                    sx={{
                                        opacity: 1,
                                        animation: `fadeInUp 0.5s ease-out ${0.05 * index}s both`,
                                    }}
                                >
                                    <BookCard book={book} />
                                </Grid>
                            ))}
                        </Grid>
                        {totalPages > 1 && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    mt: 4,
                                    animation: 'fadeIn 0.5s ease-out 0.3s both',
                                    '& .MuiPaginationItem-root': {
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.1)',
                                        },
                                    },
                                }}
                            >
                                <Pagination
                                    count={totalPages}
                                    page={page}
                                    onChange={(e, v) => handleSearch(v)}
                                    color="primary"
                                />
                            </Box>
                        )}
                    </>
                ) : (
                    <Paper
                        sx={{
                            p: 6,
                            textAlign: 'center',
                            borderRadius: 3,
                            animation: 'scaleIn 0.4s ease-out',
                        }}
                    >
                        <Typography variant="h6" color="text.secondary">
                            No books found. Try different search terms.
                        </Typography>
                    </Paper>
                )
            ) : (
                <Paper
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        borderRadius: 3,
                        bgcolor: 'grey.50',
                        animation: 'fadeIn 0.6s ease-out 0.2s both',
                    }}
                >
                    <SearchIcon
                        sx={{
                            fontSize: 60,
                            color: 'text.disabled',
                            mb: 2,
                            animation: 'float 3s ease-in-out infinite',
                        }}
                    />
                    <Typography variant="h6" color="text.secondary">
                        Enter keywords to search for books
                    </Typography>
                </Paper>
            )}
        </Container>
    );
};

export default Search;
