import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TimeTable.css';

const Timetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [newEntry, setNewEntry] = useState({ day: '', time: '', subject: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [shake, setShake] = useState(false);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const times = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM"];
  const subjects = ["Math", "English", "Science", "General Knowledge"];

  // Load timetable data from backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/timetable')
      .then(res => setTimetable(res.data))
      .catch(err => console.error("Failed to load timetable:", err));
  }, []);

  // Add new entry
  const handleAdd = () => {
    const { day, time, subject } = newEntry;

    if (!day || !time || !subject) {
      setErrorMsg("❗ Please fill all fields.");
      setShake(true);
      setTimeout(() => {
        setErrorMsg('');
        setShake(false);
      }, 2000);
      return;
    }

    const slotTaken = timetable.find(entry => entry.day === day && entry.time === time);

    if (slotTaken) {
      setErrorMsg("❌ Slot already full! Choose a different time.");
      setShake(true);
      setTimeout(() => {
        setErrorMsg('');
        setShake(false);
      }, 2000);
      return;
    }

    axios.post('http://localhost:5000/api/timetable', { day, time, subject })
      .then(res => {
        setTimetable([...timetable, res.data]);
        setNewEntry({ day: '', time: '', subject: '' });
      })
      .catch(err => console.error("Failed to add entry:", err));
  };

  // Delete entry
  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/timetable/${id}`)
      .then(() => {
        setTimetable(timetable.filter(entry => entry._id !== id));
      })
      .catch(err => console.error("Failed to delete entry:", err));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Manage Timetable</h2>

      {/* Add Form */}
      <div style={{ marginBottom: '20px' }}>
        <select value={newEntry.day} onChange={e => setNewEntry({ ...newEntry, day: e.target.value })}>
          <option value="">Select Day</option>
          {days.map(day => <option key={day}>{day}</option>)}
        </select>

        <select value={newEntry.time} onChange={e => setNewEntry({ ...newEntry, time: e.target.value })}>
          <option value="">Select Time</option>
          {times.map(time => <option key={time}>{time}</option>)}
        </select>

        <select value={newEntry.subject} onChange={e => setNewEntry({ ...newEntry, subject: e.target.value })}>
          <option value="">Select Subject</option>
          {subjects.map(subject => <option key={subject}>{subject}</option>)}
        </select>

        <div className="button-row">
          <button onClick={handleAdd}>Add</button>
        </div>

        {/* Error message display */}
        {errorMsg && (
          <div className={`error-msg ${shake ? 'shake' : ''}`}>
            {errorMsg}
          </div>
        )}
      </div>

      {/* Raw list view */}
      <ul>
        {timetable.map(entry => (
          <li key={entry._id}>
            {entry.day} - {entry.time} - {entry.subject}
            <button onClick={() => handleDelete(entry._id)} style={{ marginLeft: '10px' }}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Timetable Grid View */}
      <div className="timetable-container">
        <h1>School Timetable</h1>
        <table className="timetable">
          <thead>
            <tr>
              <th>Time / Day</th>
              {days.map(day => <th key={day}>{day}</th>)}
            </tr>
          </thead>
          <tbody>
            {times.map(time => (
              <tr key={time}>
                <td>{time}</td>
                {days.map(day => {
                  const entry = timetable.find(e => e.day === day && e.time === time);
                  return <td key={day + time}>{entry?.subject || ''}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timetable;