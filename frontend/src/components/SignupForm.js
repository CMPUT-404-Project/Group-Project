import React, { useState } from 'react';
import axios from 'axios';

function SignupForm(props) {
    // const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  
    // ...
  

    function handleSubmit(event) {
    event.preventDefault();
    
    axios.post('http://127.0.0.1:8000/authors/signup/', {username, password })
        .then(response => console.log(response.data))
        .catch(error => console.log(error));
    }

    return (
        <form onSubmit={handleSubmit}>
        <label>
            Username:
            <input type="text" value={props.username} onChange={event => props.setUsername(event.target.value)} />
        </label>
        <label>
            Password:
            <input type="password" value={password} onChange={event => setPassword(event.target.value)} />
        </label>
        <button type="submit">Sign up</button>
        </form>
    );
} 

export default SignupForm;
