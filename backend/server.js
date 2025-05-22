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
    const { username, password } = req.body;
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
    const { email, username } = req.body;
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
            res.json({ message: 'Your account is created successfully', user: result });
        })
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({ message: err.message });
            } else {
                res.status(500).json({ error: err.message });
            }
        });
})

app.get('/session/current-user', (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: 'Please login first to generate assignments for your monster' });
    }
    const user = {
        username: req.session.user.username,
        role: req.session.user.role,
        isParent: req.session.user.role === 'parent',
        isChild: req.session.user.role === 'child'
    };
    return res.status(200).json({
        user: user,
        isLoggedIn: true
    });
})


app.get('/session/user-children', async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: 'Please login first' });
        }

        // Find children linked to the logged-in parent
        const children = await User.find({ parentId: req.session.user._id });

        // Check if there are any children associated with this parent
        if (children.length === 0) {

            return res.status(200).json({
                children: [],
                message: "You don't have any child accounts yet. Please sign up a child account first."

            });
        }
        // Check if user is a parent
        if (req.session.user.role !== 'parent') {
            return res.status(403).json({ message: 'Only parents can view their children' });
        }
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


app.get('/assignments', async (req, res) => {

    try {
        // Check if user is logged in
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: 'Please log in first' });
        }
        const showAssignments = req.query.showAssignments === 'true';
        if (!showAssignments) {
            return res.status(400).json({ message: 'showAssignments query parameter is required' });
        }

        let assignments;

        if (req.session.user.role === 'child') {
            // Get assignments assigned to this child
            assignments = await Assignment.find({
                assignedTo: req.session.user._id
            }).sort({ dueDate: 1 });
        } else if (req.session.user.role === 'parent') {
            // Get assignments created by this parent
            assignments = await Assignment.find({
                assignedBy: req.session.user._id
            }).sort({ dueDate: 1 });
        }

        res.status(200).json({
            assignments,
            userRole: req.session.user.role
        });
    } catch (error) {
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

app.get('/assignments', async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: 'Please log in first' });
        }
        const showAssignments = req.query.showAssignments === 'true';
        if (!showAssignments) {
            return res.status(400).json({ message: 'showAssignments query parameter is required' });
        }

        let assignments;

        if (req.session.user.role === 'child') {
            // Get assignments assigned to this child
            assignments = await Assignment.find({
                assignedTo: req.session.user._id  
            }).sort({ dueDate: 1 });
        } else if (req.session.user.role === 'parent') {
            // Get assignments created by this parent
            assignments = await Assignment.find({
                assignedBy: req.session.user.user._id 
            }).sort({ dueDate: 1 });
        }

        res.status(200).json({
            assignments,
            userRole: req.session.user.role
        });
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({ message: 'Server error fetching assignments' });
    }
});

// Endpoint to mark assignment as completed
app.put('/assignments/:id/complete', async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: 'Please log in first' });
        }

        if (req.session.user.role !== 'child') {
            return res.status(403).json({ message: 'Only children can complete assignments' });
        }

        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        if (assignment.assignedTo !== req.session.user.username) {
            return res.status(403).json({ message: 'This assignment is not assigned to you' });
        }

        assignment.completed = true;
        assignment.completedDate = new Date();
        await assignment.save();

        res.status(200).json({ message: 'Assignment marked as completed', assignment });
    } catch (error) {
        console.error('Error completing assignment:', error);
        res.status(500).json({ message: 'Server error completing assignment' });
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

// Get assignment by ID
app.get('/assignments/:id', async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        res.status(200).json(assignment);
    } catch (error) {
        console.error('Error fetching assignment:', error);
        res.status(500).json({ message: 'Server error fetching assignment' });
    }
});
app.put('/update-assignment', async (req, res) => {
    try {
        const { assignmentId, score } = req.body;
        const assignment = await Assignment.findByIdAndUpdate(assignmentId, {
            score: score,
            status: 'completed'
        }, { new: true });

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        res.status(200).json({ message: 'Assignment updated successfully', assignment });
    } catch (error) {
        console.error('Error updating assignment:', error);
        res.status(500).json({ message: 'Server error updating assignment' });
    }
});
app.get('/assignments/completed', async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: 'Please log in first' });
        }
        const showcompletedAssignments = req.query.completedshowAssignments === 'true';
        if (!showcompletedAssignments) {
            return res.status(400).json({ message: 'showcompletedAssignments query parameter is required' });
        }

        let assignments;

        if (req.session.user.role === 'child') {
            // Get assignments assigned to this child
            assignments = await Assignment.find({
                assignedTo: req.session.user._id,
                status: 'completed'
            }).sort({ dueDate: 1 });
        } else if (req.session.user.role === 'parent') {
            // Get assignments created by this parent
            assignments = await Assignment.find({
                assignedBy: req.session.user.user._id ,
                status: 'completed'
            }).sort({ dueDate: 1 });
        }

        res.status(200).json({
            assignments,
            userRole: req.session.user.role
        });
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({ message: 'Server error fetching assignments' });
    }
});
app.get('/assignments/pending', async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: 'Please log in first' });
        }
        const showpendingAssignments = req.query.pendingshowAssignments === 'true';
        if (!showpendingAssignments) {
            return res.status(400).json({ message: 'showpendingAssignments query parameter is required' });
        }

        let assignments;

        if (req.session.user.role === 'child') {
            // Get assignments assigned to this child
            assignments = await Assignment.find({
                assignedTo: req.session.user._id,
                status: 'pending'
            }).sort({ dueDate: 1 });
        } else if (req.session.user.role === 'parent') {
            // Get assignments created by this parent
            assignments = await Assignment.find({
                assignedBy: req.session.user.user._id ,
                status: 'pending'
            }).sort({ dueDate: 1 });
        }

        res.status(200).json({
            assignments,
            userRole: req.session.user.role
        });
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({ message: 'Server error fetching assignments' });
    }
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
