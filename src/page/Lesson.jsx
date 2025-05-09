import React from 'react';
import { Link } from 'react-router-dom';
import './Lesson.css';

const subjects = [
  { name: 'Mathematics', description: 'Explore numbers & formulas' },
  { name: 'Science', description: 'Discover how the world works' },
  { name: 'English', description: 'Enhance your language skills' },
  { name: 'History', description: 'Learn about the past' },
  { name: 'Geography', description: 'Study places & environments' },
  { name: 'Art', description: 'Get creative with colors & shapes' },
  { name: 'Physical Education', description: 'Stay fit and active' },
  { name: 'Music', description: 'Enjoy the world of sounds' }
];

export default function Lesson() {
  return (
    <div className="lesson-container">
      <h1>Subjects List</h1>
      <p>Select a subject to explore lessons and resources:</p>
      <div className="subject-list">
        {subjects.map((subject, index) => (
          <Link
            key={index}
            to={`/lesson/${subject.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="subject-card"
          >
            <h3>{subject.name}</h3>
            <p>{subject.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
