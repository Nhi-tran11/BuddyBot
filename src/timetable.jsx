import React, { useState } from 'react';
import './timetable.css';

const Timetable = ({ user }) => {
  const [timetable, setTimetable] = useState([
    { id: 1, day: 'Monday', time: '10:00 AM', subject: 'Math' },
    { id: 2, day: 'Tuesday', time: '11:00 AM', subject: 'Science' },
  ]);

  const [tableData, setTableData] = useState({});
  const [newEntry, setNewEntry] = useState({ day: '', time: '', subject: '' });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const times = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM"];
  const subjects = ["Math", "English", "Science", "General Knowledge"];

  const handleAdd = () => {
    const id = Date.now();
    let { day, time, subject } = newEntry;

    // Normalize input
    day = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
    subject = subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase();
    if (subject === "Gk") subject = "General Knowledge";

    const validDay = days.includes(day);
    const validTime = times.includes(time);
    const validSubject = subjects.includes(subject);

    if (validDay && validTime && validSubject) {
      setTimetable([...timetable, { id, day, time, subject }]);
      setTableData(prev => ({ ...prev, [day + time]: subject }));
      setNewEntry({ day: '', time: '', subject: '' });
    } else {
      alert("❌ Invalid input. Use correct day, time, and subject.");
    }
  };

  const handleRemove = () => {
    let { day, time } = newEntry;
    day = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();

    if (days.includes(day) && times.includes(time)) {
      const updated = { ...tableData };
      delete updated[day + time];
      setTableData(updated);
    } else {
      alert("❌ Invalid input. Please check Day and Time.");
    }
  };

  const handleDelete = (id) => {
    setTimetable(timetable.filter(entry => entry.id !== id));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>{user?.role === 'parent' ? 'Manage Timetable' : 'Your Timetable'}</h2>

      <ul>
        {timetable.map(entry => (
          <li key={entry.id}>
            {entry.day} - {entry.time} - {entry.subject}
            {user?.role === 'parent' && (
              <button onClick={() => handleDelete(entry.id)} style={{ marginLeft: '10px' }}>
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
            <button onClick={handleRemove}>Remove</button>
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
                {days.map(day => (
                  <td key={day + time}>
                    {tableData[day + time] || ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timetable;
