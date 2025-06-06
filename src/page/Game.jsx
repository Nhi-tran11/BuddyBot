import React, { useEffect, useState } from 'react';
import './game.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Game = () => {
  const { subject } = useParams();
  const [view, setView] = useState("instructions");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [nameEntered, setNameEntered] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [leaders, setLeaders] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("All");

  useEffect(() => {
    if (subject) {
      axios.get(`http://localhost:5000/api/quiz/${subject.toLowerCase()}`)
        .then(res => {
          setQuestions(res.data);
        })
        .catch(err => console.error(err));
    }
  }, [subject]);

  useEffect(() => {
    if (view === "done") {
      axios.post('http://localhost:5000/api/scores', {
        playerName,
        score,
        total: questions.length,
        subject: subject.charAt(0).toUpperCase() + subject.slice(1)
      })
        .then(() => {
          console.log("✅ Score saved");
          setScoreSaved(true);
        })
        .catch(err => {
          console.error("❌ Failed to save score:", err);
          setScoreSaved(false);
        });
    }
  }, [view]);

  useEffect(() => {
    if (view === "leaderboard") {
      const endpoint =
        selectedSubject === "All"
          ? 'http://localhost:5000/api/scores/leaderboard'
          : `http://localhost:5000/api/scores/leaderboard/${selectedSubject}`;

      axios
        .get(endpoint)
        .then((res) => setLeaders(res.data))
        .catch((err) => console.error("Leaderboard fetch error:", err));
    }
  }, [view, selectedSubject]);

  const handleAnswer = (index) => {
    const isCorrect = index === questions[current].correctAnswer;
    setSelected(index);

    if (isCorrect) {
      setScore(score + 1);
      setFeedback("🎉 You got it right!");
    } else {
      setFeedback(`😢 Oops! The correct answer was "${questions[current].options[questions[current].correctAnswer]}".`);
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
    return <div className="game-container"><p>⚠️ Subject not specified.</p></div>;
  }

  if (view === "instructions") {
    return (
      <div className="game-container">
        {!nameEntered ? (
          <>
            <h2>👋 WELCOME! What’s your player name?</h2>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Type your player name here..."
              style={{ padding: "10px", marginBottom: "10px" }}
            />
            <button onClick={() => {
              if (playerName.trim() !== "") setNameEntered(true);
            }}>
              Let's Go! 🚀
            </button>

            <button
              className="choose-topic-btn"
              onClick={() => {
                window.location.href = "/game";
              }}
            >
              ❌ Nope, choose another topic
            </button>
          </>
        ) : (
          <>
            <h2>📚 Welcome {playerName}!</h2>
            <p>Get ready for the <strong>{subject.charAt(0).toUpperCase() + subject.slice(1)}</strong> Quiz!</p>
            <ul style={{ textAlign: "left", lineHeight: "1.8" }}>
              <li>🎯 10 exciting questions await you.</li>
              <li>🧠 Choose the best answer from 4 options.</li>
              <li>💬 Instant feedback after each answer.</li>
              <li>🌟 Score points and have fun!</li>
            </ul>
            <button onClick={() => setView("quiz")}>Start Quiz ➡️</button>
          </>
        )}
      </div>
    );
  }

  if (view === "leaderboard") {
    return (
      <div className="game-container">
        <h2>🏆 Leaderboard</h2>

        <label style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
          Sort by Topic:{" "}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{ padding: "6px", borderRadius: "6px", fontSize: "1rem", marginTop: "10px" }}
          >
            <option value="All">All Subjects</option>
            <option value="Math">Math</option>
            <option value="English">English</option>
            <option value="Science">Science</option>
            <option value="General Knowledge">General Knowledge</option>
          </select>
        </label>

        <ol style={{ marginTop: "20px" }}>
          {leaders.map((player, index) => (
            <li key={index}>
              {player.playerName} — {player.score} / {player.total} ({player.subject})
            </li>
          ))}
        </ol>

        <button
          className="play-again-btn"
          onClick={() => {
            window.location.href = "/game";
          }}
        >
          ⬅️ Back to Start
        </button>
      </div>
    );
  }

  if (view === "done") {
    return (
      <div className="done-view">
        <h2>🏁 All done, {playerName}!</h2>
        <p>You scored <strong>{score}</strong> out of <strong>{questions.length}</strong>! 🎉</p>
        <p>🌟 Awesome job, {playerName}! You’re amazing! 🌟</p>
        {scoreSaved && <p className="score-saved">✅ Score saved!</p>}
        <button
          className="play-again-btn"
          onClick={() => {
            setView("instructions");
            setCurrent(0);
            setScore(0);
            setSelected(null);
            setFeedback("");
            setNameEntered(false);
            setPlayerName("");
            setScoreSaved(false);
          }}
        >
          Play Again 🔄
        </button>

        <button
          className="choose-topic-btn"
          onClick={() => {
            window.location.href = "/game";
          }}
        >
          🎯 Choose Another Topic
        </button>

        <button
          className="leaderboard-btn"
          onClick={() => setView("leaderboard")}
        >
          🏆 View Leaderboard
        </button>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="game-container">
      {questions.length > 0 ? (
        <>
          <h3>🔎 Q{current + 1}: {q.question}</h3>
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
        <p>⏳ Loading questions...</p>
      )}
    </div>
  );
};

export default Game;
