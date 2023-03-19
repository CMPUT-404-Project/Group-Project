
import './gitstyle.css';
import React, { useState } from 'react';

function GithubActivity({userID}) {
  const [activity, setActivity] = useState([]);

  const handleClick = () => {
    fetch('http://127.0.0.1:8000/authors/github/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userID })
    })
      .then(response => response.json())
      .then(data => {
        setActivity(data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <div>
      <button onClick={handleClick}>View GitHub Activity</button>
      <div className="activity-container">
        {activity.slice(0, 10).map(event => (
          <div className="activity-item" key={event.id}>
            <h3>{event.type}</h3>
            {/* {event.payload.ref_type === 'branch' ? <p>Branch: {event.payload.ref}</p> : null} */}
            {event.type === "CreateEvent" && event.payload.ref_type === "branch" ? (
              <p>Branch: {event.payload.ref}</p>) : null}
            {event.type === "PushEvent" && event.payload.ref.startsWith("refs/heads/") ? (
              <p>Branch: {event.payload.ref.replace("refs/heads/", "")}</p>) : null}
            {event.type === "DeleteEvent" && event.payload.ref_type === "branch" ? (
              <p>Branch: {event.payload.ref}</p>) : null}
              <p>Repository: {event.repo.name}</p>
              <p>Time: {new Date(event.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GithubActivity;