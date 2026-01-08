import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    useTheme,
    alpha
} from '@mui/material';
import { Warning, Info } from '@mui/icons-material';

const ConfirmDialog = ({
    open,
    onClose,
    onConfirm,
    title,
    content,
    confirmText = "Confirm",
    cancelText = "Cancel",
    severity = "warning" // 'warning', 'error', 'info'
}) => {
    const theme = useTheme();

    const getColor = () => {
        switch (severity) {
            case 'error': return theme.palette.error.main;
            case 'info': return theme.palette.info.main;
            case 'success': return theme.palette.success.main;
            default: return theme.palette.warning.main;
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    p: 1,
                    minWidth: 320
                }
            }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Warning sx={{ color: getColor() }} />
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="inherit"
                    sx={{ borderRadius: 2 }}
                >
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    autoFocus
                    sx={{
                        bgcolor: getColor(),
                        borderRadius: 2,
                        '&:hover': {
                            bgcolor: alpha(getColor(), 0.8)
                        }
                    }}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
