const express = require('express');
const router = express.Router();
const Book = require('../models/Book'); 

// Get all tasks
router.get('/', async (req, res) => {
 const movies = await Book.find();

    res.json(movies);
});


router.post('/', async (req, res) => {
    const { title, poster_path } = req.body;

    if (!title || !poster_path) {
        return res.status(400).json({ message: 'Title and poster path are required' });
    }

    try {
        const newBook = new Book({ title, poster_path });
        await newBook.save();
        res.json(newBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete a task
router.delete('/:id', async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.status(204).end();
});

module.exports = router;
