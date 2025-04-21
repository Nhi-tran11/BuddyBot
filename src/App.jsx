import './App.css';
import './Slideshow.css';
import { Routes, Route } from "react-router-dom";
import React from 'react';
import Header from "./header";
import Footer from "./footer";
// import logo1 from "./image/welcomelego.jpg";
// import Slideshow from "./slideshow";
// import CloudGroup from './cloudGroup';
import Navbar from './Navbar';
// import Home from './App';
import Assignment from './page/Asignment';
import Game from './page/Game'
import Login from './page/Login';
import SignUp from './SignUp';
import Home from './page/Home';
import Lesson from './page/Lesson';
import TimeTable from './page/TimeTable';

function App() {
  return (

    <div>
      <Header />
      {/* <BrowserRouter> */}
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
      
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="/game" element={<Game />} />
        <Route path="/lesson" element={<Lesson />} />
        <Route path="/assignment" element={<Assignment />} />
        <Route path="/timetable" element={<TimeTable />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    

      <Footer />
    </div>
  );
}
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />);
export default App;
