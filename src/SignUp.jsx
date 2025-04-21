import {useState} from 'react';

const SignUp = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [username, setUserName] = useState('');
const [role, setRole] = useState('parent'); // Default role is 'parent'
const [error, setError] = useState('');
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log( email, password);
}
  return (
    <form className='signup' onSubmit={handleSubmit}>
      <h3>Sign Up</h3>
      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <label>UserName:</label>
      <input
        type="username"
        value={username}
        onChange={(e) => setUserName(e.target.value)}
        required
      />
      <label>Child Name:</label>
            <input
                type="childName"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                required
            />
       <label>Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
       
      <label>Confirm Password:</label>
            <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />
      <button type="submit">Sign Up</button>
      </form>
  )
   
 
}

export default SignUp;