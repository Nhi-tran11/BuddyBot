// src/page/SubjectSelect.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './game.css';

const subjects = [
  { label: "📐 Math", value: "math" },
  { label: "🔬 Science", value: "science" },
  { label: "📚 English", value: "english" },
  { label: "🌍 GK", value: "gk" }
];

const SubjectSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="game-container subject-select">
      <h2>🤖 Choose a Subject to Begin!</h2>
      {subjects.map((subj, idx) => (
        <button key={idx} onClick={() => navigate(`/game/${subj.value}`)}>
          {subj.label}
        </button>
      ))}
    </div>
  );
};

export default SubjectSelect;
