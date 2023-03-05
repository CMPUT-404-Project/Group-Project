import { useState } from 'react';
import signup from './signup';

const AuthorSignupForm = ({ signedup, setSignedup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [host, setHost] = useState('');
  const [github, setGithub] = useState('');
  const [url, setUrl] = useState('');
  

  const handleSignup = async (event) => {
    event.preventDefault();
    const result = await signup(username, password, displayName, host, github, url);
    console.log(result);

    if (result.success) {
      // Set the signedup state variable to true when the signup is successful
      setSignedup(true);
    }
  };


  return (
    <form onSubmit={handleSignup}>
      <div>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Display Name:
          <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Host:
          <input type="text" value={host} onChange={(e) => setHost(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          GitHub:
          <input type="text" value={github} onChange={(e) => setGithub(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Url:
          <input type="text" onChange={(e) => setUrl(e.target.value)} />
        </label>
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );

  
};

export default AuthorSignupForm;
