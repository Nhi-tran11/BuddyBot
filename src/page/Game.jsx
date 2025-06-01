import React, { useEffect, useState } from 'react';
import './game.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Game = () => {
  const { subject } = useParams(); // e.g. "math", "science"
  const [view, setView] = useState("instructions");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (subject) {
      axios.get(`http://localhost:5000/api/quiz/${subject.toLowerCase()}`)
        .then(res => {
          setQuestions(res.data);
        })
        .catch(err => console.error(err));
    }
  }, [subject]);

  const handleAnswer = (index) => {
    const isCorrect = index === questions[current].correctAnswer;
    setSelected(index);

    if (isCorrect) {
      setScore(score + 1);
      setFeedback("✅ Great job!");
    } else {
      setFeedback(`❌ Oops! The correct answer was "${questions[current].options[questions[current].correctAnswer]}".`);
    }

    setTimeout(() => {
      setSelected(null);
      setFeedback("");

      if (current + 1 < questions.length) {
        setCurrent(current + 1);
      } else {
        setView("done");
      }
    }, 1500);
  };

  if (!subject) {
    return <div className="game-container"><p>Subject not specified.</p></div>;
  }

  if (view === "instructions") {
    return (
      <div className="game-container">
        <h2>📚 Welcome to the {subject.charAt(0).toUpperCase() + subject.slice(1)} Quiz!</h2>
        <ul style={{ textAlign: "left", lineHeight: "1.8" }}>
          <li>This quiz contains 10 multiple choice questions.</li>
          <li>Each question has four options: (a), (b), (c), and (d).</li>
          <li>Click on the answer you think is correct.</li>
          <li>You will receive instant feedback after answering.</li>
          <li>Try your best to answer all questions correctly!</li>
          <li>You will see your final score at the end.</li>
        </ul>
        <button onClick={() => setView("quiz")}>Start Quiz</button>
      </div>
    );
  }

  if (view === "done") {
    return (
      <div className="game-container">
        <h2>🎉 Quiz Complete!</h2>
        <p>You scored <strong>{score}</strong> out of <strong>{questions.length}</strong>!</p>
        <p>Great job! Keep practicing to improve even more. 🚀</p>
        <button onClick={() => {
          setView("instructions");
          setCurrent(0);
          setScore(0);
          setSelected(null);
          setFeedback("");
        }}>
          Play Again
        </button>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="game-container">
      {questions.length > 0 ? (
        <>
          <h3>Q{current + 1}: {q.question}</h3>
          {q.options.map((opt, index) => (
            <button
              key={index}
              className={selected === index ? "selected" : ""}
              onClick={() => handleAnswer(index)}
              disabled={selected !== null}
            >
              {opt}
            </button>
          ))}
          <p>{feedback}</p>
        </>
      ) : (
        <p>Loading questions...</p>
      )}
    </div>
  );
};

export default Game;
