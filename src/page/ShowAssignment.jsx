import { useState, useEffect } from "react";
import "../ShowAssignment.css";
import React from "react";
import { useNavigate } from 'react-router-dom';


function ShowAssignment() {
  const [assignments, setAssignments] = useState([]);
  const [showAssignments, setShowAssignments] = useState(false);
  const [error, setError] = useState(null);
  const [showCompletedAssignments, setShowCompletedAssignments] = useState(false);
  const [showPendingAssignments, setShowPendingAssignments] = useState(false);

  const [generateQuestion, setGenerateQuestion] = useState(false);

  const navigate = useNavigate();
  const [role, setRole] = useState('null');

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
      setRole(data.userRole);

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

  const fetchCompletedAssignments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/completedAssignments?showCompletedAssignments=true`, {
        credentials: 'include'
      });

      

      if (!response.ok) {
        const errorStatus = response.status;
        console.error(`Server responded with status ${errorStatus}`);
    
      }
      
      const data = await response.json();
      setRole(data.userRole);

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
    if (showCompletedAssignments) {
      fetchCompletedAssignments();
    }
  }, [showCompletedAssignments]);

const fetchPendingAssignments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/pendingAssignments?showPendingAssignments=true`, {
        credentials: 'include'
      });

      

      if (!response.ok) {
        const errorStatus = response.status;
        console.error(`Server responded with status ${errorStatus}`);
    
      }
      
      const data = await response.json();
      setRole(data.userRole);

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
    if (showPendingAssignments) {
      fetchPendingAssignments();
    }
  }, [showPendingAssignments]);

  //Add a separate function to get user role
const fetchUserRole = async () => {
  try {
    const response = await fetch('http://localhost:5000/assignments?showAssignments=true', {
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      setRole(data.userRole);
      localStorage.setItem('role', data.userRole);
    }
  } catch (err) {
    console.error('Error fetching user role:', err);
  }
};

// Call it when component mounts
useEffect(() => {
  fetchUserRole();
}, []);
  useEffect(() => {
    if (generateQuestion) {
      navigate('/Assignment');
    }
  }, [generateQuestion]);


  // Helper to reset all views and assignments
  const resetViews = () => {
    setShowAssignments(false);
    setShowCompletedAssignments(false);
    setShowPendingAssignments(false);
    setAssignments([]);
    setError(null);
  };

  return (
    <div className="assignment-container">
      <h2>Assignments</h2>

      <div className="assignment-buttons">
        <button
          type="button"
          onClick={() => {
            resetViews();
            setShowAssignments(true);
          }}
        >
          Show Assignments
        </button>

        <button
          type="button"
          onClick={() => {
            resetViews();
            setShowCompletedAssignments(true);
          }}
        >
          Show Completed Assignments
        </button>

        <button
          type="button"
          onClick={() => {
            resetViews();
            setShowPendingAssignments(true);
          }}
        >
          Show Pending Assignments
        </button>

        {role === 'parent' && (
          <button
            type="button"
            onClick={() => setGenerateQuestion(!generateQuestion)}
          >
            Generate Question
          </button>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}
      <div className="assignment-form"></div>

      {showAssignments && (
        <div className="child-assignments">
          {assignments.length === 0 ? (
            <p>No assignments found for this child.</p>
          ) : (
            <ul className="assignments-list">
              {assignments.map(assignment => (
                <li
                  key={assignment._id}
                  className="assignment-item"
                  onClick={() => {
                    navigate(`/Question/${assignment._id}`, { state: { assignmentId: assignment._id, role: role } });
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <h4>{assignment.title} - {assignment.subject}</h4>
                    <p><strong>Due:</strong> {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "N/A"}</p>
                    <div className="assignment-description">
                    <strong>Description:</strong> {assignment.description}
                    </div>
                    <div className="assignment-status">
                    <strong>Status:</strong> {assignment.status}
                    </div>
                    <div className="assignment-grade">
                    <strong>Grade:</strong> {assignment.score || "Not graded yet"}
                    </div>
                    <div className="assignment-difficulty">
                    <strong>Difficulty:</strong> {assignment.difficulty}
                    </div>
                    {role === 'parent' && (
                    <button
                      type="button"
                      onClick={async (e) => {
                      e.stopPropagation();
                      const confirmDelete = window.confirm("Are you sure you want to delete this assignment?");
                      if (!confirmDelete) return;
                      const response = await fetch(`http://localhost:5000/delete-assignment/${assignment._id}`, {
                        method: 'DELETE',
                        headers: {
                        'Content-Type': 'application/json'
                        }
                      });

                        if (response.ok) {
                          alert('Assignment deleted successfully');
                          fetchAssignments();
                        } else {
                          alert('Failed to delete assignment');
                        }
                      }}
                    >
                      Delete
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {showCompletedAssignments && (
        <div className="child-assignments">
          {assignments.length === 0 ? (
            <p>No assignments found for this child.</p>
          ) : (
            <ul className="assignments-list">
              {assignments.map(assignment => (
                <li
                  key={assignment._id}
                  className="assignment-item"
                  onClick={() => navigate(`/Question/${assignment._id}`, { state: { assignmentId: assignment._id, role: role } })}
                  style={{ cursor: "pointer" }}
                >
                  <h4>{assignment.title} - {assignment.subject}</h4>
                  <p><strong>Due:</strong> {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "N/A"}</p>
                  <div className="assignment-description">
                    <strong>Description:</strong> {assignment.description}
                  </div>
                  <div className="assignment-status">
                    <strong>Status:</strong> {assignment.status}
                  </div>
                  <div className="assignment-grade">
                    <strong>Grade:</strong> {assignment.score || "Not graded yet"}
                  </div>
                  <div className="assignment-difficulty">
                    <strong>Difficulty:</strong> {assignment.difficulty}
                  </div>
                  {role === 'parent' && (
                    <button
                      type="button"
                      onClick={async (e) => {
                        e.stopPropagation();
                        const response = await fetch(`http://localhost:5000/delete-assignment/${assignment._id}`, {
                          method: 'DELETE',
                          headers: {
                            'Content-Type': 'application/json'
                          }
                        });

                        if (response.ok) {
                          alert('Assignment deleted successfully');
                          fetchAssignments();
                        } else {
                          alert('Failed to delete assignment');
                        }
                      }}
                    >
                      Delete
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {showPendingAssignments && (
        <div className="child-assignments">
          {assignments.length === 0 ? (
            <p>No assignments found for this child.</p>
          ) : (
            <ul className="assignments-list">
              {assignments.map(assignment => (
                <li
                  key={assignment._id}
                  className="assignment-item"
                  onClick={() => navigate(`/Question/${assignment._id}`, { state: { assignmentId: assignment._id, role: role } })}
                  style={{ cursor: "pointer" }}
                >
                  <h4>{assignment.title} - {assignment.subject}</h4>
                  <p><strong>Due:</strong> {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "N/A"}</p>
                  <div className="assignment-description">
                    <strong>Description:</strong> {assignment.description}
                  </div>

                  <div className="assignment-status">
                    <strong>Status:</strong> {assignment.status}
                  </div>
                  <div className="assignment-grade">
                    <strong>Grade:</strong> {assignment.score || "Not graded yet"}
                  </div>
                  <div className="assignment-difficulty">
                    <strong>Difficulty:</strong> {assignment.difficulty}
                  </div>
                  {role === 'parent' && (
                    <button
                      type="button"
                      onClick={async (e) => {
                        e.stopPropagation();
                        const response = await fetch(`http://localhost:5000/delete-assignment/${assignment._id}`, {
                          method: 'DELETE',
                          headers: {
                            'Content-Type': 'application/json'
                          }
                        });

                        if (response.ok) {
                          alert('Assignment deleted successfully');
                          fetchAssignments();
                        } else {
                          alert('Failed to delete assignment');
                        }
                      }}
                    >
                      Delete
                    </button>
                  )}
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
