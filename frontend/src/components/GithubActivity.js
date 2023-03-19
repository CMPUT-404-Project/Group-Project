

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
      {activity.slice(0, 10).map(event => (
        <div key={event.id} style={{border: "1px solid black", padding: "10px", margin: "10px"}}>
          <h3>{event.type}</h3>
          {event.payload.ref_type === 'branch' ? <p>Branch: {event.payload.ref}</p> : null}
          <p>Repository: {event.repo.name}</p>
          <p>Time: {new Date(event.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default GithubActivity;