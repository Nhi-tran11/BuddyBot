import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Assignment.css";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


function Assignment() {


    const [prompt, setPrompt] = useState('');
    const [subject, setSubject] = useState('math');
    const [ageRange, setAgeRange] = useState('6-8');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [children, setChildren] = useState([]);
    const [parentId, setParentId] = useState('');
    const [childId, setChildId] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [difficulty, setDifficulty] = useState('easy');
    const [successMessage, setSuccessMessage] = useState('');


    const navigate = useNavigate();
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch current user data
                const userResponse = await fetch('http://localhost:5000/session/current-user', {
                    credentials: 'include' // Include cookies for session authentication
                });


                if (!userResponse.ok) {
                    const errorData = await userResponse.json();
                    throw new Error(errorData.message || `Authentication failed: ${userResponse.status}`);
                }

                const userData = await userResponse.json();


                if (!userData || !userData.user) {
                    throw new Error('No user data received');
                }


                setCurrentUser(userData.user);

                // Check user role
                if (userData.user.role === 'parent') {
                    setParentId(userData.user._id);

                    // Fetch children for parent
                    const childrenResponse = await fetch('http://localhost:5000/session/user-children', {
                        credentials: 'include'
                    });


                    if (!childrenResponse.ok) {
                        throw new Error(`Failed to fetch children: ${childrenResponse.status}`);
                    }

                    const childrenData = await childrenResponse.json();
                    setChildren(childrenData.children);
                } else if (userData.user.role === 'child') {
                    setChildId(userData.user._id);
                    // For child users, we don't need to fetch children
                    navigate('/ShowAssignment');
                }


            }
            catch (error) {
                // Handle errors
                console.log(error);
                setError(error.message || 'Failed to fetch user data');
                setTimeout(() => {
                    navigate('/login'); // Redirect to login page after showing the error message
                }, 4000);

            }
        };

        fetchUserData();
    }, []);


    // Set the first child as default when children are loaded
    useEffect(() => {
        if (Array.isArray(children) && children.length > 0 && !childId) {
            setChildId(children[0]._id);
        }
    }, [children, childId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {

            if (!childId) {
                throw new Error('Please select a child');
            }

            // Check if prompt is empty
            if (!prompt) {
                throw new Error('Prompt cannot be empty');
            }

            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 7); // Default due date: 1 week

            const response = await fetch('http://localhost:5000/query-prompt', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    prompt,
                    subject,
                    ageRange,
                    difficulty,
                    assignedTo: childId,
                    assignedBy: parentId,
                    dueDate: dueDate.toISOString()
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Request failed: ${response.status}`);
            }

            const data = await response.json();


            // Show success notification or handle next steps
            console.log('Assignment created successfully:', data);
            console.log('Assignment:', data.assignment);
            console.log('Assignment:', data.debugquestions);

            setSuccessMessage('Assignment successfully generated');

            setTimeout(() => {
                navigate('/ShowAssignment');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create assignment');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="ai-assignment-container">
            <div className="ai-assignment-form">
                <h3>Generate an Assignment with AI</h3>
                {error && <div className="error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Subject:</label>
                        <select value={subject} onChange={e => setSubject(e.target.value)}>
                            <option value="math">Math</option>
                            <option value="english">English</option>

                            <option value="science">Science</option>

                        </select>
                        <label>Assign to Child:</label>
                        <select value={childId} onChange={e => setChildId(e.target.value)} required>
                            {Array.isArray(children) && children.map((child) => (
                                <option key={child._id} value={child._id}>
                                    {child.name || child.username}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Age Range:</label>
                        <select value={ageRange} onChange={e => setAgeRange(e.target.value)}>
                            <option value="3-5">3-5 years</option>
                            <option value="6-8">6-8 years</option>
                            <option value="9-12">9-12 years</option>
                            <option value="13+">13+ years</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Level:</label>
                        <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Prompt for AI (e.g., "10 addition problems" or "spelling practice"):</label>
                        <textarea
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            required
                            placeholder="Generate 5 simple addition problems using numbers 1-10"
                        />
                    </div>

                    <button type="submit" disabled={loading || !prompt}>
                        {loading ? 'Generating...' : 'Create Assignment'}
                    </button>

                    <button type="button" onClick={() => navigate('/ShowAssignment')}>
                        View Assignments
                    </button>
                </form>
            </div>
            {loading && <div className="loading-spinner">Generating...</div>}
            {successMessage && (
                <div className="success-message">
                    {successMessage}
                </div>
            )}


        </div>
    );
}



export default Assignment;
