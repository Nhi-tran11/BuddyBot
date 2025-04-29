const router = require('express').Router();
const Assignment = require('../model/Assignment');
const auth = require('../middleware/auth');

// Middleware to check if user is parent
const isParent = (req, res, next) => {
    if (req.user.role !== 'parent') {
        return res.status(403).json({ message: 'Access denied. Parent only.' });
    }
    next();
};

// Create new assignment
router.post('/create', auth, isParent, async (req, res) => {
    try {
        const { title, description, assignedTo, dueDate } = req.body;
        
        const assignment = new Assignment({
            title,
            description,
            assignedTo,
            assignedBy: req.user.id,
            dueDate,
            aiGenerated: false
        });

        await assignment.save();
        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating assignment', error: error.message });
    }
});


// Get assignments (for both parent and child)
router.get('/assigned', async (req, res) => {
    try {
        let assignments;

        // Mock data for testing
        const createMockAssignments = () => {
            const mockData = [
                {
                    _id: '60d0fe4f5311236168a109ca',
                    title: 'Clean your room',
                    description: 'Make your bed and organize your toys',
                    status: 'pending',
                    dueDate: new Date(Date.now() + 86400000), // tomorrow
                    createdAt: new Date(),
                    aiGenerated: false
                },
                {
                    _id: '60d0fe4f5311236168a109cb',
                    title: 'Complete homework',
                    description: 'Finish math worksheets pages 10-12',
                    status: 'in-progress',
                    dueDate: new Date(Date.now() + 172800000), // day after tomorrow
                    createdAt: new Date(Date.now() - 86400000), // yesterday
                    aiGenerated: false
                },
                {
                    _id: '60d0fe4f5311236168a109cc',
                    title: 'Practice piano',
                    description: 'Practice scales and new song for 30 minutes',
                    status: 'completed',
                    dueDate: new Date(Date.now() - 86400000), // yesterday
                    createdAt: new Date(Date.now() - 172800000), // 2 days ago
                    aiGenerated: true
                }
            ];
            return mockData.map(item => ({
                ...item,
                assignedTo: {
                    _id: '60d0fe4f5311236168a109cd',
                    username: 'ChildUser',
                    childName: 'Child Name'
                },
                assignedBy: {
                    _id: '60d0fe4f5311236168a109ce',
                    username: 'ParentUser'
                }
            }));
        };

        assignments = createMockAssignments();
        
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assignments', error: error.message });
    }
});

// Update assignment status
router.put('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const assignment = await Assignment.findById(req.params.id);
        
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        
        // Only allow child to update their own assignments
        if (req.user.role === 'child' && assignment.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        assignment.status = status;
        await assignment.save();
        
        res.json(assignment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating assignment', error: error.message });
    }
});

// Delete assignment (parent only)
router.delete('/:id', auth, isParent, async (req, res) => {
    try {
        const assignment = await Assignment.findOneAndDelete({
            _id: req.params.id,
            assignedBy: req.user.id
        });
        
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        
        res.json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting assignment', error: error.message });
    }
});

module.exports = router;