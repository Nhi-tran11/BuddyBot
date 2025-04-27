import { useState } from 'react';
// import { loginUser } from '../services/authService';
import '../Login.css';
import { Link } from 'react-router-dom';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login () {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    // const [loading, setLoading] = useState(false);
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
            
            if (!response.ok) {
                throw new Error('Login failed');
            }
            
            const data = await response.json();
            response.data = data; // To maintain compatibility with existing code
            console.log(response);
            if (response.data.message === 'Login successful') {
                navigate('/');
            }
        }  
        catch (err) {
            console.log(err);
            setError(err.response?.data?.message || 'An error occurred during LogIn');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h3>Login</h3>
                {/* {error && <div className="error-message">{error}</div>} */}
                
                <div className="form-group">
                    <label>UserName:</label>
                    <input
                        type="username"
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        // disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        // disabled={loading}
                    />
                </div>

                <button 
                    type="submit" 
                    className="login-button"
                    // disabled={loading}
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