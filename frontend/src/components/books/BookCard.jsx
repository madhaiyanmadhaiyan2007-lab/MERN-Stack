import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Chip,
    Box,
    Avatar,
    IconButton,
    Tooltip,
    alpha,
} from '@mui/material';
import { LocationOn, Visibility, Favorite } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const BookCard = ({ book, index = 0 }) => {
    const defaultCover = 'https://via.placeholder.com/300x400?text=No+Cover';

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: index * 0.1
            }
        },
        hover: {
            y: -8,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    return (
        <Card
            component={motion.div}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                transition: 'box-shadow 0.3s ease',
                '&:hover': {
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                },
            }}
        >
            <Box sx={{ position: 'relative', overflow: 'hidden', pt: '140%' }}>
                <CardMedia
                    component={motion.img}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    image={book.coverImage || defaultCover}
                    alt={book.title}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />

                {/* Overlay on Hover */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        pb: 3,
                        gap: 2,
                        '.MuiCard-root:hover &': {
                            opacity: 1,
                        },
                    }}
                >
                    <Tooltip title="View Details">
                        <IconButton
                            component={RouterLink}
                            to={`/books/${book._id}`}
                            size="small"
                            aria-label={`View details for ${book.title}`}
                            sx={{
                                bgcolor: 'white',
                                color: 'primary.main',
                                '&:hover': { bgcolor: 'primary.main', color: 'white' },
                                transform: 'translateY(20px)',
                                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                '.MuiCard-root:hover &': {
                                    transform: 'translateY(0)',
                                },
                            }}
                        >
                            <Visibility fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Add to Wishlist">
                        <IconButton
                            size="small"
                            aria-label={`Add ${book.title} to wishlist`}
                            sx={{
                                bgcolor: 'white',
                                color: 'secondary.main',
                                '&:hover': { bgcolor: 'secondary.main', color: 'white' },
                                transform: 'translateY(20px)',
                                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s',
                                '.MuiCard-root:hover &': {
                                    transform: 'translateY(0)',
                                },
                            }}
                        >
                            <Favorite fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Condition Badge */}
                <Chip
                    label={book.condition}
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        backdropFilter: 'blur(8px)',
                        bgcolor: alpha('#000', 0.6),
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 24,
                    }}
                />
            </Box>

            <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}>
                <Typography
                    variant="subtitle2"
                    sx={{
                        color: 'primary.main',
                        fontWeight: 700,
                        mb: 0.5,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}
                >
                    {book.genre}
                </Typography>

                <Typography
                    variant="h6"
                    component={RouterLink}
                    to={`/books/${book._id}`}
                    sx={{
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        lineHeight: 1.3,
                        mb: 0.5,
                        textDecoration: 'none',
                        color: 'text.primary',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        transition: 'color 0.2s',
                        '&:hover': { color: 'primary.main' }
                    }}
                >
                    {book.title}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, fontSize: '0.9rem' }}
                >
                    {book.author}
                </Typography>

                {book.owner && (
                    <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 1.5, pt: 2, borderTop: `1px solid ${alpha('#000', 0.05)}` }}>
                        <Avatar
                            src={book.owner.avatar}
                            alt={book.owner.name}
                            sx={{ width: 32, height: 32, border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                        >
                            {book.owner.name?.charAt(0)}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }} noWrap>
                                {book.owner.name}
                            </Typography>
                            {book.owner.location && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, opacity: 0.7 }}>
                                    <LocationOn sx={{ fontSize: 14 }} />
                                    <Typography variant="caption" noWrap>
                                        {book.owner.location}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default BookCard;
