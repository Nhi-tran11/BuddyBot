import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';



function LogOut() {
  const navigate = useNavigate();
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  
  React.useEffect(() => {
    const performLogout = async () => {
      try {
        const response = await fetch('http://localhost:5000/logout', {
          method: 'GET',
          credentials: 'include', // Include credentials in the request
        });
        
        if(!response.ok) {
          throw new Error('Logout failed');
        }
        
        const data = await response.json();
        console.log(data);
        if (data.message === 'Logged out successfully') {
          // Clear any user data from local storage or state
          localStorage.removeItem('user');
          console.log('Cleared user for testing');
   
          setIsLoggedOut(true);
          navigate('/login');
          localStorage.removeItem('role'); // Clear role from local storage
        }
      } catch (error) {
        console.log('Non-JSON response or parsing error:', error);
      }
    };
    
    performLogout();
  }, [navigate]); // Add navigate as a dependency
  
  return (
    <div className="logout-container">
      <p> You successfully loged Out</p>
      <p>Thank you for using BuddyBot</p>
    </div>
  );
}

export default LogOut;