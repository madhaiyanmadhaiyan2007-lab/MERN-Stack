const Book = require('../models/Book');
const { validationResult } = require('express-validator');

// @desc    Get all available books
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const query = { isAvailable: true };

        // Filter by genre
        if (req.query.genre) {
            query.genre = req.query.genre;
        }

        // Filter by condition
        if (req.query.condition) {
            query.condition = req.query.condition;
        }

        const books = await Book.find(query)
            .populate('owner', 'name avatar location')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Book.countDocuments(query);

        res.json({
            books,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        console.error('Get books error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Search books
// @route   GET /api/books/search
// @access  Public
const searchBooks = async (req, res) => {
    try {
        const { q, genre, condition } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        let query = { isAvailable: true };

        // Text search
        if (q) {
            query.$text = { $search: q };
        }

        // Genre filter
        if (genre) {
            query.genre = genre;
        }

        // Condition filter
        if (condition) {
            query.condition = condition;
        }

        const books = await Book.find(query)
            .populate('owner', 'name avatar location')
            .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Book.countDocuments(query);

        res.json({
            books,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        console.error('Search books error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
const getBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
            .populate('owner', 'name avatar location bio createdAt');

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Increment views
        book.views += 1;
        await book.save();

        res.json(book);
    } catch (error) {
        console.error('Get book error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a book
// @route   POST /api/books
// @access  Private
const createBook = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, author, isbn, genre, condition, description, coverImage, lookingFor } = req.body;

        const book = await Book.create({
            title,
            author,
            isbn,
            genre,
            condition,
            description,
            coverImage,
            lookingFor,
            owner: req.user._id
        });

        const populatedBook = await Book.findById(book._id)
            .populate('owner', 'name avatar location');

        res.status(201).json(populatedBook);
    } catch (error) {
        console.error('Create book error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private
const updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Check ownership
        if (book.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this book' });
        }

        const { title, author, isbn, genre, condition, description, coverImage, lookingFor, isAvailable } = req.body;

        book.title = title || book.title;
        book.author = author || book.author;
        book.isbn = isbn !== undefined ? isbn : book.isbn;
        book.genre = genre || book.genre;
        book.condition = condition || book.condition;
        book.description = description !== undefined ? description : book.description;
        book.coverImage = coverImage !== undefined ? coverImage : book.coverImage;
        book.lookingFor = lookingFor || book.lookingFor;
        book.isAvailable = isAvailable !== undefined ? isAvailable : book.isAvailable;

        const updatedBook = await book.save();
        const populatedBook = await Book.findById(updatedBook._id)
            .populate('owner', 'name avatar location');

        res.json(populatedBook);
    } catch (error) {
        console.error('Update book error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Check ownership or admin
        if (book.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this book' });
        }

        await Book.findByIdAndDelete(req.params.id);

        res.json({ message: 'Book removed' });
    } catch (error) {
        console.error('Delete book error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user's books
// @route   GET /api/books/user/:userId
// @access  Public
const getUserBooks = async (req, res) => {
    try {
        const books = await Book.find({ owner: req.params.userId })
            .populate('owner', 'name avatar location')
            .sort({ createdAt: -1 });

        res.json(books);
    } catch (error) {
        console.error('Get user books error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get my books
// @route   GET /api/books/my
// @access  Private
const getMyBooks = async (req, res) => {
    try {
        const books = await Book.find({ owner: req.user._id })
            .sort({ createdAt: -1 });

        res.json(books);
    } catch (error) {
        console.error('Get my books error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getBooks,
    searchBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
    getUserBooks,
    getMyBooks
};
