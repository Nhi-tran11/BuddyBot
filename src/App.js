import './App.css';
import './Slideshow.css';
// import ReactDOM from "react-dom/client";
import { Routes, Route } from "react-router-dom";
import React from 'react';
import Header from "./header";
import Footer from "./footer";
// import logo1 from "./image/welcomelego.jpg";
// import Slideshow from "./slideshow";
// import CloudGroup from './cloudGroup';
import Navbar from './Navbar';
// import Home from './App';
import Assignment from './Asignment';
import Game from './Game'
import Login from './Login';
import SignUp from './SignUp';
import Home from './Home';
import Lesson from './Lesson';
import TimeTable from './TimeTable';

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
      {/* </BrowserRouter> */}
      {/* <main style={{ padding: "20px", minHeight: "80vh" }}>
        <section className="welcomesection">

          <div className="welcome-container">
            <img src={logo1} alt="Welcome Logo" className="welcome-image" />
            <h1 className="title">Welcome to BuddyBot - Learning Made Magical!</h1>
          </div>
        </section>

        <section className='slideshowsection'>
          <div className='Slideshow'>
            <Slideshow />
            <CloudGroup/>
          </div>
        </section>



      </main> */}

      <Footer />
    </div>
  );
}
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />);
export default App;
