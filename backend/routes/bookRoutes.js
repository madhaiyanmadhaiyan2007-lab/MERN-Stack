const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const {
    getBooks,
    searchBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
    getUserBooks,
    getMyBooks
} = require('../controllers/bookController');

// Validation rules
const bookValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
    body('author')
        .trim()
        .notEmpty().withMessage('Author is required')
        .isLength({ max: 100 }).withMessage('Author name cannot exceed 100 characters'),
    body('genre')
        .notEmpty().withMessage('Genre is required'),
    body('condition')
        .notEmpty().withMessage('Condition is required')
];

// Public routes
router.get('/', getBooks);
router.get('/search', searchBooks);
router.get('/user/:userId', getUserBooks);
router.get('/:id', getBook);

// Protected routes
router.get('/my/books', protect, getMyBooks);
router.post('/', protect, bookValidation, createBook);
router.put('/:id', protect, updateBook);
router.delete('/:id', protect, deleteBook);

module.exports = router;
