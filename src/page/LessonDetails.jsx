import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function LessonDetails() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [aiContent, setAiContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessonAndSummary = async () => {
      try {
        const lessonRes = await fetch(`http://localhost:5000/api/lessons`);
        const { lessons } = await lessonRes.json();
        const currentLesson = lessons.find(l => l._id === id);
        setLesson(currentLesson);

        const aiRes = await fetch(`http://localhost:5000/api/lessons/details`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: currentLesson.title })
        });
        const aiData = await aiRes.json();
        setAiContent(aiData.response);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessonAndSummary();
  }, [id]);

  if (loading) return <p>Loading lesson details...</p>;

  if (!lesson) return <p>Lesson not found.</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <h2>{lesson.title}</h2>
      <a href={lesson.youtubeUrl} target="_blank" rel="noopener noreferrer">
        ▶ Watch Video
      </a>

      <h3 style={{ marginTop: '2rem' }}>🧠 AI-Generated Lesson Content</h3>
      <div style={{
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '1rem',
        whiteSpace: 'pre-wrap'
      }}>
        {aiContent}
      </div>

      <Link to="/lesson" style={{ display: 'inline-block', marginTop: '2rem', color: '#007bff' }}>
        ← Back to Lessons
      </Link>
    </div>
  );
}
