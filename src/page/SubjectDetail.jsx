import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Lesson.css';  // ✅ Using same CSS

export default function SubjectDetail() {
  const { subjectName } = useParams();

  const [showContent, setShowContent] = useState(false);
  const [avatarMoved, setAvatarMoved] = useState(false);

  // Format subject name
  const formattedSubject = subjectName
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  // Dialogues per subject
  const dialogues = {
    mathematics: "Awesome pick! 🧮 Let’s crunch some numbers and become math wizards together!",
    science: "Whoa, Science! 🧪 Get ready to explore the mysteries of the universe with me 🚀.",
    english: "Brilliant choice! 📖 Let’s dive into stories, words, and magical language adventures!",
    history: "Cool choice! 🏛️ Let’s time-travel and meet heroes & legends from the past!",
    geography: "Adventure awaits! 🌍 Let’s explore mountains, oceans, and faraway places together!",
    art: "Creative vibes! 🎨 Time to splash some colors and make awesome art pieces with me!",
    "physical-education": "Let’s get moving! 🏃‍♂️ Time for fun games and fitness challenges to keep you active!",
    music: "Fantastic! 🎵 Let’s jam, sing, and explore the magical world of music together!"
  };

  const avatarDialogue =
    dialogues[subjectName.toLowerCase()] ||
    "Great pick! 🌟 Let’s explore awesome lessons and have some fun learning!";

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
      setAvatarMoved(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [subjectName]);

  return (
    <div className="lesson-container">
      {/* Avatar greeting */}
      <div className={`lesson-avatar ${avatarMoved ? 'moved' : 'centered'}`}>
        <img src="/avatar-bot.png" alt="Buddy Bot" />
        {!avatarMoved && <p>{avatarDialogue}</p>}
      </div>

      {/* Main content after greeting */}
      {showContent && (
        <div className="subjects-section fade-in">
          <h1>{formattedSubject}</h1>
          <p>Welcome to the {formattedSubject} lessons and resources page.</p>
          <p>Here you will find topics, assignments, and other helpful materials for {formattedSubject}.</p>

          <Link to="/lesson" className="back-button">← Back to Lessons</Link>
        </div>
      )}
    </div>
  );
}

