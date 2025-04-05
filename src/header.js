import React from "react";
import './header.css';
import logo from "./image/logo.png";
// import logo2 from "./image/kids-learning.jpg";
import backgroundImage from "./image/colorful.webp"; 
const Header = () => {
    return (
        <header >
            <div class="header" style={{ 
      backgroundImage: `url(${backgroundImage})`,
      width: "100%",
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "200px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white"
    }}>
                <img src={logo} alt="BuddyBot Logo"></img>
                
            </div>
             
            <div class="navbar" >
                <a href="/">Home</a> 
                <a href="/about">Lessson</a> 
                <a href="/game">Game</a>
                <a href="/assignment">Assignment</a>
                <a href="/login" class="split" >LogIn</a>
                <a href="/signUp" class="split" >SignUp</a>

            </div>
        </header>
    );
};


export default Header;

