import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Lesson.css';

export default function SubjectDetail() {
  const { subjectName } = useParams();

  const [showContent, setShowContent] = useState(false);
  const [avatarMoved, setAvatarMoved] = useState(false);
  const [savedLessons, setSavedLessons] = useState([]);

  const formattedSubject = subjectName
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

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

  const subjectIcons = {
    mathematics: '/math.png',
    science: '/science.png',
    english: '/english.png',
    history: '/history.png',
    geography: '/geography.png',
    art: '/art.png',
    'physical-education': '/pe.png',
    music: '/music.png'
  };

  const subjectsData = {
    Mathematics: {
      intro: "Welcome to Mathematics lessons! Here you'll explore exciting topics like numbers, formulas, and fun activities.",
      lessons: [
        { name: "Numbers & Counting", link: "https://youtu.be/ZJEIKkPXirg?si=OUXTfhejmEMQsfJH" },
        { name: "Addition & Subtraction", link: "https://youtu.be/7J1OkxuyLD0?si=P6cBSqSNaT7CG845" },
        { name: "Multiplication & Division", link: "https://youtu.be/i31rRt5m1-4?si=7AKABCipBQwlTnT1" },
        { name: "Shapes & Geometry", link: "https://youtu.be/gk_u1xr7jQg?si=V_LkerVcUPgxPKWB" }
      ]
    },
    Science: {
      intro: "Welcome to Science lessons! Discover the wonders of nature, experiments, and how the world works around us.",
      lessons: [
        { name: "Living Things & Habitats", link: "https://youtu.be/40B2IjLWfTQ?si=hbxJPX7Di_rlinfp" },
        { name: "Materials & Their Properties", link: "https://youtu.be/340MmuY_osY?si=DOzE9Kh2huJEgb9x" },
        { name: "Forces & Motion", link: "https://youtu.be/1R6MxJpEjfs?si=tpgKXfz8wWcWWkjl" },
        { name: "Planets & Space", link: "https://youtu.be/Qd6nLM2QlWw?si=S1NF65xZ4cCHvm5F" }
      ]
    },
    English: {
      intro: "Welcome to English lessons! Improve your reading, writing, and have fun with words and stories.",
      lessons: [
        { name: "Reading Comprehension", link: "https://youtu.be/n9lDqCO0pBQ?si=ttxUB3kY4W_h1wUA" },
        { name: "Grammar & Punctuation", link: "https://youtu.be/mPnSYcxkiKU?si=pIH0Uu4Z01I0mEae" },
        { name: "Creative Writing", link: "https://youtu.be/cYqmNO6gr2Y?si=CMVdz_yin8geu1Ix" },
        { name: "Spelling & Vocabulary", link: "https://youtu.be/uzLarvbMt5s?si=UGnzLbbgf6-Q6b1L" }
      ]
    },
    // Other subjects follow same format...
  };

  const avatarDialogue =
    dialogues[subjectName.toLowerCase()] ||
    "Great pick! 🌟 Let’s explore awesome lessons and have some fun learning!";

  const subjectIcon = subjectIcons[subjectName.toLowerCase()];
  const subjectContent = subjectsData[formattedSubject] || {
    intro: "Welcome! Explore fun topics and activities.",
    lessons: []
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
      setAvatarMoved(true);
    }, 2500);

    fetch('http://localhost:5000/api/lessons')
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.lessons.filter(
          (lesson) =>
            lesson.subject.toLowerCase().replace(/\s+/g, '-') === subjectName.toLowerCase()
        );
        setSavedLessons(filtered);
      })
      .catch((err) => console.error('Error fetching saved lessons:', err));

    return () => clearTimeout(timer);
  }, [subjectName]);

  const handleDeleteLesson = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this lesson?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/lessons/${id}`, {
        method: 'DELETE'
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Lesson deleted");
        setSavedLessons(prev => prev.filter(lesson => lesson._id !== id));
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Failed to delete lesson");
    }
  };

  return (
    <div className="lesson-container">
      <div className={`lesson-avatar ${avatarMoved ? 'moved' : 'centered'}`}>
        <img src="/avatar-bot.png" alt="Buddy Bot" />
        {!avatarMoved && <p>{avatarDialogue}</p>}
      </div>

      {showContent && (
        <div className="subjects-section fade-in">
          {subjectIcon && (
            <img
              src={subjectIcon}
              alt={`${formattedSubject} icon`}
              className="subject-icon"
              style={{ width: '100px', height: '100px', marginBottom: '15px' }}
            />
          )}
          <h1>{formattedSubject}</h1>
          <div className="lesson-card">
            <p>{subjectContent.intro}</p>
            <ul>
              {subjectContent.lessons.map((lesson, index) => (
                <li
                  key={index}
                  style={{ animationDelay: `${0.2 * (index + 1)}s` }}
                  className="fade-in-up lesson-item"
                >
                  {lesson.name}
                  {lesson.link && (
                    <a
                      href={lesson.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lesson-link"
                    >
                      <img
                        src="/youtube-icon.png"
                        alt="Watch on YouTube"
                        className="youtube-icon"
                      />
                    </a>
                  )}
                </li>
              ))}

              {savedLessons.map((lesson, index) => (
                <li
                  key={`saved-${index}`}
                  style={{
                    animationDelay: `${0.2 * (index + subjectContent.lessons.length + 1)}s`
                  }}
                  className="fade-in-up lesson-item"
                >
                  {lesson.title}
                  {lesson.youtubeUrl && (
                    <a
                      href={lesson.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lesson-link"
                    >
                      <img
                        src="/youtube-icon.png"
                        alt="Watch on YouTube"
                        className="youtube-icon"
                      />
                    </a>
                  )}
                  <button
                    onClick={() => handleDeleteLesson(lesson._id)}
                    style={{
                      marginLeft: '10px',
                      backgroundColor: '#e53935',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <p style={{ marginTop: '10px' }}>(🚧 More lessons coming soon!)</p>
          </div>
          <Link to="/lesson" className="back-button">← Back to Lessons</Link>
        </div>
      )}
    </div>
  );
}
