import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../Question.css";
import React from "react";
const Question = () => {
  const [assignmentId, setAssignmentId] = useState('');
  const [assignment, setAssignment] = useState(null);
  const [error, setError] = useState('');
  const [userAnswers, setUserAnswers] = useState({});
  const [lengthQuestion, setLengthQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  useEffect(() => {
    if (location.state && location.state.assignmentId) {
      setAssignmentId(location.state.assignmentId);
      localStorage.setItem('assignmentId', location.state.assignmentId);
      localStorage.setItem('role', location.state.role);
      setRole(location.state.role);
    } else {
      setError("No assignment ID found");
    }
  }, [location]);

  useEffect(() => {
    if (!assignmentId) return;
    fetch(`http://localhost:5000/assignments/${assignmentId}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setAssignment(data.assignment || data);
      })
      .catch(() => setError("Failed to fetch assignment"));
  }, [assignmentId]);

  // Handle answer selection
  const handleOptionClick = (qIdx, oIdx) => {
    if (!assignment || !assignment.questions[qIdx]) return;
    // Get the correct answer letter 
    const correctLetter = assignment.questions[qIdx].answer;
    // The user's selected letter (A, B, C, D, ...)
    const selectedLetter = String.fromCharCode(65 + oIdx);

    setUserAnswers(prev => ({
      ...prev,
      [qIdx]: selectedLetter
    }));

    //  update score
    if (selectedLetter === correctLetter) {
      setScore(prev => prev + 1);
    }
  };
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');
    try {
      const response = await fetch(`http://localhost:5000/update-assignment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ assignmentId, score,lengthQuestion })
      });
      localStorage.setItem('score', score);
      
      navigate('/grading', { state: { score } });
      localStorage.removeItem('assignmentId');
      localStorage.removeItem('role');
      if (!response.ok) {
        throw new Error('Failed to submit answers');
      }
      // Optionally handle response here
    } catch (error) {
      setError("Failed to submit answers");
    }
  }
  useEffect(() => {
    if (assignment && assignment.questions) {
      setLengthQuestion(assignment.questions.length);
    }
  }, [assignment]);
  const handleBack = async (e) => {
    e.preventDefault();
    setError('');
    try {
      localStorage.removeItem('assignmentId');
      localStorage.removeItem('role');
      navigate('/showassignment');

    } catch (error) {
      setError("Could not navigate back");
    }
  }
  return (
    <div className="assignment-questions">
      <strong>Your assignment</strong>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {assignment && Array.isArray(assignment.questions) && assignment.questions.length > 0 ? (
          assignment.questions.map((questionObj, qIdx) => (
            <li key={qIdx}>
              <div>
                <strong>Question {qIdx + 1}:</strong> {questionObj.question}
              </div>
              <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {Array.isArray(questionObj.options) && questionObj.options.length > 0 ? (
                  questionObj.options.map((option, oIdx) => {
                    const selected = userAnswers[qIdx] === String.fromCharCode(65 + oIdx);
                    const correct = questionObj.answer === String.fromCharCode(65 + oIdx);
                    return (
                      <li
                        key={oIdx}
                        className={selected ? (correct ? "selected-option correct" : "selected-option wrong") : ""}
                        style={{
                          display: "inline-block",
                          marginRight: "10px",
                          cursor: "pointer",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          padding: "4px 8px"
                        }}
                        onClick={() => handleOptionClick(qIdx, oIdx)}
                      >
                        <span style={{ fontWeight: "bold" }}>
                          {String.fromCharCode(65 + oIdx)}.
                        </span>{" "}
                        {option}
                        {/* Show feedback if selected */}
                        {selected && (
                          <span style={{ marginLeft: 8 }}>
                            {correct ? "✅ Correct!" : "❌ Wrong"}
                          </span>
                        )}
                      </li>
                    );
                  })
                ) : (
                  <li>No options available.</li>
                )}
              </ul>
            </li>
          ))
        ) : (
          <li>No questions available.</li>
        )}
      </ul>
      <div style={{ marginTop: 20 }}>
        <strong>Score: {score} / {assignment?.questions?.length || 0}</strong>
      </div>
      <div className='button-container'>
        {role === "parent" && (
          <>

            <button type="button" onClick={handleBack}>
              Back to Assignments
            </button>
          </>
        )}
        {role === "child" && (
          <>
            <button
              type="button"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button type="button" onClick={handleBack}>
              Back to Assignments
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Question;