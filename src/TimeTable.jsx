import React, { useState } from "react";
import "./TimeTable.css";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const times = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM"];
const subjects = ["Math", "English", "Science", "General Knowledge"];

const TimeTable = () => {
  const [tableData, setTableData] = useState({});

  const handleAdd = () => {
    let day = prompt("Enter Day (e.g., Monday):").trim();
    let time = prompt("Enter Time (e.g., 11:00 AM):").trim();
    let subject = prompt("Enter Subject (Math, English, Science, General Knowledge):").trim();

    // Normalize casing
    day = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
    subject = subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase();

    // Allow short version for General Knowledge
    if (subject === "Gk") subject = "General Knowledge";

    const validDay = days.includes(day);
    const validTime = times.includes(time);
    const validSubject = subjects.includes(subject);

    if (validDay && validTime && validSubject) {
      setTableData(prev => ({
        ...prev,
        [day + time]: subject,
      }));
    } else {
      alert("❌ Invalid input. Make sure day/time/subject match available options.");
    }
  };

  const handleRemove = () => {
    let day = prompt("Enter Day to remove (e.g., Tuesday):").trim();
    let time = prompt("Enter Time to remove (e.g., 10:00 AM):").trim();

    day = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();

    const validDay = days.includes(day);
    const validTime = times.includes(time);

    if (validDay && validTime) {
      setTableData(prev => {
        const updated = { ...prev };
        delete updated[day + time];
        return updated;
      });
    } else {
      alert("❌ Invalid input. Please check your Day and Time.");
    }
  };

  return (
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

      <div className="button-row">
        <button onClick={handleAdd}>Add</button>
        <button onClick={handleRemove}>Remove</button>
      </div>
    </div>
  );
};

export default TimeTable;
