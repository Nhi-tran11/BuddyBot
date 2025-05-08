import React, { useEffect, useState } from 'react';
import './game.css';
import axios from 'axios';


const Game = () => {
  const [view, setView] = useState("instructions"); 
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/quiz') 
      .then(res => {
        console.log("Fetched quiz data:", res.data);
        setQuestions(res.data);
  })
      .catch(err => console.error(err));
  }, []);

  const handleAnswer = (index) => {
    const isCorrect = index === questions[current].correctAnswer;
    setSelected(index);
    setFeedback(isCorrect ? "✅ Great job!" : "❌ Oops! Try the next one.");

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

  if (view === "instructions") {
    return (
      <div className="game-container">
      <h2>📚 Welcome to the BuddyBot Math Quiz!</h2>
      <ul style={{ textAlign: "left", lineHeight: "1.8" }}>
        <li>This quiz contains 10 multiple choice questions.</li>
        <li>Each question has four options: (a), (b), (c), and (d).</li>
        <li>Click on the answer you think is correct.</li>
        <li>You will receive instant feedback after answering.</li>
        <li>Try your best to answer all questions correctly!</li>
        <li>You will see your completion message at the end.</li>
      </ul>
      <button onClick={() => setView("quiz")}>Start Quiz</button>
    </div>
    );
  }

  if (view === "done") {
    return <h2 className="game-container">🎉 Congrats! you finished the quiz!</h2>;
  }

  const q = questions[current];
  console.log("Question state", questions);
  return (
    <div className="game-container">
  {questions.length > 0 ? (
    <>
      <h3>Q{current + 1}: {questions[current].question}</h3>
      {questions[current].options.map((opt, index) => (
        <button
          key={index}
          className={selected === index ? "selected" : ""}
          onClick={() => handleAnswer(index)}
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
