const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookOffered: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    bookRequested: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
        default: 'pending'
    },
    message: {
        type: String,
        maxlength: [500, 'Message cannot exceed 500 characters'],
        default: ''
    },
    requesterConfirmed: {
        type: Boolean,
        default: false
    },
    receiverConfirmed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
tradeSchema.index({ requester: 1 });
tradeSchema.index({ receiver: 1 });
tradeSchema.index({ status: 1 });

// Auto-complete trade when both parties confirm
tradeSchema.pre('save', function (next) {
    if (this.requesterConfirmed && this.receiverConfirmed && this.status === 'accepted') {
        this.status = 'completed';
        this.completedAt = new Date();
    }
    next();
});

module.exports = mongoose.model('Trade', tradeSchema);
