import { useState, useEffect, useRef } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Box,
    TextField,
    Button,
    Avatar,
    Skeleton,
    Chip,
    IconButton,
    useTheme,
    alpha
} from '@mui/material';
import { Send, ArrowBack, SwapHoriz, MoreVert, AttachFile, InsertEmoticon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { messagesAPI, tradesAPI } from '../services/api';

const Messages = () => {
    const { tradeId } = useParams();
    const { user } = useAuth();
    const theme = useTheme();
    const [trade, setTrade] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [tradeId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchData = async () => {
        try {
            const [tradeRes, messagesRes] = await Promise.all([
                tradesAPI.getById(tradeId),
                messagesAPI.getByTrade(tradeId)
            ]);
            setTrade(tradeRes.data);
            setMessages(messagesRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async () => {
        try {
            const { data } = await messagesAPI.getByTrade(tradeId);
            if (data.length !== messages.length) {
                setMessages(data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        setSending(true);
        try {
            await messagesAPI.send({ tradeId, content: newMessage });
            setNewMessage('');
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Skeleton variant="rectangular" height={600} sx={{ borderRadius: 4 }} />
            </Container>
        );
    }

    const otherUser = trade?.requester._id === user._id ? trade.receiver : trade.requester;
    const isRequester = trade?.requester._id === user._id;

    return (
        <Container maxWidth="md" sx={{ py: 4, height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
            {/* Chat Header */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 3,
                    border: '1px solid rgba(0,0,0,0.05)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton component={RouterLink} to="/trades" sx={{ bgcolor: 'grey.100' }}>
                        <ArrowBack />
                    </IconButton>
                    <Box sx={{ position: 'relative' }}>
                        <Avatar src={otherUser?.avatar} sx={{ width: 48, height: 48 }}>
                            {otherUser?.name?.charAt(0)}
                        </Avatar>
                        <Box sx={{
                            position: 'absolute',
                            bottom: 2,
                            right: 2,
                            width: 12,
                            height: 12,
                            bgcolor: 'success.main',
                            borderRadius: '50%',
                            border: '2px solid white'
                        }} />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                            {otherUser?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {trade?.status === 'accepted' ? 'Trade Active' : 'Negotiating'}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2, px: 2, py: 1, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        Exchanging:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {trade?.bookOffered.title}
                    </Typography>
                    <SwapHoriz fontSize="small" sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {trade?.bookRequested.title}
                    </Typography>
                </Box>

                <IconButton>
                    <MoreVert />
                </IconButton>
            </Paper>

            {/* Messages Area */}
            <Paper
                elevation={0}
                sx={{
                    flexGrow: 1,
                    mb: 2,
                    borderRadius: 4,
                    overflow: 'hidden',
                    bgcolor: '#fff',
                    border: '1px solid rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            >
                <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Chip label={`Chat started ${new Date(trade?.createdAt).toLocaleDateString()}`} size="small" sx={{ bgcolor: 'grey.100' }} />
                    </Box>

                    {messages.length === 0 ? (
                        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.6 }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No messages yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Send a message to start discussing the trade details.
                            </Typography>
                        </Box>
                    ) : (
                        <AnimatePresence>
                            {messages.map((msg, index) => {
                                const isMe = msg.sender._id === user._id;
                                const showAvatar = !isMe && (index === 0 || messages[index - 1].sender._id !== msg.sender._id);

                                return (
                                    <Box
                                        component={motion.div}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={msg._id}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: isMe ? 'flex-end' : 'flex-start',
                                            mb: 0.5,
                                            mt: showAvatar ? 1.5 : 0
                                        }}
                                    >
                                        {!isMe && (
                                            <Box sx={{ width: 40, mr: 1, display: 'flex', alignItems: 'flex-end' }}>
                                                {showAvatar && (
                                                    <Avatar src={msg.sender.avatar} sx={{ width: 32, height: 32 }} />
                                                )}
                                            </Box>
                                        )}

                                        <Box
                                            sx={{
                                                maxWidth: '70%',
                                                p: 1.5,
                                                px: 2,
                                                borderRadius: 3,
                                                borderTopRightRadius: isMe ? 4 : 24,
                                                borderTopLeftRadius: isMe ? 24 : 4,
                                                borderBottomRightRadius: isMe ? 4 : 24,
                                                borderBottomLeftRadius: isMe ? 24 : 4,
                                                backgroundImage: isMe ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)` : 'none',
                                                bgcolor: isMe ? 'primary.main' : 'grey.100',
                                                color: isMe ? 'white' : 'text.primary',
                                                boxShadow: isMe ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none',
                                            }}
                                        >
                                            <Typography variant="body1" sx={{ lineHeight: 1.5 }}>
                                                {msg.content}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    opacity: 0.7,
                                                    display: 'block',
                                                    mt: 0.5,
                                                    textAlign: 'right',
                                                    fontSize: '0.7rem'
                                                }}
                                            >
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Typography>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </AnimatePresence>
                    )}
                    <div ref={messagesEndRef} />
                </Box>

                {/* Input Area */}
                <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'flex-end',
                            bgcolor: 'grey.50',
                            p: 1,
                            borderRadius: 3,
                            border: '1px solid rgba(0,0,0,0.05)',
                            transition: 'all 0.2s',
                            '&:focus-within': {
                                bgcolor: 'white',
                                borderColor: 'primary.main',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                            }
                        }}
                    >
                        <IconButton size="small" sx={{ mb: 0.5 }}>
                            <AttachFile />
                        </IconButton>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            placeholder="Type a message..."
                            variant="standard"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            InputProps={{
                                disableUnderline: true,
                            }}
                            sx={{ py: 1 }}
                        />
                        <IconButton size="small" sx={{ mb: 0.5 }}>
                            <InsertEmoticon />
                        </IconButton>
                        <Button
                            variant="contained"
                            onClick={handleSend}
                            disabled={sending || !newMessage.trim()}
                            sx={{
                                minWidth: 50,
                                width: 50,
                                height: 50,
                                borderRadius: '50%',
                                p: 0,
                                mb: 0,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            }}
                        >
                            <Send fontSize="small" />
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Messages;
