const mongoose = require('mongoose');



const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    poster_path: { type: String, required: true },

});


module.exports = mongoose.model('Book', taskSchema);
