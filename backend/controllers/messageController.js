const Message = require('../models/Message');
const Trade = require('../models/Trade');
const { validationResult } = require('express-validator');

// @desc    Send a message in a trade
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { tradeId, content } = req.body;

        // Verify trade exists and user is participant
        const trade = await Trade.findById(tradeId);

        if (!trade) {
            return res.status(404).json({ message: 'Trade not found' });
        }

        const isParticipant =
            trade.requester.toString() === req.user._id.toString() ||
            trade.receiver.toString() === req.user._id.toString();

        if (!isParticipant) {
            return res.status(403).json({ message: 'Not authorized to send messages in this trade' });
        }

        const message = await Message.create({
            trade: tradeId,
            sender: req.user._id,
            content
        });

        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'name avatar');

        res.status(201).json(populatedMessage);
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get messages for a trade
// @route   GET /api/messages/:tradeId
// @access  Private
const getMessages = async (req, res) => {
    try {
        const trade = await Trade.findById(req.params.tradeId);

        if (!trade) {
            return res.status(404).json({ message: 'Trade not found' });
        }

        const isParticipant =
            trade.requester.toString() === req.user._id.toString() ||
            trade.receiver.toString() === req.user._id.toString();

        if (!isParticipant && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view these messages' });
        }

        const messages = await Message.find({ trade: req.params.tradeId })
            .populate('sender', 'name avatar')
            .sort({ createdAt: 1 });

        // Mark messages as read for current user
        await Message.updateMany(
            {
                trade: req.params.tradeId,
                sender: { $ne: req.user._id },
                isRead: false
            },
            { isRead: true }
        );

        res.json(messages);
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get unread message count
// @route   GET /api/messages/unread
// @access  Private
const getUnreadCount = async (req, res) => {
    try {
        // Get all trades where user is participant
        const trades = await Trade.find({
            $or: [
                { requester: req.user._id },
                { receiver: req.user._id }
            ]
        }).select('_id');

        const tradeIds = trades.map(t => t._id);

        const unreadCount = await Message.countDocuments({
            trade: { $in: tradeIds },
            sender: { $ne: req.user._id },
            isRead: false
        });

        res.json({ unreadCount });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    sendMessage,
    getMessages,
    getUnreadCount
};
