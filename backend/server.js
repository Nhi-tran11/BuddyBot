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

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username})
    .then(user => {
        if (user) {
            if(user.password === password) {
                return res.json({ message: 'Login successful', user });
            }
            else{
                return Promise.reject({status:400,  message: 'Password is incorrect' });
            }
        }
        else{
            return Promise.reject({status:400,  message: 'User not found' });
        }
    })
    .catch(err => {
        if (err.status) {
            res.status(err.status).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'An error occurred during login' });
        }
    });
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
    // First create the child account
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
// Add this after your existing endpoints

const axios = require('axios'); // Add this at the top of your file with other imports

// AI-Generated Assignment endpoint
app.post('/ai-assignment', async (req, res) => {
    try {
        const { username, prompt, assignedTo, assignedBy, subject, ageRange, dueDate } = req.body;
       
        // Check if user is logged in
        User.findOne({ username })
        .then(loggedInUser => {
            if (!loggedInUser) {
                return res.status(401).json({ message: 'Please log in to create assignment' });
            }
            const { username, prompt, assignedTo, assignedBy, subject, ageRange, dueDate } = req.body;
        
            // Basic validation
            if (!prompt || !assignedTo || !assignedBy || !dueDate) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            // Format prompt for the AI
            const formattedPrompt = `Generate ${subject || 'learning'} questions for a child in the age range ${ageRange || '6-8'}. ${prompt}`;
            
            // Call LLM service to generate content
            return callLLMService(formattedPrompt)
                .then(aiResponse => {
                    // Parse the AI response into structured questions
                    const questions = parseAIResponseToQuestions(aiResponse);
                    
                    // Create the assignment in the database
                    return Assignment.create({
                        title: `AI Assignment: ${subject || prompt.substring(0, 30)}...`,
                        description: `Generated from prompt: "${prompt}"`,
                        questions: questions,
                        assignedTo,
                        assignedBy,
                        dueDate: new Date(dueDate),
                        subject: subject || 'other',
                        ageRange: ageRange || '6-8',
                        aiGenerated: true,
                        aiPrompt: prompt
                    });
                })
                .then(assignment => {
                    res.status(201).json({ 
                        message: 'AI assignment created successfully', 
                        assignment 
                    });
                });
        })
        .catch(err => {
            throw err;
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
        // Example using OpenAI-like API (you'll need to replace with actual implementation)
        /*
        const response = await axios.post('https://api.openai.com/v1/completions', {
            model: 'gpt-3.5-turbo',
            prompt: prompt,
            max_tokens: 1000,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.choices[0].text;
        */
        
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

