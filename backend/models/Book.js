const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a book title'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    author: {
        type: String,
        required: [true, 'Please provide the author name'],
        trim: true,
        maxlength: [100, 'Author name cannot exceed 100 characters']
    },
    isbn: {
        type: String,
        trim: true
    },
    genre: {
        type: String,
        required: [true, 'Please select a genre'],
        enum: [
            'Fiction',
            'Non-Fiction',
            'Mystery',
            'Thriller',
            'Romance',
            'Science Fiction',
            'Fantasy',
            'Horror',
            'Biography',
            'History',
            'Self-Help',
            'Children',
            'Young Adult',
            'Comics',
            'Poetry',
            'Other'
        ]
    },
    condition: {
        type: String,
        required: [true, 'Please specify book condition'],
        enum: ['New', 'Like New', 'Very Good', 'Good', 'Acceptable', 'Poor']
    },
    description: {
        type: String,
        maxlength: [1000, 'Description cannot exceed 1000 characters'],
        default: ''
    },
    coverImage: {
        type: String,
        default: ''
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    lookingFor: {
        type: [String],
        default: []
    },
    views: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for search functionality
bookSchema.index({ title: 'text', author: 'text', description: 'text' });
bookSchema.index({ genre: 1 });
bookSchema.index({ owner: 1 });
bookSchema.index({ isAvailable: 1 });

module.exports = mongoose.model('Book', bookSchema);
