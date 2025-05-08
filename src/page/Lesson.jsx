import React from 'react';
import { Link } from 'react-router-dom';
import './Lesson.css';

const subjects = [
  'Mathematics',
  'Science',
  'English',
  'History',
  'Geography',
  'Art',
  'Physical Education',
  'Music'
];

export default function Lesson() {
  return (
    <div className="lesson-container">
      <h1>Subjects List</h1>
      <p>Select a subject to explore lessons and resources:</p>
      <ul>
        {subjects.map((subject, index) => (
          <li key={index}>
            <Link to={`/lesson/${subject.toLowerCase().replace(/\s+/g, '-')}`}>
              {subject}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

