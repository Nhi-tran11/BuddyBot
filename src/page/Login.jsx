import { useState } from 'react';
// import { loginUser } from '../services/authService';
import '../Login.css';
import { Link } from 'react-router-dom';
import React from 'react';
import { useNavigate } from 'react-router-dom';


function Login () {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Include credentials in the request
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
            
            console.log(data);
            if (data.message === 'Login successful') {

                localStorage.setItem('user', data.user);
                
                navigate('/', { state: { user: data.user } });

            }
        }  
        catch (err) {
            console.log(err);
            setError(err.message || 'An error occurred during LogIn');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h3>Login</h3>
                
                <div className="form-group">
                    <label>UserName:</label>
                    <input
                        type="username"
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                        required

                    />
                </div>

                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required

                    />
                </div>

                <button 
                    type="submit" 
                    className="login-button"

                >LogIn
                </button>
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                 <p>Haven't had an account yet</p>
                      <Link to="/SignUp" className='btn-primary'>SignUp</Link>
            </form>
        </div>
    );
};

export default Login;