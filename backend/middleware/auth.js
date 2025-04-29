const auth = async (req, res, next) => {
    try {
        // Check if user session exists
        if (!req.session || !req.session.userId) {
            return res.status(401).json({ 
                message: 'Authentication required' 
            });
        }

        // Add user info to request for use in route handlers
        req.user = {
            id: req.session.userId,
            role: req.session.userRole
        };
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = auth;  