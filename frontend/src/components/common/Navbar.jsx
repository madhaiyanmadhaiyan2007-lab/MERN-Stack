import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Avatar,
    Button,
    Tooltip,
    MenuItem,
    Badge,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    useTheme,
    useMediaQuery,
    alpha,
} from '@mui/material';
import {
    Menu as MenuIcon,
    MenuBook,
    Search,
    SwapHoriz,
    Dashboard,
    AdminPanelSettings,
    Logout,
    Person,
    Add,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated, isAdmin, logout } = useAuth();

    const [anchorElUser, setAnchorElUser] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect for glassmorphism
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrolled]);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        handleCloseUserMenu();
    };

    const navItems = [
        { label: 'Browse', path: '/', icon: <MenuBook /> },
        { label: 'Search', path: '/search', icon: <Search /> },
    ];

    const authNavItems = [
        { label: 'My Books', path: '/my-books', icon: <MenuBook /> },
        { label: 'Trades', path: '/trades', icon: <SwapHoriz /> },
    ];

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography
                variant="h5"
                sx={{
                    my: 3,
                    fontWeight: 800,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontFamily: '"Outfit", sans-serif',
                }}
            >
                BookTrade
            </Typography>
            <Divider />
            <List sx={{ mt: 2 }}>
                {navItems.map((item) => (
                    <ListItem key={item.path} disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to={item.path}
                            selected={location.pathname === item.path}
                            sx={{
                                my: 0.5,
                                mx: 2,
                                borderRadius: 2,
                                '&.Mui-selected': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    color: theme.palette.primary.main,
                                    '& .MuiListItemIcon-root': {
                                        color: theme.palette.primary.main,
                                    },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: theme.palette.text.secondary }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
                {isAuthenticated && authNavItems.map((item) => (
                    <ListItem key={item.path} disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to={item.path}
                            selected={location.pathname === item.path}
                            sx={{
                                my: 0.5,
                                mx: 2,
                                borderRadius: 2,
                                '&.Mui-selected': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    color: theme.palette.primary.main,
                                    '& .MuiListItemIcon-root': {
                                        color: theme.palette.primary.main,
                                    },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: theme.palette.text.secondary }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
                {isAdmin && (
                    <ListItem disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to="/admin"
                            sx={{
                                my: 0.5,
                                mx: 2,
                                borderRadius: 2,
                                color: theme.palette.secondary.main,
                            }}
                        >
                            <ListItemIcon sx={{ color: theme.palette.secondary.main }}><AdminPanelSettings /></ListItemIcon>
                            <ListItemText primary="Admin Panel" primaryTypographyProps={{ fontWeight: 600 }} />
                        </ListItemButton>
                    </ListItem>
                )}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar
                component={motion.nav}
                position="sticky"
                elevation={scrolled ? 4 : 0}
                sx={{
                    background: scrolled ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(20px)' : 'none',
                    borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
                    transition: 'all 0.3s ease',
                    color: scrolled ? theme.palette.text.primary : theme.palette.text.primary,
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ height: 80 }}>
                        {/* Mobile Menu Icon */}
                        {isMobile && (
                            <IconButton
                                color="inherit"
                                aria-label="open navigation menu"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2 }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}

                        {/* Logo */}
                        <Typography
                            variant="h5"
                            noWrap
                            component={RouterLink}
                            to="/"
                            sx={{
                                mr: 4,
                                display: 'flex',
                                alignItems: 'center',
                                fontWeight: 800,
                                letterSpacing: '-0.5px',
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textDecoration: 'none',
                                flexGrow: { xs: 1, md: 0 },
                            }}
                        >
                            <motion.span
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                BookTrade
                            </motion.span>
                        </Typography>

                        {/* Desktop Navigation */}
                        {!isMobile && (
                            <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
                                {navItems.map((item) => (
                                    <Button
                                        key={item.path}
                                        component={RouterLink}
                                        to={item.path}
                                        startIcon={item.icon}
                                        sx={{
                                            color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                                            fontWeight: 600,
                                            px: 2,
                                            borderRadius: 2,
                                            backgroundColor: location.pathname === item.path ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                                            '&:hover': {
                                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                color: 'primary.main',
                                            },
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                ))}
                                {isAuthenticated && authNavItems.map((item) => (
                                    <Button
                                        key={item.path}
                                        component={RouterLink}
                                        to={item.path}
                                        startIcon={item.icon}
                                        sx={{
                                            color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                                            fontWeight: 600,
                                            px: 2,
                                            borderRadius: 2,
                                            backgroundColor: location.pathname === item.path ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                                            '&:hover': {
                                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                color: 'primary.main',
                                            },
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                ))}
                            </Box>
                        )}

                        {/* User Actions */}
                        <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            {/* Admin Link (Desktop) */}
                            {isAdmin && !isMobile && (
                                <Button
                                    component={RouterLink}
                                    to="/admin"
                                    color="secondary"
                                    startIcon={<AdminPanelSettings />}
                                    sx={{ fontWeight: 600 }}
                                >
                                    Admin
                                </Button>
                            )}

                            {isAuthenticated ? (
                                <>
                                    <Button
                                        variant="contained"
                                        component={RouterLink}
                                        to="/add-book"
                                        startIcon={<Add />}
                                        sx={{
                                            display: { xs: 'none', sm: 'flex' },
                                            borderRadius: '50px',
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                            boxShadow: `0 8px 20px -4px ${alpha(theme.palette.secondary.main, 0.5)}`,
                                            '&:hover': {
                                                boxShadow: `0 12px 24px -4px ${alpha(theme.palette.secondary.main, 0.6)}`,
                                            },
                                        }}
                                    >
                                        Add Book
                                    </Button>

                                    <Tooltip title="Account settings">
                                        <IconButton
                                            onClick={handleOpenUserMenu}
                                            aria-label="open account settings"
                                            sx={{
                                                p: 0.5,
                                                border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    borderColor: theme.palette.primary.main,
                                                    boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
                                                },
                                            }}
                                        >
                                            <Avatar
                                                alt={user?.name}
                                                src={user?.avatar}
                                                sx={{ width: 35, height: 35, bgcolor: 'secondary.main' }}
                                            >
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </Avatar>
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        sx={{ mt: '45px' }}
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                        keepMounted
                                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                        PaperProps={{
                                            sx: {
                                                mt: 1.5,
                                                borderRadius: 3,
                                                minWidth: 200,
                                                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
                                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                            }
                                        }}
                                    >
                                        <MenuItem component={RouterLink} to="/dashboard" onClick={handleCloseUserMenu}>
                                            <ListItemIcon><Dashboard fontSize="small" /></ListItemIcon>
                                            Dashboard
                                        </MenuItem>
                                        <MenuItem component={RouterLink} to="/profile" onClick={handleCloseUserMenu}>
                                            <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                                            Profile
                                        </MenuItem>
                                        <Divider sx={{ my: 1 }} />
                                        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                                            <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
                                            Logout
                                        </MenuItem>
                                    </Menu>
                                </>
                            ) : (
                                <>
                                    <Button
                                        component={RouterLink}
                                        to="/login"
                                        color="inherit"
                                        sx={{ fontWeight: 600 }}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        variant="contained"
                                        component={RouterLink}
                                        to="/register"
                                        sx={{
                                            borderRadius: '50px',
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                            boxShadow: `0 8px 20px -4px ${alpha(theme.palette.secondary.main, 0.5)}`,
                                            px: 4,
                                        }}
                                    >
                                        Get Started
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: 280,
                        backgroundColor: alpha('#ffffff', 0.95),
                        backdropFilter: 'blur(10px)',
                    },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default Navbar;
