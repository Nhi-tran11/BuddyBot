const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const session = require('express-session');
const User = require('./model/User');
const app = express();
const Assignment = require('./model/Assignment'); // Fixed incorrect import

// Middleware
app.use(cors());
app.use(express.json());

// Session middleware
app.use(session({
    secret: process.env.JWT_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Routes
const userRoutes = require('./routes/User');
const assignmentRoutes = require('./routes/Assignment'); // Fixed incorrect import

// Mount routes
// app.use('/api/users', userRoutes);
// app.use('/api/assignments', assignmentRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT;
app.post('/assignment', (req, res) => {
    const { title, description, assignedTo, assignedBy, dueDate } = req.body;
    // Create a new assignment
    Assignment.create({
        title,
        description,
        assignedTo,
        assignedBy,
        dueDate
    })
    .then(result => res.json({ message: 'Assignment created successfully', assignment: result }))
    .catch(err => res.status(500).json({ error: err.message }));
})
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username})
    .then(user => {
        if (user) {
            if(user.password === password) {
                return res.json({ message: 'Login successful', user });
            }
            else{
                return res.status(401).json({ message: 'password is incorrect' });
            }
        }
        else{
            return res.status(404).json({ message: 'User not found' });
        }
    })
    .catch(err => res.status(500).json({ error: err.message }));
})
app.post('/signupChild', (req, res) => {
    // const { username, password } = req.body;
    
    // First create the child account
    User.create({
        ...req.body,
        role: 'child'  // Ensure the role is set as child
    })
  
    .then(result => res.json({ message: 'Child account created successfully', user: result }))
    .catch(err => res.status(500).json({ error: err.message }))
})

app.post('/signup', (req, res) => {
    const {email, username} = req.body;
    // Check if the user already exists
    User.findOne({ email })
    .then(existingUser => {
        if (existingUser) {
            return Promise.reject({ status: 400, message: 'Email already in use' });
        }
        
        // Also check if username already exists
        return User.findOne({ username });
    })
    .then(existingUsername => {
        if (existingUsername) {
            return Promise.reject({ status: 400, message: 'Username already taken' });
        }
        // If both checks pass, continue to create user
        return User.create(req.body);
    })
    .then(result => {
        res.json({message: 'Your account is created successfully', user:result});
    })
    .catch(err => {
        if (err.status) {
            res.status(err.status).json({ message: err.message });
        } else {
            res.status(500).json({ error: err.message });
        }
    });
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

