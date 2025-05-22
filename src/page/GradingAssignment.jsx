import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const GradingAssignment = () => {
    const [score, setScore] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const savedScore = localStorage.getItem('score');
        if (savedScore) {
            setScore(savedScore);
        }
    }, []);

    if (!localStorage.getItem('score')) {
        return <div>No score found</div>;
    }

    return (
        <div>
            <h1>Thank you for finishing your assignment</h1>
            <h2>Your score is {score}</h2>
            <div>
                <button onClick={() => {
                    localStorage.removeItem('score');
                    navigate('/ShowAssignment');
                }}>View Assignments</button>
            </div>
        </div>
    );
}
export default GradingAssignment;
