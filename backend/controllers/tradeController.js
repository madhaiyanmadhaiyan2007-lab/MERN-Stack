const Trade = require('../models/Trade');
const Book = require('../models/Book');
const { validationResult } = require('express-validator');

// @desc    Create a trade request
// @route   POST /api/trades
// @access  Private
const createTrade = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { bookOffered, bookRequested, message } = req.body;

        // Validate books exist
        const offeredBook = await Book.findById(bookOffered);
        const requestedBook = await Book.findById(bookRequested);

        if (!offeredBook) {
            return res.status(404).json({ message: 'Book offered not found' });
        }

        if (!requestedBook) {
            return res.status(404).json({ message: 'Book requested not found' });
        }

        // Validate ownership
        if (offeredBook.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You can only offer your own books' });
        }

        if (requestedBook.owner.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot request your own book' });
        }

        // Check if books are available
        if (!offeredBook.isAvailable) {
            return res.status(400).json({ message: 'Your offered book is not available for trade' });
        }

        if (!requestedBook.isAvailable) {
            return res.status(400).json({ message: 'The requested book is not available for trade' });
        }

        // Check for existing pending trade
        const existingTrade = await Trade.findOne({
            requester: req.user._id,
            bookRequested,
            status: 'pending'
        });

        if (existingTrade) {
            return res.status(400).json({ message: 'You already have a pending trade for this book' });
        }

        const trade = await Trade.create({
            requester: req.user._id,
            receiver: requestedBook.owner,
            bookOffered,
            bookRequested,
            message
        });

        const populatedTrade = await Trade.findById(trade._id)
            .populate('requester', 'name avatar')
            .populate('receiver', 'name avatar')
            .populate('bookOffered', 'title author coverImage condition')
            .populate('bookRequested', 'title author coverImage condition');

        res.status(201).json(populatedTrade);
    } catch (error) {
        console.error('Create trade error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user's trades
// @route   GET /api/trades
// @access  Private
const getTrades = async (req, res) => {
    try {
        const { status, type } = req.query;

        let query = {
            $or: [
                { requester: req.user._id },
                { receiver: req.user._id }
            ]
        };

        if (status) {
            query.status = status;
        }

        if (type === 'incoming') {
            query = { receiver: req.user._id };
            if (status) query.status = status;
        } else if (type === 'outgoing') {
            query = { requester: req.user._id };
            if (status) query.status = status;
        }

        const trades = await Trade.find(query)
            .populate('requester', 'name avatar')
            .populate('receiver', 'name avatar')
            .populate('bookOffered', 'title author coverImage condition')
            .populate('bookRequested', 'title author coverImage condition')
            .sort({ updatedAt: -1 });

        res.json(trades);
    } catch (error) {
        console.error('Get trades error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single trade
// @route   GET /api/trades/:id
// @access  Private
const getTrade = async (req, res) => {
    try {
        const trade = await Trade.findById(req.params.id)
            .populate('requester', 'name avatar email location')
            .populate('receiver', 'name avatar email location')
            .populate('bookOffered', 'title author coverImage condition description')
            .populate('bookRequested', 'title author coverImage condition description');

        if (!trade) {
            return res.status(404).json({ message: 'Trade not found' });
        }

        // Only participants can view trade details
        if (trade.requester._id.toString() !== req.user._id.toString() &&
            trade.receiver._id.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view this trade' });
        }

        res.json(trade);
    } catch (error) {
        console.error('Get trade error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update trade status (accept/reject)
// @route   PUT /api/trades/:id
// @access  Private
const updateTrade = async (req, res) => {
    try {
        const { status, requesterConfirmed, receiverConfirmed } = req.body;

        const trade = await Trade.findById(req.params.id);

        if (!trade) {
            return res.status(404).json({ message: 'Trade not found' });
        }

        const isRequester = trade.requester.toString() === req.user._id.toString();
        const isReceiver = trade.receiver.toString() === req.user._id.toString();

        if (!isRequester && !isReceiver) {
            return res.status(403).json({ message: 'Not authorized to update this trade' });
        }

        // Handle status updates
        if (status) {
            // Only receiver can accept/reject pending trades
            if (trade.status === 'pending' && (status === 'accepted' || status === 'rejected')) {
                if (!isReceiver) {
                    return res.status(403).json({ message: 'Only the trade receiver can accept or reject' });
                }
                trade.status = status;

                // If accepted, mark books as unavailable
                if (status === 'accepted') {
                    await Book.findByIdAndUpdate(trade.bookOffered, { isAvailable: false });
                    await Book.findByIdAndUpdate(trade.bookRequested, { isAvailable: false });
                }
            }

            // Either party can cancel
            if (status === 'cancelled' && trade.status === 'pending') {
                trade.status = 'cancelled';
            }
        }

        // Handle confirmations for accepted trades
        if (trade.status === 'accepted') {
            if (requesterConfirmed !== undefined && isRequester) {
                trade.requesterConfirmed = requesterConfirmed;
            }
            if (receiverConfirmed !== undefined && isReceiver) {
                trade.receiverConfirmed = receiverConfirmed;
            }
        }

        await trade.save();

        const populatedTrade = await Trade.findById(trade._id)
            .populate('requester', 'name avatar')
            .populate('receiver', 'name avatar')
            .populate('bookOffered', 'title author coverImage condition')
            .populate('bookRequested', 'title author coverImage condition');

        res.json(populatedTrade);
    } catch (error) {
        console.error('Update trade error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get trade statistics for user
// @route   GET /api/trades/stats
// @access  Private
const getTradeStats = async (req, res) => {
    try {
        const userId = req.user._id;

        const [pending, accepted, completed, rejected] = await Promise.all([
            Trade.countDocuments({
                $or: [{ requester: userId }, { receiver: userId }],
                status: 'pending'
            }),
            Trade.countDocuments({
                $or: [{ requester: userId }, { receiver: userId }],
                status: 'accepted'
            }),
            Trade.countDocuments({
                $or: [{ requester: userId }, { receiver: userId }],
                status: 'completed'
            }),
            Trade.countDocuments({
                $or: [{ requester: userId }, { receiver: userId }],
                status: 'rejected'
            })
        ]);

        res.json({
            pending,
            accepted,
            completed,
            rejected,
            total: pending + accepted + completed + rejected
        });
    } catch (error) {
        console.error('Get trade stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createTrade,
    getTrades,
    getTrade,
    updateTrade,
    getTradeStats
};
