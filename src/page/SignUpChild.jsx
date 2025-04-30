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
  const [error, setError] = useState(null);
  
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

      }
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Ensure we have a parentId before submission
      if (!parentId) {
        console.error("Missing parent ID");
        return;
      }

      console.log("Sending data:", { username, password, role, parentId });
      
      const response = await axios.post('http://localhost:5000/signupChild', { 
        username, 
        password, 
        role, 
        parentId: parentId.toString() // Ensure parentId is a string
      });
      
      console.log(response);
      if (response.data.message === 'Child account created successfully') {
        localStorage.removeItem('parentId');
        navigate('/');
      }
    }
    catch (err) {
      console.log(err);
      setError(err.response?.data?.message || 'An error occurred during LogIn');
  }
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
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        </div>
      </form>
    </div>
  );
}

export default SignUpChild;