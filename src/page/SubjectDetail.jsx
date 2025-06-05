import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Lesson.css';

export default function SubjectDetail() {
  const { subjectName } = useParams();
  const [showContent, setShowContent] = useState(false);
  const [avatarMoved, setAvatarMoved] = useState(false);
  const [savedLessons, setSavedLessons] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');

  const subjectKeyMap = {
    mathematics: "Mathematics",
    science: "Science",
    english: "English",
    history: "History",
    geography: "Geography",
    art: "Art",
    "physical-education": "Physical Education",
    music: "Music"
  };

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
    History: {
      intro: "Welcome to History lessons! Step back in time to explore ancient civilizations and amazing events of the past.",
      lessons: [
        { name: "Ancient Egypt", link: "https://youtu.be/zYxC14pCaJ0?si=q-fsn3dN-4ze8gg1" },
        { name: "Famous Explorers", link: "https://youtu.be/x__5fmJjAdI?si=wlwHNEuzAHli10jf" },
        { name: "World Wars", link: "https://youtu.be/LQ6dkIW051M?si=OU1MOY7BSwZbUfIO" },
        { name: "Local History", link: "https://youtu.be/XxNZffBuQVY?si=FQybPEGRvL7Q6nzc" }
      ]
    },
    Geography: {
      intro: "Welcome to Geography lessons! Let’s travel the world and learn about places, people, and the environment.",
      lessons: [
        { name: "Continents & Oceans", link: "https://youtu.be/UxUPAKyNmjI?si=a8lsPlObTUdQwl_C" },
        { name: "Weather & Climate", link: "https://youtu.be/YbAWny7FV3w?si=k4Q6PwjFlAJDvz83" },
        { name: "Mountains & Rivers", link: "https://youtu.be/knSqfuwosms?si=L8oyyIHmdgLIehLp" },
        { name: "Maps & Directions", link: "https://youtu.be/mtsx8V3mE8o?si=T6a9JRZ1g13X_EDb" }
      ]
    },
    Art: {
      intro: "Welcome to Art lessons! Get creative with drawing, painting, and exploring your artistic side.",
      lessons: [
        { name: "Drawing Basics", link: "https://youtube.com/playlist?list=PLKeobeGXOefEDbwiJAoHXWg7hLNh0qIiF&si=2F8dvN7ESi8GVEga" },
        { name: "Color Mixing", link: "https://youtu.be/8VgIjFwF_Vs?si=K4K9BEpaySWnoDly" },
        { name: "Famous Artists", link: "https://youtube.com/playlist?list=PLXB5R79dmFB6HpWbgpF8-3aXPqVb_rbj5&si=9SfkK0Y5LBseuR1c" },
        { name: "Craft Projects", link: "https://www.youtube.com/@EasyKidsCraft" }
      ]
    },
    "Physical Education": {
      intro: "Welcome to PE lessons! Stay active and learn about fitness, teamwork, and fun sports activities.",
      lessons: [
        { name: "Warm-Up & Stretching", link: "https://www.youtube.com/watch?v=388Q44ReOWE" },
        { name: "Ball Games", link: "https://youtu.be/3MPoIsZFBMQ?si=PRlEj7ZNrfOwU8ig" },
        { name: "Balance & Coordination", link: "https://youtu.be/xmfcBFcOwi0?si=H_YqSDODBM3CGAEb" },
        { name: "Simple Exercises", link: "https://www.youtube.com/watch?v=L_A_HjHZxfI" }
      ]
    },
    Music: {
      intro: "Welcome to Music lessons! Discover instruments, rhythms, and the joy of making music.",
      lessons: [
        { name: "Singing Basics", link: "https://youtu.be/RaXlNvLHSIc?si=zax6mxIWVX9ntjyC" },
        { name: "Rhythm & Beats", link: "https://youtu.be/HsZzcDjf_js?si=9wLgfC3ee6ANM9xh" },
        { name: "Musical Instruments", link: "https://youtu.be/0A6XwFWD-z0?si=g7TNGvyuF4U88p5B" },
        { name: "Famous Composers", link: "https://youtu.be/TXDiYZnjFmE?si=3k8nK76HLrGHCrf0" }
      ]
    }
  };

  const avatarDialogue =
    dialogues[subjectName.toLowerCase()] || "Great pick! 🌟 Let’s explore awesome lessons and have some fun learning!";
  const subjectIcon = subjectIcons[subjectName.toLowerCase()];
  const subjectKey = subjectKeyMap[subjectName.toLowerCase()];
  const subjectContent = subjectsData[subjectKey] || { intro: "Welcome! Explore fun topics and activities.", lessons: [] };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
      setAvatarMoved(true);
    }, 2500);

    fetch('http://localhost:5000/api/lessons')
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.lessons.filter(
          (lesson) => lesson.subject?.toLowerCase().replace(/\s+/g, '-') === subjectName.toLowerCase()
        );
        setSavedLessons(filtered);
      })
      .catch((err) => console.error('Error fetching saved lessons:', err));

    return () => clearTimeout(timer);
  }, [subjectName]);

  const handleDeleteLesson = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/lessons/${id}`, { method: 'DELETE' });
      if (res.ok) setSavedLessons((prev) => prev.filter((l) => l._id !== id));
      else alert("Failed to delete.");
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Error deleting lesson");
    }
  };

  const handleSaveEdit = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/lessons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, youtubeUrl: editUrl })
      });
      const data = await res.json();
      if (res.ok) {
        setSavedLessons((prev) => prev.map((l) => (l._id === id ? data.lesson : l)));
        setEditingId(null);
      }
    } catch (err) {
      console.error("Update failed:", err);
      alert("❌ Error updating lesson");
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
              alt={`${subjectKey} icon`}
              className="subject-icon"
              style={{ width: '100px', height: '100px', marginBottom: '15px' }}
            />
          )}
          <h1>{subjectKey}</h1>
          <div className="lesson-card">
            <p>{subjectContent.intro}</p>
            <ul>
              {subjectContent.lessons.map((lesson, index) => (
                <li
                  key={`static-${index}`}
                  style={{ animationDelay: `${0.2 * (index + 1)}s` }}
                  className="fade-in-up lesson-item"
                >
                  {lesson.name}
                  <a href={lesson.link} target="_blank" rel="noopener noreferrer" className="lesson-link">
                    <img src="/youtube-icon.png" alt="Watch on YouTube" className="youtube-icon" />
                  </a>
                </li>
              ))}

              {savedLessons.map((lesson, index) => (
                <li
                  key={`saved-${index}`}
                  style={{ animationDelay: `${0.2 * (index + subjectContent.lessons.length + 1)}s` }}
                  className="fade-in-up lesson-item"
                >
                  {editingId === lesson._id ? (
                    <>
                      <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Edit title" />
                      <input value={editUrl} onChange={(e) => setEditUrl(e.target.value)} placeholder="Edit YouTube URL" />
                      <button onClick={() => handleSaveEdit(lesson._id)}>💾 Save</button>
                      <button onClick={() => setEditingId(null)}>❌ Cancel</button>
                    </>
                  ) : (
                    <>
                      {lesson.title}
                      <a href={lesson.youtubeUrl} target="_blank" rel="noopener noreferrer" className="lesson-link">
                        <img src="/youtube-icon.png" alt="Watch on YouTube" className="youtube-icon" />
                      </a>
                      <button
                        onClick={() => {
                          setEditingId(lesson._id);
                          setEditTitle(lesson.title);
                          setEditUrl(lesson.youtubeUrl);
                        }}
                      >
                        📝 Edit
                      </button>
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
                    </>
                  )}
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
