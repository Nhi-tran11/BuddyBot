import './App.css';
import './Slideshow.css';
import { Routes, Route } from "react-router-dom";
import React from 'react';
import Header from "./header";
import Footer from "./footer";

import Navbar from './Navbar';
import Assignment from './page/Asignment';
import Game from './page/Game'
import Login from './page/Login';
import SignUp from './page/SignUp';
import Home from './page/Home';
import SignUpChild from './page/SignUpChild';

import Lesson from './page/Lesson';
import TimeTable from './page/TimeTable';
// import { useState } from 'react';

function App() {
  return (

    <div>
      <Header />

      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/lesson" element={<Lesson />} />
        <Route path="/assignment" element={<Assignment />} />
        <Route path="/timetable" element={<TimeTable />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signupChild" element={<SignUpChild />} />
      </Routes>
    

      <Footer />
    </div>
  );
}

export default App;
