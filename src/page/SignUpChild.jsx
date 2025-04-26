import { useState, useEffect } from 'react';
import '../SignUpChild.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function SignUpChild() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [parentId, setParentId] = useState('');
  const role = 'child';
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get parentId from router state or localStorage
  useEffect(() => {
    // First try to get from router state
    if (location.state && location.state.parentId) {
      setParentId(location.state.parentId);
    } 
    // Fallback to localStorage
    else {
      const storedParentId = localStorage.getItem('parentId');
      if (storedParentId) {
        setParentId(storedParentId);
      } else {
        console.error("No parent ID found");
        // Optionally redirect back to parent signup
        // navigate('/SignUp');
      }
    }
  }, [location, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure we have a parentId before submission
    if (!parentId) {
      console.error("Missing parent ID");
      return;
    }
    
    // Log the data being sent for debugging
    console.log("Sending data:", { username, password, role, parentId });
    
    axios.post('http://localhost:5000/signupChild', { 
      username, 
      password, 
      role, 
      parentId: parentId.toString() // Ensure parentId is a string
    })
      .then(result => {
        console.log(result);
        // Clear the parentId from localStorage after successful child signup
        localStorage.removeItem('parentId');
        navigate('/Login');
      })
      .catch(err => {
        console.log(err);
        // Show more detailed error information
        if (err.response) {
          console.log("Server response:", err.response.data);
        }
      });
  }
  
  return (
    <div className="SignUp-container">
      <form className='Signup' onSubmit={handleSubmit}>
        <h3>SignUp For Your Child</h3>
        
        <div className='SignUpform-group'>
          <label>UserName:</label>
          <input
            type="username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        
        <div className='SignUpform-group'>
         <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
    
        
        <div className='Submit'>
          <button 
            type="submit" 
            className='SubmitButton'
            disabled={!parentId}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignUpChild;