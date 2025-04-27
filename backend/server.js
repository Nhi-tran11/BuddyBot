const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const User = require('./model/User');
const app = express();
const Assignment = require('./model/Assignment');
const session = require('express-session');

// Middleware
app.use(cors({
    origin: ['*', 'http://localhost:5173'], 
    credentials: true
}));
app.use(express.json());


app.use(session({
  secret: 'your_secret_key',
  resave: true,
  saveUninitialized: true,
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT;

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        // Check if the user exists
        if (user) {
            // Check if the password is correct
            if (user.password === password) {
                // Store user info in session
                req.session.user = user;
                req.session.save(err => {
                    if (err) console.error('Session save error:', err);
                    console.log('Session:', req.session);
                    console.log('Session:', req.session.id);
                    return res.json({ message: 'Login successful', user: { username: user.username, role: user.role } });
                });
            } else {
                return res.status(400).json({ message: 'Password is incorrect' });
            }
        } else {
            return res.status(400).json({ message: 'User not found' });
        }
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Server error during login' });
    }
})


app.post('/signupChild', (req, res) => {
    // const { username, password } = req.body;
    const {username, password} = req.body;
    User.findOne({ username })
    .then(existingUser => {
        if (existingUser) {
            return Promise.reject({ status: 400, message: 'Username already taken' });
        }
        // If the username is available, create the child account
        return User.create({
            ...req.body,
            role: 'child',  // Ensure the role is set as child
  
        });
    })
  
    .then(result => res.json({ message: 'Child account created successfully', user: result }))
    .catch(err => {
        if (err.status) {
            res.status(err.status).json({ message: err.message });
        } else {
            res.status(500).json({ error: err.message });
        }
    });
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
app.get('/session/user-children', async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: 'Please log in first' });
        }
        // Check if user is a parent
        if (req.session.user.role !== 'parent') {
            return res.status(403).json({ message: 'Only parents can view their children' });
        }
        // Find children linked to the logged-in parent
        const children = await User.find({ parentId: req.session.user._id });
        // Store children in session for easy access from frontend
        req.session.children = children.map(child => ({
            _id: child._id,
            username: child.username,
            role: child.role
        }));
        // Send the children data back to the client
        res.status(200).json({ children: req.session.children });
    } catch (err) {
        console.error('Error fetching children:', err);
        res.status(500).json({ error: err.message });
    }
});
// AI-Generated Assignment endpoint
app.post('/ai-assignment', async (req, res) => {
    try {
        const { prompt, assignedTo, subject, ageRange, dueDate } = req.body;
    
    // Check if logged in user has parent role
    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: 'Please log in first' });
    }
        if (req.session.user.role !== 'parent') {
            return res.status(403).json({ message: 'Only parents can create assignments' });
        }
            
        
        // Basic validation
        if (!prompt || !assignedTo || !dueDate) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        // Format prompt for the AI
        const formattedPrompt = `Generate ${subject || 'learning'} questions for a child in the age range ${ageRange || '6-8'}. ${prompt}`;
        
        // Call LLM service to generate content
        const aiResponse = await callLLMService(formattedPrompt);
        
        // Parse the AI response into structured questions
        const questions = parseAIResponseToQuestions(aiResponse);
        
        // Create the assignment in the database
        const assignment = await Assignment.create({
            title: `AI Assignment: ${subject || prompt.substring(0, 30)}...`,
            description: `Generated from prompt: "${prompt}"`,
            questions: questions,
            assignedTo,
            assignedBy: req.session.user.username, // Get username from session
            dueDate: new Date(dueDate),
            subject: subject || 'other',
            ageRange: ageRange || '6-8',
            aiGenerated: true,
            aiPrompt: prompt
        });
        
        res.status(201).json({ 
            message: 'AI assignment created successfully', 
            assignment 
        });
    } catch (err) {
        console.error('Error creating AI assignment:', err);
        res.status(500).json({ error: err.message });
    }
});

// Helper function to call LLM service (placeholder)
async function callLLMService(prompt) {
    // This is a placeholder. In production, you'd connect to OpenAI or another LLM provider
    try {
        
        
        // For demonstration, return a mock response
        return `
        1. What is 2 + 3?
        A) 4
        B) 5
        C) 6
        D) 7
        Answer: B
        
        2. Count the apples: 🍎🍎🍎. How many are there?
        Answer: 3
        
        3. If you have 5 toys and give 2 away, how many do you have left?
        Answer: 3
        `;
    } catch (error) {
        console.error('LLM API error:', error);
        throw new Error('Failed to generate content from AI service');
    }
}

// Helper function to parse AI response into structured questions
function parseAIResponseToQuestions(aiResponse) {
    // This is a simplified parser - you'd need a more robust one in production
    const lines = aiResponse.trim().split('\n');
    const questions = [];
    let currentQuestion = null;
    
    for (const line of lines) {
        // New question starts with a number followed by period
        if (/^\d+\.\s/.test(line)) {
            // Save previous question if exists
            if (currentQuestion) {
                questions.push(currentQuestion);
            }
            
            // Start new question
            currentQuestion = {
                question: line.replace(/^\d+\.\s/, ''),
                options: [],
                type: 'open-ended'
            };
        } 
        // Multiple choice options
        else if (/^[A-D]\)\s/.test(line)) {
            if (currentQuestion) {
                currentQuestion.options.push(line);
                currentQuestion.type = 'multiple-choice';
            }
        }
        // Answer line
        else if (/^Answer:/.test(line)) {
            if (currentQuestion) {
                currentQuestion.answer = line.replace(/^Answer:\s/, '');
            }
        }
    }
    
    // Add the last question
    if (currentQuestion) {
        questions.push(currentQuestion);
    }
    
    return questions;
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

