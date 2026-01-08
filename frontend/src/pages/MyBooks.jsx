import { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Button,
    Box,
    Skeleton,
    Paper,
    Tabs,
    Tab,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import BookCard from '../components/books/BookCard';
import { booksAPI } from '../services/api';

const MyBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(0);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const { data } = await booksAPI.getMyBooks();
            setBooks(data);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    const availableBooks = books.filter(b => b.isAvailable);
    const tradedBooks = books.filter(b => !b.isAvailable);
    const displayedBooks = tab === 0 ? availableBooks : tradedBooks;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    My Books
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    component={RouterLink}
                    to="/add-book"
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                >
                    Add New Book
                </Button>
            </Box>

            <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
                <Tab label={`Available (${availableBooks.length})`} />
                <Tab label={`In Trade (${tradedBooks.length})`} />
            </Tabs>

            <Grid container spacing={3}>
                {loading ? (
                    [...Array(4)].map((_, i) => (
                        <Grid item key={i} xs={12} sm={6} md={4} lg={3}>
                            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
                        </Grid>
                    ))
                ) : displayedBooks.length > 0 ? (
                    displayedBooks.map((book) => (
                        <Grid item key={book._id} xs={12} sm={6} md={4} lg={3}>
                            <BookCard book={book} />
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                                {tab === 0 ? 'No available books' : 'No books currently in trade'}
                            </Typography>
                            {tab === 0 && (
                                <Button
                                    variant="contained"
                                    component={RouterLink}
                                    to="/add-book"
                                    startIcon={<Add />}
                                >
                                    Add Your First Book
                                </Button>
                            )}
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default MyBooks;
