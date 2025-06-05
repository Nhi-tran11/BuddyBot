import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Lesson.css';

const subjects = [
  { name: 'Mathematics', description: 'Explore numbers & formulas', icon: '/math.png' },
  { name: 'Science', description: 'Discover how the world works', icon: '/science.png' },
  { name: 'English', description: 'Enhance your language skills', icon: '/english.png' },
  { name: 'History', description: 'Learn about the past', icon: '/history.png' },
  { name: 'Geography', description: 'Study places & environments', icon: '/geography.png' },
  { name: 'Art', description: 'Get creative with colors & shapes', icon: '/art.png' },
  { name: 'Physical Education', description: 'Stay fit and active', icon: '/pe.png' },
  { name: 'Music', description: 'Enjoy the world of sounds', icon: '/music.png' }
];

export default function Lesson() {
  const [showSubjects, setShowSubjects] = useState(false);
  const [avatarMoved, setAvatarMoved] = useState(false);

  useEffect(() => {
    // Reveal subjects + move avatar after 2.5 seconds
    const timer = setTimeout(() => {
      setShowSubjects(true);
      setAvatarMoved(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="lesson-container">
      {/* ✅ Avatar section */}
      <div className={`lesson-avatar ${avatarMoved ? 'moved' : 'centered'}`}>
        <img src="/avatar-bot.png" alt="Buddy Bot" />
        {!avatarMoved && <p>Hey there! Pick a subject to start 🚀</p>}
      </div>

      {/* ✅ Subjects List */}
      {showSubjects && (
        <div className="subjects-section fade-in">
          <h1>Subjects List</h1>
          <p>Select a subject to explore lessons and resources:</p>
          <Link
  to="/lessons/create"
  className="back-button"
  style={{ marginBottom: '20px' }}
>
  ➕ Create Lesson
</Link>

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
      )}
    </div>
  );
}
