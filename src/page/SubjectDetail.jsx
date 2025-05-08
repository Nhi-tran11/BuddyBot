import React from 'react';
import { useParams } from 'react-router-dom';

export default function SubjectDetail() {
  const { subjectName } = useParams();

  // Capitalize the first letter
  const formattedSubject = subjectName.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div style={{ padding: '20px' }}>
      <h1>{formattedSubject}</h1>
      <p>Welcome to the {formattedSubject} lessons and resources page.</p>
      <p>Here you will find topics, assignments, and other helpful materials for {formattedSubject}.</p>
    </div>
  );
}
