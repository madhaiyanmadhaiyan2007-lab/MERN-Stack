import { createTheme, alpha } from '@mui/material/styles';

// Premium Color Palette
const palette = {
    primary: {
        main: '#6366F1', // Indigo
        light: '#818cf8',
        dark: '#4f46e5',
        contrastText: '#ffffff',
    },
    secondary: {
        main: '#EC4899', // Pink
        light: '#f472b6',
        dark: '#db2777',
        contrastText: '#ffffff',
    },
    background: {
        default: '#F8FAFC',
        paper: '#ffffff',
        glass: 'rgba(255, 255, 255, 0.8)',
    },
    text: {
        primary: '#1e293b',
        secondary: '#64748b',
    },
    success: {
        main: '#10B981',
    },
    warning: {
        main: '#F59E0B',
    },
    error: {
        main: '#EF4444',
    },
    info: {
        main: '#3B82F6',
    },
};

const theme = createTheme({
    palette,
    typography: {
        fontFamily: '"Outfit", "Inter", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: '3.5rem',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontWeight: 700,
            fontSize: '2.5rem',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
        },
        h3: {
            fontWeight: 600,
            fontSize: '2rem',
            lineHeight: 1.3,
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
        },
        h6: {
            fontWeight: 600,
            fontSize: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
        },
        button: {
            fontWeight: 600,
            textTransform: 'none',
            letterSpacing: '0.02em',
        },
    },
    shape: {
        borderRadius: 16,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
        body {
          background-color: ${palette.background.default};
          background-image: 
            radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
            radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), 
            radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%);
          min-height: 100vh;
        }
      `,
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    padding: '10px 24px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: 'none',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 10px 20px -10px ${alpha(palette.primary.main, 0.5)}`,
                    },
                },
                contained: {
                    background: `linear-gradient(135deg, ${palette.primary.main} 0%, ${palette.primary.dark} 100%)`,
                    '&:hover': {
                        background: `linear-gradient(135deg, ${palette.primary.light} 0%, ${palette.primary.main} 100%)`,
                    },
                },
                outlined: {
                    borderWidth: '2px',
                    '&:hover': {
                        borderWidth: '2px',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
                elevation1: {
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                },
                rounded: {
                    borderRadius: '16px',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '20px',
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: `1px solid ${alpha('#fff', 0.1)}`,
                    background: alpha('#fff', 0.8),
                    backdropFilter: 'blur(12px)',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: alpha('#fff', 0.5),
                        backdropFilter: 'blur(4px)',
                        transition: 'all 0.3s ease',
                        '&.Mui-focused': {
                            backgroundColor: '#fff',
                            boxShadow: `0 10px 15px -3px ${alpha(palette.primary.main, 0.1)}`,
                        },
                    },
                },
            },
        },
    },
});

export default theme;
