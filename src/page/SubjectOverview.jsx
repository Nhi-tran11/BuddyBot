// src/pages/SubjectOverview.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { getAllLessons } from "../utils/lessonsStore";


// If you’re using a Context or prop for role, import that:


export default function SubjectOverview() {
  const { subjectSlug } = useParams(); 
  const [lessons, setLessons] = useState([]);
  // Assume you have a Context (or prop‐drill) that tells if the user is a parent:
  const role = useContext(UserRoleContext); // “child” or “parent”

  useEffect(() => {
    const all = getAllLessons();
    const subjectName = subjectSlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    const filtered = all.filter((l) => l.subject === subjectName);
    setLessons(filtered);
  }, [subjectSlug]);

  // Convert slug to human‐readable subject:
  const subjectName = subjectSlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div className="lesson-container">
      <h1 style={{ marginBottom: "1rem" }}>
        {subjectName} Lessons
      </h1>

      <div style={{ marginBottom: "1rem", textAlign: "right" }}>
  <Link
    to={`/subject/${subjectSlug}/create-lesson`}
    className="btn-green"
    style={{ padding: "0.5rem 1rem", textDecoration: "none" }}
  >
    + Create Lesson in {subjectName}
  </Link>
</div>

      {/* List of Existing Lessons */}
      <div className="subject-list">
        {lessons.map((lesson, idx) => (
          <Link
            key={lesson.id}
            to={`/subject/${subjectSlug}/${lesson.id}`}
            className="subject-card"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <img src={lesson.icon} alt={lesson.title} className="subject-icon" />
            <h3>{lesson.title}</h3>
            <p>{lesson.description}</p>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Link to="/subjects" className="btn-back">
          ← Back to Subjects
        </Link>
      </div>
    </div>
  );
}
