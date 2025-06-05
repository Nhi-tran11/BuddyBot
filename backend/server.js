
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const User = require('./model/User');
const app = express();
const Assignment = require('./model/Assignment');
const quizRoutes = require('./routes/quizRoutes');
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


const session = require('express-session');

// Middleware
app.use(cors({
    origin: ['*', 'http://localhost:5173'],
    credentials: true
}));
app.use(express.json());
app.use('/api/quiz', quizRoutes);
const lessonRoutes = require('./routes/lessonRoutes'); // ✅ New
app.use('/api/lessons', lessonRoutes);                 // ✅ New

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

// Endpoint for user login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (user) {
            // Check if the password matches
            if (user.password === password) {
                // Store user info in session
                req.session.user = user;
                req.session.save(err => {
                    if (err) console.error('Session save error:', err);
                    // Log session info for debugging
                    console.log('Session:', req.session);
                    console.log('Session:', req.session.id);
                    // Respond with success and user info (excluding sensitive data)
                    return res.json({ message: 'Login successful', user: { username: user.username, role: user.role } });
                });
            } else {
                // Password is incorrect
                return res.status(400).json({ message: 'Password is incorrect' });
            }
        } else {
            // User not found
            return res.status(400).json({ message: 'User not found' });
        }
    } catch (err) {
        // Handle server errors
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Server error during login' });
    }
});

// Endpoint to sign up a child account
app.post('/signupChild', (req, res) => {
    const { username, password } = req.body; // Extract username and password from request body

    // Check if the username is already taken
    User.findOne({ username })
        .then(existingUser => {
            if (existingUser) {
                // If username exists, reject the request
                return Promise.reject({ status: 400, message: 'Username already taken' });
            }
            // If username is available, create the child account with role 'child'
            return User.create({
                ...req.body,
                role: 'child',  // Ensure the role is set as child
            });
        })
        // Respond with success message and created user info
        .then(result => res.json({ message: 'Child account created successfully', user: result }))
        .catch(err => {
            // Handle errors and send appropriate response
            if (err.status) {
                res.status(err.status).json({ message: err.message });
            } else {
                res.status(500).json({ error: err.message });
            }
        });
});

// Endpoint for user signup (parent account)
app.post('/signup', (req, res) => {
    const { email, username } = req.body;
    // Check if a user with the same email already exists
    User.findOne({ email })
        .then(existingUser => {
            if (existingUser) {
                // If email is already in use, reject the request
                return Promise.reject({ status: 400, message: 'Email already in use' });
            }
            // Check if the username is already taken
            return User.findOne({ username });
        })
        .then(existingUsername => {
            if (existingUsername) {
                // If username is already taken, reject the request
                return Promise.reject({ status: 400, message: 'Username already taken' });
            }
            // If both checks pass, create the new user
            return User.create(req.body);
        })
        .then(result => {
            // Respond with success message and created user info
            res.json({ message: 'Your account is created successfully', user: result });
        })
        .catch(err => {
            // Handle errors and send appropriate response
            if (err.status) {
                res.status(err.status).json({ message: err.message });
            } else {
                res.status(500).json({ error: err.message });
            }
        });
});

// Endpoint to get the current logged-in user's session info
app.get('/session/current-user', (req, res) => {
    // Check if the user is logged in (session exists)
    if (!req.session || !req.session.user) {
        // If not logged in, return 401 Unauthorized
        return res.status(401).json({ message: 'Please login first to generate assignments for your monster' });
    }
    // Prepare user info to send (do not send sensitive data)
    const user = {
        username: req.session.user.username,
        role: req.session.user.role,
        isParent: req.session.user.role === 'parent',
        isChild: req.session.user.role === 'child'
    };
    // Respond with user info and logged-in status
    return res.status(200).json({
        user: user,
        isLoggedIn: true
    });
});


// Endpoint to get all children accounts linked to the current parent session
app.get('/session/user-children', async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: 'Please login first' });
        }

        // Find children linked to the logged-in parent
        const children = await User.find({ parentId: req.session.user._id });

        // If no children are associated with this parent, return an empty array and message
        if (children.length === 0) {
            return res.status(200).json({
                children: [],
                message: "You don't have any child accounts yet. Please sign up a child account first."
            });
        }

        // Only allow parents to view their children
        if (req.session.user.role !== 'parent') {
            return res.status(403).json({ message: 'Only parents can view their children' });
        }

        // Store children info in session for frontend access (optional)
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

// Endpoint to log out the current user and destroy the session
app.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy(err => {
        if (err) {
            console.error('Session destruction error:', err);
            return res.status(500).json({ message: 'Error logging out' });
        }
        // Clear the session cookie
        res.clearCookie('connect.sid');
        return res.status(200).json({ message: 'Logged out successfully' });
    });
});

// Endpoint to get all assignments for the current user (parent or child)
app.get('/assignments', async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: 'Please log in first' });
        }

        // Check if the showAssignments query parameter is provided and true
        const showAssignments = req.query.showAssignments === 'true';
        if (!showAssignments) {
            return res.status(400).json({ message: 'showAssignments query parameter is required' });
        }

        let assignments;

        // If the user is a child, fetch assignments assigned to them
        if (req.session.user.role === 'child') {
            assignments = await Assignment.find({
                assignedTo: req.session.user._id
            }).sort({ dueDate: 1 });
        } 
        // If the user is a parent, fetch assignments they created
        else if (req.session.user.role === 'parent') {
            assignments = await Assignment.find({
                assignedBy: req.session.user._id
            }).sort({ dueDate: 1 });
        }

        // Respond with the assignments and the user's role
        res.status(200).json({
            assignments,
            userRole: req.session.user.role
        });
    } catch (error) {
        // Handle server errors
        console.error('Error fetching assignments:', error);
        res.status(500).json({ message: 'Server error fetching assignments' });
    }
});



// Endpoint to handle prompt queries
app.post('/query-prompt', async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: 'Please log in first' });
        }

        // Check if the user has parent role
        if (req.session.user.role !== 'parent') {
            return res.status(403).json({ message: 'Only parents can create assignments' });
        }
        const { prompt, subject, ageRange, assignedTo, difficulty } = req.body;



        // Validate input
        if (!prompt || !subject || !ageRange || !assignedTo || !difficulty) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // This would normally require importing your App.js module
        // For this example, we're creating a placeholder for the actual implementation
        const response = await queryPrompt(req.body.prompt, req.body.subject, req.body.ageRange, req.body.difficulty);

        const questions = parseAIResponseToQuestions(response);
        // 3. Create a new assignment
        const newAssignment = new Assignment({
            title: req.body.title || `${subject} Assignment - ${new Date().toLocaleDateString()}`,
            description: req.body.description || `AI-generated ${subject} assignment for ${ageRange} age range`,
            questions: questions,
            difficulty: difficulty,
            assignedTo,
            assignedBy: req.session.user._id, // Current logged-in parent's ID
            subject: subject,
            dueDate: req.body.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default: 1 week from now
            status: 'pending',

        });
        // Save the assignment to the database
        await newAssignment.save();
        res.status(201).json({
            response: response,
            message: 'Assignment created successfully',
            assignment: newAssignment,
            debugquestions: questions
        });

    } catch (error) {
        console.error('Error processing prompt:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing your prompt',
            error: error.message
        });
    }
});

// Placeholder for the actual queryPrompt function that would be imported
async function queryPrompt(prompt, subject, ageRange, difficulty) {
    // Format the content with all parameters
    const formattedContent = [
        {
            parts: [
                {
                    text: `Generate muitiple choice questions for a ${subject} topic, appropriate for ages ${ageRange} and ${difficulty}.\n base on request of Prompt: ${prompt}.Format your response as a numbered list (1, 2, 3) with each question and options anwers with ((a), (b), (c), (d)) in different lines and final result with (answer:). Provide the response without any characters and no introduction.`,
                }
            ]
        }
    ];

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: formattedContent
    });

    console.log(response.text);
    return response.text;
}



app.get('/assignments/:id', async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: 'Please log in first' });
        }

        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        res.status(200).json({ assignment });
    } catch (error) {
        console.error('Error fetching assignment:', error);
        res.status(500).json({ message: 'Server error fetching assignment' });
    }
});
function parseAIResponseToQuestions(aiResponse) {
    if (!aiResponse || typeof aiResponse !== 'string') return [];

    // Split into question blocks by number (e.g., "1. ...", "2. ...")
    const questionBlocks = aiResponse.split(/\n(?=\d+\.\s)/).map(block => block.trim()).filter(Boolean);

    return questionBlocks.map(block => {
        // Extract the question (first line after number)
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
        let questionLine = lines[0];
        // Remove leading number and dot
        questionLine = questionLine.replace(/^\d+\.\s*/, '');

        // Extract options (lines starting with (A), (B), etc.)
        const options = lines.slice(1)
            .map(opt => {
                const match = opt.match(/^(?:\([a-dA-D]\)|[a-dA-D]\))\s+(.+)$/);
                return match ? match[1].trim() : null;
            })
            .filter(Boolean);
        const answerLine = lines.find(line => /^\(answer:\s*[a-dA-D]\)$/i.test(line));
        let answer = null;
        if (answerLine) {
        const answerMatch = answerLine.match(/^\(answer:\s*([a-dA-D])\)$/i);
            if (answerMatch) {
                answer = answerMatch[1].toUpperCase();
            }
        }
        return {
            question: questionLine,
            options: options,
            answer: answer
        };
    });
}
// Endpoint to update an assignment's score and mark as completed
app.put('/update-assignment', async (req, res) => {
    try {
        const { assignmentId, score } = req.body;
        // Update the assignment with the given ID, set score and status to 'completed'
        const assignment = await Assignment.findByIdAndUpdate(assignmentId, {
            score: score,
            status: 'completed'
        }, { new: true });

        if (!assignment) {
            // If assignment not found, return 404
            return res.status(404).json({ message: 'Assignment not found' });
        }
        // Respond with success and updated assignment
        res.status(200).json({ message: 'Assignment updated successfully', assignment });
    } catch (error) {
        // Handle server errors
        console.error('Error updating assignment:', error);
        res.status(500).json({ message: 'Server error updating assignment' });
    }
});

//Endpoint to get all completed assignments for the current user (parent or child)
app.get('/completedAssignments', async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: 'Please log in first' });
        }
        // Check if the showCompletedAssignments query parameter is provided and true
        const showCompletedAssignments = req.query.showCompletedAssignments === 'true';
        if (!showCompletedAssignments) {
            return res.status(400).json({ message: 'showCompletedAssignments query parameter is required' });
        }

        let assignments;

        if (req.session.user.role === 'child') {
            // Get assignments assigned to this child with status 'completed'
            assignments = await Assignment.find({
                assignedTo: req.session.user._id,
                status: 'completed'
            });
        } else if (req.session.user.role === 'parent') {
            // Get assignments created by this parent with status 'completed'
            assignments = await Assignment.find({
                assignedBy: req.session.user._id,
                status: 'completed'
            });

        }

        // Respond with the completed assignments and the user's role
        res.status(200).json({
            assignments,
            userRole: req.session.user.role
        });
    } catch (error) {
        // Handle server errors
        console.error('Error fetching assignments:', error);
        res.status(500).json({ message: 'Server error fetching assignments' });
    }
});

// Endpoint to get all pending assignments for the current user (parent or child)
app.get('/pendingAssignments', async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: 'Please log in first' });
        }
        // Check if the showPendingAssignments query parameter is provided and true

        const showPendingAssignments = req.query.showPendingAssignments === 'true';
        if (!showPendingAssignments) {
            return res.status(400).json({ message: 'showPendingAssignments query parameter is required' });
        }

        let assignments;

        // If the user is a child, fetch their pending assignments
        if (req.session.user.role === 'child') {
            assignments = await Assignment.find({
                assignedTo: req.session.user._id,
                status: 'pending'
            });
        } 
        // If the user is a parent, fetch pending assignments they created
        else if (req.session.user.role === 'parent') {
            assignments = await Assignment.find({
                assignedBy: req.session.user._id,
                status: 'pending'
            });
        }

        // Respond with the assignments and the user's role
        res.status(200).json({
            assignments,
            userRole: req.session.user.role
        });
    } catch (error) {
        // Handle server errors
        console.error('Error fetching assignments:', error);
        res.status(500).json({ message: 'Server error fetching assignments' });
    }
});

// Endpoint to delete an assignment by its ID
app.delete('/delete-assignment/:id', async (req, res) => {
    try {
        const assignmentId = req.params.id;
        // Find and delete the assignment by ID
        const assignment = await Assignment.findByIdAndDelete(assignmentId);
        if (!assignment) {
            // If assignment not found, return 404
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Respond with success message
        res.status(200).json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        // Handle server errors
        console.error('Error deleting assignment:', error);
        res.status(500).json({ message: 'Server error deleting assignment' });
    }
});
let server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = {app, server};
