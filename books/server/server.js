const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/books');
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Routes
app.use('/api/books', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
// Database connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1); // Exit process with failure code if database connection fails
    });

// Error handling middleware for uncaught errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Internal server error', error: err.message });
});
