import './App.css';
import './Slideshow.css';
import { Routes, Route } from "react-router-dom";
import React from "react";
import Header from "./header";
import Footer from "./footer";
import Navbar from './Navbar';
import Assignment from './page/Asignment';
import Game from './page/Game'
import Login from './page/Login';
import SignUp from './page/SignUp';
import Home from './page/Home';
import SignUpChild from './page/SignUpChild';
import ShowAssignment from './page/ShowAssignment';
import SubjectDetail from './page/SubjectDetail';
import LogOut from './page/LogOut';
import Question from './page/Question';
import GradingAssignment from './page/GradingAssignment';
import Lesson from './page/Lesson';
import TimeTable from './page/TimeTable';
import ErrorBoundary from './ErrorBoundary';
import SubjectSelect from './page/SubjectSelect';

function App() {


  return (

    <div>
      <Header />

      <Navbar />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/logout" element={<LogOut />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signupChild" element={<SignUpChild />} />
          <Route path="/ShowAssignment" element={<ShowAssignment />} />
          <Route path="/Question/:assignmentId" element={<Question />} />
          <Route path="/assignment" element={<Assignment />} />

          <Route path="/lesson" element={<Lesson />} />
          <Route path="/timetable" element={<TimeTable />} />
          <Route path="/lesson/:subjectName" element={<SubjectDetail />} />
          <Route path="/grading" element={<GradingAssignment />} />
          <Route path="/game" element={<SubjectSelect />} />
          <Route path="/game/:subject" element={<Game />} />

        </Routes>
      </ErrorBoundary>
      <Footer />
    </div>
  );
}

export default App;
