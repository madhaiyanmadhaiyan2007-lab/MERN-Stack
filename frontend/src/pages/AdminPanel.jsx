import { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Grid,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    Tabs,
    Tab,
    Avatar,
    Skeleton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import {
    People,
    MenuBook,
    SwapHoriz,
    Report,
    Block,
    CheckCircle,
    Delete,
} from '@mui/icons-material';
import { adminAPI } from '../services/api';

const AdminPanel = () => {
    const [tab, setTab] = useState(0);
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reportDialog, setReportDialog] = useState(null);

    useEffect(() => {
        fetchData();
    }, [tab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (tab === 0) {
                const { data } = await adminAPI.getStats();
                setStats(data);
            } else if (tab === 1) {
                const { data } = await adminAPI.getUsers();
                setUsers(data.users);
            } else if (tab === 2) {
                const { data } = await adminAPI.getReports();
                setReports(data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleUser = async (userId) => {
        try {
            await adminAPI.toggleUser(userId);
            fetchData();
        } catch (error) {
            console.error('Error toggling user:', error);
        }
    };

    const handleUpdateReport = async (reportId, status) => {
        try {
            await adminAPI.updateReport(reportId, { status });
            setReportDialog(null);
            fetchData();
        } catch (error) {
            console.error('Error updating report:', error);
        }
    };

    const statCards = stats ? [
        { icon: <People />, value: stats.users.total, label: 'Total Users', color: '#667eea' },
        { icon: <MenuBook />, value: stats.books.total, label: 'Total Books', color: '#10b981' },
        { icon: <SwapHoriz />, value: stats.trades.completed, label: 'Completed Trades', color: '#3b82f6' },
        { icon: <Report />, value: stats.reports.pending, label: 'Pending Reports', color: '#ef4444' },
    ] : [];

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
                Admin Panel
            </Typography>

            <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 4 }}>
                <Tab label="Dashboard" />
                <Tab label="Users" />
                <Tab label="Reports" />
            </Tabs>

            {/* Dashboard */}
            {tab === 0 && (
                loading ? (
                    <Grid container spacing={3}>
                        {[...Array(4)].map((_, i) => (
                            <Grid item xs={6} md={3} key={i}>
                                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3 }} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <>
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            {statCards.map((stat, index) => (
                                <Grid item xs={6} md={3} key={index}>
                                    <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
                                        <Box
                                            sx={{
                                                width: 50,
                                                height: 50,
                                                borderRadius: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                bgcolor: `${stat.color}15`,
                                                color: stat.color,
                                                margin: '0 auto 12px',
                                            }}
                                        >
                                            {stat.icon}
                                        </Box>
                                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                            {stat.value}
                                        </Typography>
                                        <Typography color="text.secondary" variant="body2">
                                            {stat.label}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 3, borderRadius: 3 }}>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                        User Statistics
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography>Active Users</Typography>
                                            <Typography fontWeight={600}>{stats?.users.active}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography>New This Week</Typography>
                                            <Typography fontWeight={600}>{stats?.users.newThisWeek}</Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 3, borderRadius: 3 }}>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                        Trade Statistics
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography>Pending Trades</Typography>
                                            <Typography fontWeight={600}>{stats?.trades.pending}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography>Available Books</Typography>
                                            <Typography fontWeight={600}>{stats?.books.available}</Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </>
                )
            )}

            {/* Users */}
            {tab === 1 && (
                <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>User</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Joined</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        {[...Array(6)].map((_, j) => (
                                            <TableCell key={j}><Skeleton /></TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Avatar src={user.avatar} sx={{ width: 32, height: 32 }}>
                                                    {user.name?.charAt(0)}
                                                </Avatar>
                                                {user.name}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.role}
                                                size="small"
                                                color={user.role === 'admin' ? 'primary' : 'default'}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.isActive ? 'Active' : 'Banned'}
                                                size="small"
                                                color={user.isActive ? 'success' : 'error'}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {user.role !== 'admin' && (
                                                <Button
                                                    size="small"
                                                    startIcon={user.isActive ? <Block /> : <CheckCircle />}
                                                    onClick={() => handleToggleUser(user._id)}
                                                    color={user.isActive ? 'error' : 'success'}
                                                >
                                                    {user.isActive ? 'Ban' : 'Activate'}
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Reports */}
            {tab === 2 && (
                <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Reporter</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Reason</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        {[...Array(6)].map((_, j) => (
                                            <TableCell key={j}><Skeleton /></TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : reports.length > 0 ? (
                                reports.map((report) => (
                                    <TableRow key={report._id}>
                                        <TableCell>{report.reporter?.name}</TableCell>
                                        <TableCell>
                                            {report.reportedUser ? 'User' : 'Book'}
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={report.reason} size="small" />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={report.status}
                                                size="small"
                                                color={
                                                    report.status === 'resolved' ? 'success' :
                                                        report.status === 'pending' ? 'warning' : 'default'
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {new Date(report.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {report.status === 'pending' && (
                                                <Button
                                                    size="small"
                                                    onClick={() => setReportDialog(report)}
                                                >
                                                    Review
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No reports found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Report Dialog */}
            <Dialog open={!!reportDialog} onClose={() => setReportDialog(null)} maxWidth="sm" fullWidth>
                <DialogTitle>Review Report</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Typography><strong>Reason:</strong> {reportDialog?.reason}</Typography>
                        <Typography sx={{ mt: 1 }}><strong>Description:</strong> {reportDialog?.description || 'N/A'}</Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setReportDialog(null)}>Cancel</Button>
                    <Button
                        variant="outlined"
                        onClick={() => handleUpdateReport(reportDialog._id, 'dismissed')}
                    >
                        Dismiss
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleUpdateReport(reportDialog._id, 'resolved')}
                    >
                        Mark Resolved
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminPanel;
