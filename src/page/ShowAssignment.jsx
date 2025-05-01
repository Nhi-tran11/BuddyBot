import React, { useState, useEffect } from "react";
import "../ShowAssignment.css";

function ShowAssignment() {
  const [assignments, setAssignments] = useState([]);
  const [showAssignments, setShowAssignments] = useState(false);
  const [error, setError] = useState(null);

  // Fetch assignments for the child
  const fetchAssignments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/assignments?showAssignments=true`, {
        credentials: 'include'
      });

      
      if (!response.ok) {
        const errorStatus = response.status;
        console.error(`Server responded with status ${errorStatus}`);
    
      }
      
      const data = await response.json();
      
      if (response.ok) {

        const childAssignments = data.assignments || data;
        setAssignments(childAssignments)
      } else {
        setError(data.message || 'Failed to fetch assignments');
      }
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError('Failed to fetch assignments');
    }
  };

  useEffect(() => {
    if (showAssignments) {
      fetchAssignments();
    }
  }, [showAssignments]);

  return (
    <div className="assignment-container">
      <h2>Assignments</h2>
      <div className="assignment-form"></div>
      <button type="button" onClick={() => setShowAssignments(!showAssignments)}>
        {showAssignments ? 'Hide Assignments' : 'Show Assignments'}
      </button>
      {error && <p className="error-message">{error}</p>}
      <div className="assignment-form"></div>
   
      {showAssignments &&(
        <div className="child-assignments">
          {assignments.length === 0 ? (
            <p>No assignments found for this child.</p>
          ) : (
            <ul className="assignments-list">
              {assignments.map(assignment => (
                <li key={assignment._id} className="assignment-item">
                  <h4>{assignment.title} - {assignment.subject}</h4>
                  <p><strong>Due:</strong> {new Date(assignment.dueDate).toLocaleDateString()}</p>
                  <div className="assignment-description">
                    <strong>Description:</strong> {assignment.description}
                  </div>
                  <div className="assignment-questions">
                    {assignment.questions && assignment.questions.length > 0 && (
                      <>
                        <strong>Questions:</strong>
                        <ol>
                          {assignment.questions.map((q, index) => (
                            <li key={index}>{q.question}</li>
                          ))}
                        </ol>
                      </>
                    )}
                  </div>
                  <div className="assignment-status">
                    <strong>Status:</strong> {assignment.status}
                  </div>
                  <div className="assignment-difficulty">
                    <strong>Difficulty:</strong> {assignment.difficulty}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default ShowAssignment;