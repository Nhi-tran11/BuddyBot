import React from "react";
import './header.css';
import logo from "./image/logo.png";


import backgroundImage from "./image/colorful.webp";
const Header = () => {
    return (
        <header >
            <div className="header" style={{
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

        </header>
    );
};


export default Header;

