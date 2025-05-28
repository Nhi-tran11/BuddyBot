import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check localStorage for persisted login state
    return localStorage.getItem("isLoggedIn") === "true";
  });

  useEffect(() => {
    if (location.state && location.state.user) {
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
    }
  }, [location.state]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false");
    // Optionally clear user data from location.state if needed
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
      {!isLoggedIn && <Link to="/signup" className="split">SignUp</Link>}
    </div>
  );
};

export default Navbar;