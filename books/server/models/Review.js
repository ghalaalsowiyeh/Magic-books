const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    name: { type: String, required: true },
    book_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Book', 
        required: true 
    },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', ReviewSchema);
