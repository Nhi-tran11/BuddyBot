import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Assignment.css";
import { Link } from "react-router-dom";

// Example component to add to your Assignment.jsx page
function Assignment({ onAssignmentCreated }) {
// const Assignment = ({ onAssignmentCreated }) => {
    const [prompt, setPrompt] = useState('');
    const [subject, setSubject] = useState('math');
    const [ageRange, setAgeRange] = useState('6-8');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [childId, setChildId] = useState('');
    
    // Assume you have the user ID from auth
    const parentId = localStorage.getItem('userId');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            // Check if user is logged in
            // if (!parentId) {
            //     throw new Error('You must be logged in to create assignments');
            // }
            
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 7); // Default due date: 1 week
            
            const response = await fetch('http://localhost:5000/ai-assignment', {
                method: 'POST',
                credentials: 'include', // This will include credentials in the request
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    prompt,
                    subject,
                    ageRange,
                    assignedTo: childId,
                    assignedBy: parentId,
                    dueDate: dueDate.toISOString()
                })
            });
            
            setPrompt('');
            if (onAssignmentCreated) {
                onAssignmentCreated(response.data.assignment);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create assignment');
        } finally {
            setLoading(false);
        }
    };
    
    return (
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
                        <option value="history">History</option>
                        <option value="art">Art</option>
                        <option value="other">Other</option>
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
            </form>
        </div>
)}

 
export default Assignment;
