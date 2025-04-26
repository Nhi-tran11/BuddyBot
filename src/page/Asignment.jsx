import React, { useState, useEffect } from "react";
import "../Assignment.css";
import { Link } from "react-router-dom";

function Assignment() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [aiPrompt, setAiPrompt] = useState("");
    const [showAiForm, setShowAiForm] = useState(false);
    // const [data, setData] = useState(null);
    // Fetch existing assignments
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchTasks();
        } else {
            setError('Please log in to view assignments');
        }
    }, []);

    const fetchTasks = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Authentication token missing');
                    return;
                }
                
                const response = await fetch("http://localhost:5000/assignment", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                setTasks(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching tasks:', err);
                setError('Failed to load assignments: ' + (err.message || 'Unknown error'));
            } finally {
                setLoading(false);
            }
        };
    //         if (!response.ok) {
    //             throw new Error(`Error ${response.status}: ${response.statusText}`);
    //         }
            
    //         const data = await response.json();
    //         setTasks(data);
    //         setError(null);
    //     } catch (err) {
    //         console.error('Error fetching tasks:', err);
    //         setError('Failed to load assignments: ' + (err.message || 'Unknown error'));
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // // Generate assignment using AI - this function will be implemented below
    // const getStatusColor = (status) => {
    //     switch(status) {
    //         case 'completed': return 'success';
    //         case 'in-progress': return 'warning';
    //         case 'pending': return 'pending';
    //         default: return 'default';
    //     }
    // };

    // const formatDate = (dateString) => {
    //     return new Date(dateString).toLocaleDateString('en-US', {
    //         year: 'numeric',
    //         month: 'short',
    //         day: 'numeric'
    //     });
    // };


    // // State to track if user has created child accounts
    // const [hasChildren, setHasChildren] = useState(false);
    
    // // Check if user has child accounts
    // useEffect(() => {
    //     const checkChildAccounts = async () => {
    //         try {
    //             const token = localStorage.getItem('token');
    //             if (!token) return;
                
    //             const response = await fetch('http://localhost:5000/api/users/children', {
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`
    //                 }
    //             });
                
    //             if (response.ok) {
    //                 const data = await response.json();
    //                 setHasChildren(data.length > 0);
    //             }
    //         } catch (err) {
    //             console.error('Error checking child accounts:', err);
    //         }
    //     };
        
    //     checkChildAccounts();
    // }, []);

    // // Add state for child accounts and selected child
    // const [children, setChildren] = useState([]);
    // const [selectedChild, setSelectedChild] = useState('');

    // // Fetch child accounts
    // useEffect(() => {
    //     const fetchChildren = async () => {
    //         try {
    //             const token = localStorage.getItem('token');
    //             if (!token) return;
                
    //             const response = await fetch('http://localhost:5000/api/users/children', {
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`
    //                 }
    //             });
                
    //             if (response.ok) {
    //                 const data = await response.json();
    //                 setChildren(data);
    //                 setHasChildren(data.length > 0);
    //                 if (data.length > 0) {
    //                     setSelectedChild(data[0]._id); // Default to first child
    //                 }
    //             }
    //         } catch (err) {
    //             console.error('Error fetching child accounts:', err);
    //         }
    //     };
        
    //     fetchChildren();
    // }, []);

    // // Modified to include selected child
    // // Generate assignment using AI with selected child
    // const generateAiAssignment = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     try {
    //         const response = await fetch('http://localhost:5000/api/tasks/generate', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${localStorage.getItem('token')}`
    //             },
    //             body: JSON.stringify({ 
    //                 prompt: aiPrompt,
    //                 childId: selectedChild
    //             })
    //         });
    //         const data = await response.json();
    //         setTasks([...tasks, data]);
    //         setAiPrompt("");
    //         setShowAiForm(false);
    //     } catch (err) {
    //         setError('Failed to generate assignment');
    //     } finally {
    //         setLoading(false);
    // Helper functions
    const getStatusColor = (status) => {
        switch(status) {
            case 'completed': return 'success';
            case 'in-progress': return 'warning';
            case 'pending': return 'pending';
            default: return 'default';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // State for child accounts
    const [hasChildren, setHasChildren] = useState(false);
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState('');

    // Generate assignment using AI with selected child
    const generateAiAssignment = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/tasks/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ 
                    prompt: aiPrompt,
                    childId: selectedChild
                })
            });
            const data = await response.json();
            setTasks([...tasks, data]);
            setAiPrompt("");
            setShowAiForm(false);
        } catch (err) {
            setError('Failed to generate assignment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="assignment-container">
            <div className="assignment-header">
                <h1>Assignments</h1>
                <button 
                    onClick={() => setShowAiForm(!showAiForm)} 
                    disabled={!hasChildren}
                    className="create-btn"
                >
                    {showAiForm ? 'Cancel' : 'Create New Assignment'}
                </button>
            </div>
                    {/* {showAiForm ? 'Cancel' : 'Create New Assignment'}
                </button>
            </div> */}

            {error && <div className="error-message">{error}</div>}

            {showAiForm && (
                <div className="ai-form-container">
                    <h2>Generate an Assignment with AI</h2>
                    <form onSubmit={generateAiAssignment}>
                        <div className="form-group">
                            <label htmlFor="childSelect">Assign to:</label>
                            <select 
                                id="childSelect"
                                value={selectedChild}
                                onChange={(e) => setSelectedChild(e.target.value)}
                                required
                            >
                                {children.map(child => (
                                    <option key={child._id} value={child._id}>
                                        {child.name || child.username}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <textarea
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="Describe the assignment you want to create (e.g., 'Create a math problem about fractions for a 10-year-old')"
                            required
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? 'Generating...' : 'Generate Assignment'}
                        </button>
                    </form>
                </div>
            )}

            <div className="tasks-grid">
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <div key={task._id} className="task-card">
                            <div className="task-header">
                                <div className="task-title">
                                    <h3>{task.title}</h3>
                                    {task.aiGenerated && (
                                        <span className="ai-badge">AI Generated</span>
                                    )}
                                </div>
                                <span className={`status-badge ${getStatusColor(task.status)}`}>
                                    {task.status}
                                </span>
                            </div>
                            
                            <p className="task-description">{task.description}</p>
                            
                            <div className="task-meta">
                                <div className="meta-item">
                                    <i className="far fa-calendar"></i>
                                    <span>Due: {formatDate(task.dueDate)}</span>
                                </div>
                                <div className="meta-item">
                                    <i className="far fa-user"></i>
                                    <span>Assigned to: {task.assignedTo?.childName}</span>
                                </div>
                                <div className="meta-item">
                                    <i className="far fa-clock"></i>
                                    <span>Created: {formatDate(task.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-tasks-message">
                        <p>You don't have any assignments yet.</p>
                        {!hasChildren ? (
                            <>
                                <p>Please create an account for your child before creating assignments.</p>
                                <Link to="/SignUpChild" className="btn btn-primary">
                                    Create Child Account
                                </Link>
                                <p>Once you've set up a child account, you can create assignments for them.</p>
                            </>
                        ) : (
                            <p>Click "Create New Assignment" to get started.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Assignment;