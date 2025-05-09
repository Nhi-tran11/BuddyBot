import React from 'react';
import { Link } from 'react-router-dom';
import './Lesson.css';

const subjects = [
  {
    name: 'Mathematics',
    description: 'Explore numbers & formulas',
    icon: '/public/math.png'
  },
  {
    name: 'Science',
    description: 'Discover how the world works',
    icon: '/public/science.png'
  },
  {
    name: 'English',
    description: 'Enhance your language skills',
    icon: '/public/english.png'
  },
  {
    name: 'History',
    description: 'Learn about the past',
    icon: '/public/history.png'
  },
  {
    name: 'Geography',
    description: 'Study places & environments',
    icon: '/public/geography.png'
  },
  {
    name: 'Art',
    description: 'Get creative with colors & shapes',
    icon: '/public/art.png'
  },
  {
    name: 'Physical Education',
    description: 'Stay fit and active',
    icon: '/public/pe.png'
  },
  {
    name: 'Music',
    description: 'Enjoy the world of sounds',
    icon: '/public/music.png'
  }
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
            className="subject-card fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <img src={subject.icon} alt={subject.name} className="subject-icon" />
            <h3>{subject.name}</h3>
            <p>{subject.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
