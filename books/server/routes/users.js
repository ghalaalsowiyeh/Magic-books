const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure the casing matches exactly
const router = express.Router();



// Register
router.post('/register', async (req, res) => {




    const { name, email, password } = req.body;
    
    try {
       
        const hashedPassword = await bcrypt.hash(password.trim(), 12);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
 
   
});

// Login


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log(77);


    try {
        // Find the user by email
        const user = await User.findOne({ email });
        
        // Check if user exists
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        

       
        const isMatch = await bcrypt.compare(password, user.password);


        // Compare password
     
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }


   
        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with token and user ID
        res.json({ token, userId: user._id ,username:user.name});
    } catch (error) {
        console.error(error);
        // Respond with an error message
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});


module.exports = router;
