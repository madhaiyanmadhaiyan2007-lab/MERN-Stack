const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const {
    sendMessage,
    getMessages,
    getUnreadCount
} = require('../controllers/messageController');

// Validation rules
const messageValidation = [
    body('tradeId')
        .notEmpty().withMessage('Trade ID is required')
        .isMongoId().withMessage('Invalid trade ID'),
    body('content')
        .trim()
        .notEmpty().withMessage('Message content is required')
        .isLength({ max: 1000 }).withMessage('Message cannot exceed 1000 characters')
];

// All routes are protected
router.use(protect);

router.get('/unread', getUnreadCount);
router.get('/:tradeId', getMessages);
router.post('/', messageValidation, sendMessage);

module.exports = router;
