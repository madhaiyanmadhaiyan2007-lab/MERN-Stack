import { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    Tabs,
    Tab,
    Avatar,
    Chip,
    Button,
    Skeleton,
    Divider,
    Grid,
    useTheme,
    alpha
} from '@mui/material';
import {
    CheckCircle,
    Cancel,
    AccessTime,
    SwapHoriz,
    ArrowForward,
    Message,
    FilterList
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { tradesAPI } from '../services/api';

const statusColors = {
    pending: 'warning',
    accepted: 'info',
    completed: 'success',
    rejected: 'error',
    cancelled: 'default',
};

const Trades = () => {
    const { user } = useAuth();
    const theme = useTheme();
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(0);

    useEffect(() => {
        fetchTrades();
    }, [tab]);

    const fetchTrades = async () => {
        try {
            setLoading(true);
            const params = {};
            if (tab === 1) params.type = 'incoming';
            if (tab === 2) params.type = 'outgoing';

            const { data } = await tradesAPI.getAll(params);
            setTrades(data);
        } catch (error) {
            console.error('Error fetching trades:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTrade = async (tradeId, status) => {
        try {
            await tradesAPI.update(tradeId, { status });
            fetchTrades();
        } catch (error) {
            console.error('Error updating trade:', error);
        }
    };

    const handleConfirmTrade = async (tradeId, field) => {
        try {
            await tradesAPI.update(tradeId, { [field]: true });
            fetchTrades();
        } catch (error) {
            console.error('Error confirming trade:', error);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                        Trade Center
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage your book exchanges and requests
                    </Typography>
                </Box>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    mb: 4,
                    borderRadius: 3,
                    bgcolor: 'rgba(255,255,255,0.5)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    p: 1
                }}
            >
                <Tabs
                    value={tab}
                    onChange={(e, v) => setTab(v)}
                    variant="fullWidth"
                    sx={{
                        '& .MuiTab-root': {
                            fontSize: '1rem',
                            fontWeight: 600,
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '&.Mui-selected': {
                                color: 'primary.main',
                                bgcolor: alpha(theme.palette.primary.main, 0.1)
                            }
                        },
                        '& .MuiTabs-indicator': {
                            display: 'none'
                        },
                    }}
                >
                    <Tab label="All Trades" />
                    <Tab label="Incoming Requests" />
                    <Tab label="Outgoing Requests" />
                </Tabs>
            </Paper>

            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {[...Array(3)].map((_, i) => (
                            <Skeleton
                                key={i}
                                variant="rectangular"
                                height={200}
                                sx={{ mb: 3, borderRadius: 4 }}
                            />
                        ))}
                    </motion.div>
                ) : trades.length > 0 ? (
                    <Box component={motion.div} layout>
                        {trades.map((trade, index) => {
                            const isRequester = trade.requester._id === user._id;
                            const otherUser = isRequester ? trade.receiver : trade.requester;
                            const myBook = isRequester ? trade.bookOffered : trade.bookRequested;
                            const theirBook = isRequester ? trade.bookRequested : trade.bookOffered;

                            return (
                                <Paper
                                    component={motion.div}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    key={trade._id}
                                    elevation={0}
                                    sx={{
                                        p: 0,
                                        mb: 3,
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        border: '1px solid rgba(0,0,0,0.05)',
                                        background: 'rgba(255, 255, 255, 0.8)',
                                        backdropFilter: 'blur(20px)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                                        }
                                    }}
                                >
                                    {/* Header Status Bar */}
                                    <Box sx={{
                                        p: 2,
                                        bgcolor: alpha(theme.palette[statusColors[trade.status]].main, 0.1),
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        borderBottom: `1px solid ${alpha(theme.palette[statusColors[trade.status]].main, 0.2)}`
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Chip
                                                label={trade.status.toUpperCase()}
                                                color={statusColors[trade.status]}
                                                size="small"
                                                sx={{ fontWeight: 700, borderRadius: 1 }}
                                            />
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                Last updated: {new Date(trade.updatedAt).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                        {trade.message && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.7 }}>
                                                <Message fontSize="small" />
                                                <Typography variant="caption" sx={{ maxWidth: 200 }} noWrap>
                                                    "{trade.message}"
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>

                                    <Box sx={{ p: 4 }}>
                                        <Grid container alignItems="center" spacing={4}>
                                            {/* My Book Side */}
                                            <Grid item xs={12} md={5}>
                                                <Box sx={{ display: 'flex', gap: 2 }}>
                                                    <Box
                                                        component="img"
                                                        src={myBook.coverImage || 'https://via.placeholder.com/100x150'}
                                                        sx={{ width: 80, height: 120, objectFit: 'cover', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                    />
                                                    <Box>
                                                        <Typography variant="caption" sx={{ textTransform: 'uppercase', color: 'text.secondary', fontWeight: 700, letterSpacing: 1 }}>
                                                            {isRequester ? 'You Offer' : 'They Want'}
                                                        </Typography>
                                                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, mb: 1 }}>
                                                            {myBook.title}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            by {myBook.author}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>

                                            {/* Exchange Arrow */}
                                            <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                                                <Box sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    bgcolor: 'grey.100',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'text.secondary'
                                                }}>
                                                    <SwapHoriz />
                                                </Box>
                                            </Grid>

                                            {/* Their Book Side */}
                                            <Grid item xs={12} md={5}>
                                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', textAlign: 'right' }}>
                                                    <Box>
                                                        <Typography variant="caption" sx={{ textTransform: 'uppercase', color: 'text.secondary', fontWeight: 700, letterSpacing: 1 }}>
                                                            {isRequester ? 'You Receive' : 'They Offer'}
                                                        </Typography>
                                                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, mb: 1 }}>
                                                            {theirBook.title}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                                            <Avatar src={otherUser.avatar} sx={{ width: 24, height: 24 }} />
                                                            <Typography variant="body2" color="text.secondary">
                                                                {otherUser.name}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box
                                                        component="img"
                                                        src={theirBook.coverImage || 'https://via.placeholder.com/100x150'}
                                                        sx={{ width: 80, height: 120, objectFit: 'cover', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                    />
                                                </Box>
                                            </Grid>
                                        </Grid>

                                        {/* Actions Footer */}
                                        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                            <Button
                                                variant="text"
                                                startIcon={<Message />}
                                                component={RouterLink}
                                                to={`/messages/${trade._id}`}
                                            >
                                                Chat with {otherUser.name?.split(' ')[0]}
                                            </Button>

                                            {trade.status === 'pending' && !isRequester && (
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        startIcon={<CheckCircle />}
                                                        onClick={() => handleUpdateTrade(trade._id, 'accepted')}
                                                        sx={{ borderRadius: 2, px: 3 }}
                                                    >
                                                        Accept Trade
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        startIcon={<Cancel />}
                                                        onClick={() => handleUpdateTrade(trade._id, 'rejected')}
                                                        sx={{ borderRadius: 2, px: 3 }}
                                                    >
                                                        Reject
                                                    </Button>
                                                </>
                                            )}

                                            {trade.status === 'pending' && isRequester && (
                                                <Button
                                                    variant="outlined"
                                                    color="warning"
                                                    onClick={() => handleUpdateTrade(trade._id, 'cancelled')}
                                                    sx={{ borderRadius: 2 }}
                                                >
                                                    Cancel Request
                                                </Button>
                                            )}

                                            {trade.status === 'accepted' && (
                                                <Button
                                                    variant="contained"
                                                    startIcon={<CheckCircle />}
                                                    disabled={isRequester ? trade.requesterConfirmed : trade.receiverConfirmed}
                                                    onClick={() => handleConfirmTrade(
                                                        trade._id,
                                                        isRequester ? 'requesterConfirmed' : 'receiverConfirmed'
                                                    )}
                                                    sx={{
                                                        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                                                        borderRadius: 2,
                                                        px: 3
                                                    }}
                                                >
                                                    {(isRequester ? trade.requesterConfirmed : trade.receiverConfirmed)
                                                        ? 'Waiting for Partner'
                                                        : 'Confirm Receipt'}
                                                </Button>
                                            )}
                                        </Box>
                                    </Box>
                                </Paper>
                            );
                        })}
                    </Box>
                ) : (
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        sx={{ textAlign: 'center', py: 10 }}
                    >
                        <Box sx={{
                            width: 120,
                            height: 120,
                            borderRadius: '50%',
                            bgcolor: 'grey.50',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 3
                        }}>
                            <SwapHoriz sx={{ fontSize: 60, color: 'text.disabled' }} />
                        </Box>
                        <Typography variant="h5" color="text.secondary" gutterBottom fontWeight={600}>
                            No trades found
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                            {tab === 0
                                ? "You haven't participated in any trades yet. Start by browsing books and proposing a trade!"
                                : tab === 1
                                    ? "No incoming trade requests at the moment."
                                    : "You haven't sent any trade requests yet."}
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            component={RouterLink}
                            to="/"
                            sx={{
                                borderRadius: 3,
                                px: 4,
                                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                            }}
                        >
                            Browse Books
                        </Button>
                    </Box>
                )}
            </AnimatePresence>
        </Container>
    );
};

export default Trades;
