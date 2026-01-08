const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const {
    createTrade,
    getTrades,
    getTrade,
    updateTrade,
    getTradeStats
} = require('../controllers/tradeController');

// Validation rules
const tradeValidation = [
    body('bookOffered')
        .notEmpty().withMessage('Book offered is required')
        .isMongoId().withMessage('Invalid book ID'),
    body('bookRequested')
        .notEmpty().withMessage('Book requested is required')
        .isMongoId().withMessage('Invalid book ID')
];

// All routes are protected
router.use(protect);

router.get('/stats', getTradeStats);
router.get('/', getTrades);
router.get('/:id', getTrade);
router.post('/', tradeValidation, createTrade);
router.put('/:id', updateTrade);

module.exports = router;
