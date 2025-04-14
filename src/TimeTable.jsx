import React, { useState } from 'react';

const Timetable = ({ user }) => {
  const [timetable, setTimetable] = useState([
    { id: 1, day: 'Monday', time: '10:00 AM', subject: 'Math' },
    { id: 2, day: 'Tuesday', time: '11:00 AM', subject: 'Science' },
  ]);

  const [newEntry, setNewEntry] = useState({ day: '', time: '', subject: '' });

  const handleAdd = () => {
    const id = Date.now();
    setTimetable([...timetable, { id, ...newEntry }]);
    setNewEntry({ day: '', time: '', subject: '' });
  };

  const handleDelete = (id) => {
    setTimetable(timetable.filter(entry => entry.id !== id));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>{user.role === 'parent' ? 'Manage Timetable' : 'Your Timetable'}</h2>

      <ul>
        {timetable.map(entry => (
          <li key={entry.id}>
            {entry.day} - {entry.time} - {entry.subject}
            {user.role === 'parent' && (
              <button onClick={() => handleDelete(entry.id)} style={{ marginLeft: '10px' }}>
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>

      {user.role === 'parent' && (
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
          <button onClick={handleAdd}>Add</button>
        </div>
      )}
    </div>
  );
};

export default Timetable;
