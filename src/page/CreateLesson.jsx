// src/pages/CreateLesson.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Lesson.css';

const CreateLesson = () => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    youtubeUrl: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Lesson saved to backend!");
        navigate('/lesson');
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (err) {
      alert("❌ Server error");
      console.error(err);
    }
  };

  return (
    <div className="lesson-container">
      <div className="lesson-card">
        <h2>Create a New Lesson 📘</h2>
        <form onSubmit={handleSubmit}>
          <label>Lesson Title:</label><br />
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          /><br /><br />

          <label>Subject:</label><br />
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Subject --</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            <option value="History">History</option>
            <option value="Geography">Geography</option>
            <option value="Art">Art</option>
            <option value="Physical Education">Physical Education</option>
            <option value="Music">Music</option>
          </select><br /><br />

          <label>Description:</label><br />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            required
          /><br /><br />

          <label>YouTube URL:</label><br />
          <input
            type="url"
            name="youtubeUrl"
            value={formData.youtubeUrl}
            onChange={handleChange}
            required
          /><br /><br />

          <button type="submit" className="back-button">
            ✅ Submit Lesson
          </button>
        </form>

        <button
          onClick={() => navigate('/lesson')}
          className="back-button"
          style={{ backgroundColor: '#ccc', color: '#000', marginTop: '10px' }}
        >
          ← Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateLesson;
