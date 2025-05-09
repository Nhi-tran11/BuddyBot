import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import './Navbar.css';
import { useState } from "react";
import { useLocation } from "react-router-dom";

const Navbar=() =>{

  
  const location = useLocation();

  const [ isLoggedIn, setIsLoggedIn] = useState(false)
  useEffect(() => {
    if(location.state && location.state.user) {
      setIsLoggedIn(true);
    } 
  }, [location]);

  // Function to pass to the LogOut component to update the login state
  // Function to handle logout and update the login state
  const handleLogout = () => {
    setIsLoggedIn(false);
    // Clear the user data from location state
    if (location.state) {
      location.state.user = null;
    }
  };
    return (
      <div className="navbar">
        <Link to="/" className="a">Home</Link>
    
        <Link to="/lesson" className="a">Lesson</Link>
        <Link to="/game" className="a">Game</Link>
        <Link to="/assignment" className="a">Assignment</Link>
        <Link to="/timetable" className="a">Time Table</Link>
        {isLoggedIn ? (
          <Link to="/logout" className="split" onClick={handleLogout}>Logout</Link>
        ) : (
          <Link to="/login" className="split">Login</Link>
        )}
        {!isLoggedIn && <Link to="/signup" className="split">SignUp </Link>}
      </div>
    );
  }
  
  export default Navbar;
  