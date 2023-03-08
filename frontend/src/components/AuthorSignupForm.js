import { useState } from 'react';
import signup from './signup';

const AuthorSignupForm = ({ signedup, setSignedup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [github, setGithub] = useState('');
  

  const handleSignup = async (event) => {
    event.preventDefault();
    const result = await signup(username, password, github);
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
          GitHub:
          <input type="text" value={github} onChange={(e) => setGithub(e.target.value)} />
        </label>
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );

  
};

export default AuthorSignupForm;
