import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './timetable.css';

const Timetable = ({ user }) => {
  const [timetable, setTimetable] = useState([]);
  const [newEntry, setNewEntry] = useState({ day: '', time: '', subject: '' });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const times = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM"];
  const subjects = ["Math", "English", "Science", "General Knowledge"];

  // ✅ Fetch timetable from backend on load
  useEffect(() => {
    axios.get('http://localhost:5000/api/timetable')
      .then(res => setTimetable(res.data))
      .catch(err => console.error("Failed to load:", err));
  }, []);

  // ✅ Add entry to MongoDB and local state
  const handleAdd = () => {
    let { day, time, subject } = newEntry;

    // Normalize input
    day = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
    subject = subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase();
    if (subject === "Gk") subject = "General Knowledge";

    const validDay = days.includes(day);
    const validTime = times.includes(time);
    const validSubject = subjects.includes(subject);

    if (!validDay || !validTime || !validSubject) {
      alert("❌ Invalid input. Use correct day, time, and subject.");
      return;
    }

    axios.post('http://localhost:5000/api/timetable', { day, time, subject })
      .then(res => {
        setTimetable([...timetable, res.data]);
        setNewEntry({ day: '', time: '', subject: '' });
      })
      .catch(err => console.error("Failed to add:", err));
  };

  // ✅ Remove entry from MongoDB by _id
  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/timetable/${id}`)
      .then(() => {
        setTimetable(timetable.filter(entry => entry._id !== id));
      })
      .catch(err => console.error("Failed to delete:", err));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>{user?.role === 'parent' ? 'Manage Timetable' : 'Your Timetable'}</h2>

      <ul>
        {timetable.map(entry => (
          <li key={entry._id}>
            {entry.day} - {entry.time} - {entry.subject}
            {user?.role === 'parent' && (
              <button onClick={() => handleDelete(entry._id)} style={{ marginLeft: '10px' }}>
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>

      {user?.role === 'parent' && (
        <div style={{ marginTop: '20px' }}>
          <h3>Add Activity</h3>
          <input
            placeholder="Day"
            value={newEntry.day}
            onChange={(e) => setNewEntry({ ...newEntry, day: e.target.value })}
          />
          <input
            placeholder="Time"
            value={newEntry.time}
            onChange={(e) => setNewEntry({ ...newEntry, time: e.target.value })}
          />
          <input
            placeholder="Subject"
            value={newEntry.subject}
            onChange={(e) => setNewEntry({ ...newEntry, subject: e.target.value })}
          />
          <div className="button-row">
            <button onClick={handleAdd}>Add</button>
          </div>
        </div>
      )}

      <div className="timetable-container">
        <h1>School Timetable</h1>
        <table className="timetable">
          <thead>
            <tr>
              <th>Time / Day</th>
              {days.map(day => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map(time => (
              <tr key={time}>
                <td>{time}</td>
                {days.map(day => {
                  const found = timetable.find(
                    entry => entry.day === day && entry.time === time
                  );
                  return <td key={day + time}>{found?.subject || ""}</td>;
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
