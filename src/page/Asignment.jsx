import React, { useState, useEffect } from "react";
import "../Assignment.css";

function Assignment() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [aiPrompt, setAiPrompt] = useState("");
    const [showAiForm, setShowAiForm] = useState(false);

    // Fetch existing assignments
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/tasks/assigned', {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setTasks(data);
        } catch (err) {
            setError('Failed to load assignments');
        }
    };

    // Generate assignment using AI
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
                body: JSON.stringify({ prompt: aiPrompt })
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
                    className="create-button"
                    onClick={() => setShowAiForm(!showAiForm)}
                >
                    {showAiForm ? 'Cancel' : 'Create New Assignment'}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {showAiForm && (
                <div className="ai-form">
                    <h2>Create AI-Generated Assignment</h2>
                    <form onSubmit={generateAiAssignment}>
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
                {tasks.map(task => (
                    <div key={task._id} className="task-card">
                        <div className="task-header">
                            <h3>{task.title}</h3>
                            <span className={`status-badge ${task.taskStatus}`}>
                                {task.taskStatus}
                            </span>
                        </div>
                        <p className="task-description">{task.taskDescription}</p>
                        <div className="task-footer">
                            <span className="due-date">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                            <span className="assigned-to">
                                Assigned to: {task.assignedTo?.username || 'Unassigned'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Assignment;