const User = require('../models/User');
const Book = require('../models/Book');
const Trade = require('../models/Trade');
const Report = require('../models/Report');

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments();

        res.json({
            users,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
    try {
        const [
            totalUsers,
            activeUsers,
            totalBooks,
            availableBooks,
            totalTrades,
            completedTrades,
            pendingTrades,
            pendingReports
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ isActive: true }),
            Book.countDocuments(),
            Book.countDocuments({ isAvailable: true }),
            Trade.countDocuments(),
            Trade.countDocuments({ status: 'completed' }),
            Trade.countDocuments({ status: 'pending' }),
            Report.countDocuments({ status: 'pending' })
        ]);

        // Get recent users (last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const newUsersThisWeek = await User.countDocuments({
            createdAt: { $gte: weekAgo }
        });

        // Get trades by status for chart
        const tradesByStatus = await Trade.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Get books by genre for chart
        const booksByGenre = await Book.aggregate([
            { $group: { _id: '$genre', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        res.json({
            users: {
                total: totalUsers,
                active: activeUsers,
                newThisWeek: newUsersThisWeek
            },
            books: {
                total: totalBooks,
                available: availableBooks
            },
            trades: {
                total: totalTrades,
                completed: completedTrades,
                pending: pendingTrades,
                byStatus: tradesByStatus
            },
            reports: {
                pending: pendingReports
            },
            charts: {
                booksByGenre
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Toggle user active status (ban/unban)
// @route   PUT /api/admin/users/:id/toggle
// @access  Private/Admin
const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot modify admin users' });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isActive: user.isActive,
            message: user.isActive ? 'User activated' : 'User deactivated'
        });
    } catch (error) {
        console.error('Toggle user status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete user (admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot delete admin users' });
        }

        // Delete user's books
        await Book.deleteMany({ owner: req.params.id });

        // Delete user
        await User.findByIdAndDelete(req.params.id);

        res.json({ message: 'User and their books deleted' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all reports
// @route   GET /api/admin/reports
// @access  Private/Admin
const getReports = async (req, res) => {
    try {
        const { status } = req.query;
        const query = status ? { status } : {};

        const reports = await Report.find(query)
            .populate('reporter', 'name email')
            .populate('reportedUser', 'name email')
            .populate('reportedBook', 'title author')
            .populate('resolvedBy', 'name')
            .sort({ createdAt: -1 });

        res.json(reports);
    } catch (error) {
        console.error('Get reports error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update report status
// @route   PUT /api/admin/reports/:id
// @access  Private/Admin
const updateReport = async (req, res) => {
    try {
        const { status, adminNote } = req.body;

        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        report.status = status || report.status;
        report.adminNote = adminNote || report.adminNote;

        if (status === 'resolved' || status === 'dismissed') {
            report.resolvedBy = req.user._id;
            report.resolvedAt = new Date();
        }

        await report.save();

        const populatedReport = await Report.findById(report._id)
            .populate('reporter', 'name email')
            .populate('reportedUser', 'name email')
            .populate('reportedBook', 'title author')
            .populate('resolvedBy', 'name');

        res.json(populatedReport);
    } catch (error) {
        console.error('Update report error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a report (any user)
// @route   POST /api/admin/reports
// @access  Private
const createReport = async (req, res) => {
    try {
        const { reportedUser, reportedBook, reason, description } = req.body;

        if (!reportedUser && !reportedBook) {
            return res.status(400).json({ message: 'Must report either a user or a book' });
        }

        const report = await Report.create({
            reporter: req.user._id,
            reportedUser,
            reportedBook,
            reason,
            description
        });

        res.status(201).json(report);
    } catch (error) {
        console.error('Create report error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getUsers,
    getStats,
    toggleUserStatus,
    deleteUser,
    getReports,
    updateReport,
    createReport
};
