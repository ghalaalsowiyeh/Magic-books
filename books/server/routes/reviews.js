const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// POST route to add a new review for a book
router.post('/add', async (req, res) => {
    const { name, email, book_id, text } = req.body;

    try {
        const newReview = new Review({
            name,
            email,
            book_id,
            text
        });
        
        await newReview.save();
        res.json({ message: 'Review added successfully', review: newReview });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add review' });
    }
});

// GET route to fetch reviews for a specific book by book_id
router.get('/:book_id', async (req, res) => {
    try {
        const reviews = await Review.find({ book_id: req.params.book_id });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// PUT route to edit an existing review by id
router.put('/:id', async (req, res) => {

    console.log(4);
    const { name, email, text } = req.body;

    try {
        const updatedReview = await Review.findByIdAndUpdate(req.params.id, {
            name,
            email,
            text
        }, { new: true }); // 'new' option returns the updated document

        if (!updatedReview) {
            return res.status(404).json({ error: 'Review not found' });
        }

        res.json({ message: 'Review updated successfully', review: updatedReview });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update review' });
    }
});

// DELETE route to delete a review by id
router.delete('/:id', async (req, res) => {
    try {
     
        const deletedReview = await Review.findByIdAndDelete(req.params.id);

        if (!deletedReview) {
            return res.status(404).json({ error: 'Review not found' });
        }

        res.json({ message: 'Review deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete review' });
    }
});

module.exports = router;
