import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    axios.get('http://localhost:5000/api/quiz') // This will work after Step 3 backend
      .then(res => setQuestions(res.data))
      .catch(err => console.error("Error fetching questions:", err));
  }, []);

  const handleAnswer = (index) => {
    setSelected(index);
    const isCorrect = index === questions[current].correctAnswer;
    setFeedback(isCorrect ? "🎉 Very good! Keep it up!" : "❌ Oops! That's incorrect.");

    setTimeout(() => {
      setSelected(null);
      setFeedback("");
      setCurrent(prev => prev + 1);
    }, 2000);
  };

  if (questions.length === 0) return <p>Loading questions...</p>;
  if (current >= questions.length) return <h2>✅ You finished the quiz!</h2>;

  const q = questions[current];

  return (
    <div className="quiz-question" style={{ padding: "20px" }}>
      <h3>Q{current + 1}: {q.question}</h3>
      {q.options.map((option, i) => (
        <button
          key={i}
          style={{
            display: 'block',
            margin: '10px 0',
            backgroundColor: selected === i ? '#d3d3d3' : ''
          }}
          onClick={() => handleAnswer(i)}
          disabled={selected !== null}
        >
          {String.fromCharCode(97 + i)}) {option}
        </button>
      ))}
      {feedback && <p style={{ marginTop: "10px" }}>{feedback}</p>}
    </div>
  );
};

export default Quiz;
