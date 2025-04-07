import {Link} from "react-router-dom";
import React from "react";
import './Navbar.css';

const Navbar=() =>{
    return (
      <div className="navbar">
        <Link to="/" className="a">Home</Link>
        <Link to="/about" className="a">Lesson</Link>
        <Link to="/game" className="a">Game</Link>
        <Link to="/assignment" className="a">Assignment</Link>
        <Link to="/timetable" className="a">Time Table</Link>
        <Link to="/login" className="split">LogIn</Link>
        <Link to="/signup" className="split">SignUp</Link>
      </div>
    );
  }
  
  export default Navbar;
  