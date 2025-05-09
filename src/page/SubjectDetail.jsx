import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './Lesson.css';  // ✅ Use same CSS file to keep it clean

export default function SubjectDetail() {
  const { subjectName } = useParams();

  // Capitalize and replace dashes with spaces
  const formattedSubject = subjectName
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="lesson-container">
      <h1>{formattedSubject}</h1>
      <p>Welcome to the {formattedSubject} lessons and resources page.</p>
      <p>Here you will find topics, assignments, and other helpful materials for {formattedSubject}.</p>

      <Link to="/lesson" className="back-button">← Back to Lessons</Link>
    </div>
  );
}

