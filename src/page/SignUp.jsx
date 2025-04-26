import {useState} from 'react';
// import { Link, link } from  'react-router-dom';
import '../SignUp.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


function SignUp() {

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [username, setUserName] = useState('');
const role = 'parent'; // Default role is 'parent'
// const [role, setRole] = useState('parent'); // Default role is 'parent'
const [error, setError] = useState(null);
const navigate = useNavigate();
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    //  error=await axios.post('http://localhost:5000/signup', {email, username, password, role});
    // // Remove the incorrect error assignment
    // if (error) {
    //   setError(error.response?.data?.message || 'An error occurred during sign up');
    //   return; // Stop execution if there's an error
    // }
     
    
    const result = await axios.post('http://localhost:5000/signup', {email, username, password, role});
    console.log(result);
    
    // Get the parentID from the result
    const parentID = result.data.user._id;
    
    // Check if parentID exists and is valid before navigating
    if (parentID) {
      // Store the parentID in localStorage
      localStorage.setItem('parentId', parentID);
      
      // Navigate to SignUpChild page with parentID
      navigate('/SignUpChild', { state: { parentID: parentID } });
    } else {
      console.error("Invalid parentID received from server");
     
      // Handle the error appropriately
    }
  } catch (err) {
    setError(err.response?.data?.message || 'An error occurred during sign up');
    console.log(err);
  }
  // console.log( email, password);
}
  return (
    <div className="SignUp-container">
  
    <form className='Signup' onSubmit={handleSubmit}>
      <h3>SignUp</h3>
      <div className='SignUpform-group'>
      <label>Email:</label>
      <input
        type="email"
        // placeholder='Enter your email'
        
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      /></div>
      <div className='SignUpform-group'>
      <label>UserName:</label>
      <input
        type="username"
        value={username}
        onChange={(e) => setUserName(e.target.value)}
        required
      /></div>
      <div className='SignUpform-group'>
       <label>Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      /></div>
      <div className='Submit'>
      <button type="submit" className='SubmitButton'>
      Sign Up</button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      </div>
      <p>Already have an account</p>
      <Link to="/Login" className='btn btn-primary'>Login</Link>
      </form>
     </div> 
      
  )
   
 
}

export default SignUp;