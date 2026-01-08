const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    getUsers,
    getStats,
    toggleUserStatus,
    deleteUser,
    getReports,
    updateReport,
    createReport
} = require('../controllers/adminController');

// Protected route for creating reports (any user can report)
router.post('/reports', protect, createReport);

// Admin only routes
router.use(protect, admin);

router.get('/users', getUsers);
router.get('/stats', getStats);
router.put('/users/:id/toggle', toggleUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/reports', getReports);
router.put('/reports/:id', updateReport);

module.exports = router;
