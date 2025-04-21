const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', email);

        // For testing purposes, use mock data
        const mockUser = {
            _id: 'mockParentId456',
            role: 'parent',
            username: 'ParentUser',
            email: email,
            password: 'hashedPassword'
        };

        // Create session
        req.session.userId = mockUser._id;
        req.session.userRole = mockUser.role;

        // Create token
        const token = jwt.sign(
            { id: mockUser._id, role: mockUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: mockUser._id,
                role: mockUser.role,
                username: mockUser.username
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Register route
router.post('/register', async (req, res) => {
    try {
        const { username, password, email, role } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            username,
            password: hashedPassword,
            email,
            role,
            ...(req.body.childName && { childName: req.body.childName }),
            ...(req.body.childAge && { childAge: req.body.childAge }),
            ...(req.body.parentId && { parentId: req.body.parentId })
        });

        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;