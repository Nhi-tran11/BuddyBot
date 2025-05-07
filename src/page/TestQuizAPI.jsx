import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TestQuizAPI = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/quiz')
      .then(res => {
        console.log("✅ API Response:", res.data);
        setQuestions(res.data);
      })
      .catch(err => {
        console.error("❌ API Fetch Error:", err);
      });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Testing Quiz API</h2>
      <pre>{JSON.stringify(questions, null, 2)}</pre>
    </div>
  );
};

export default TestQuizAPI;
