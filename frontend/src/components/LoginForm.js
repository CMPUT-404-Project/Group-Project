import { useState } from 'react';
import axios from 'axios';

const LoginForm = ({setAuthString, setUserID, setLoggedin}) => {
  const [authusername, setAuthUsername] = useState('');
  const [authpassword, setAuthPassword] = useState('');
  const [result, setResult] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();

    const authString = `${authusername}:${authpassword}`;
    const encodedAuthString = btoa(authString);

    const response = await fetch('http://127.0.0.1:8000/auth/login/', {

      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Authorization': `Basic ${encodedAuthString}`
      },
      body: new URLSearchParams({
        username: authusername,
        password: authpassword,
      }),
      //credentials: 'include',
    });

    const data = await response.json();
    setResult(data);

    // Handle the author_id field in the response
    if (data.success) {
      const authorId = data.author_id;
      // Do something with the authorId value, such as storing it in state or using it to navigate to a different page
      axios.get('http://127.0.0.1:8000/service/authors/' + authorId)
        .then((response) => {
          // console.log(response.data);
          setAuthString(encodedAuthString);
          setUserID(response.data);
          setLoggedin(true);
        })
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <label>
        Username:
        <input type="text" value={authusername} onChange={(e) => setAuthUsername(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={authpassword} onChange={(e) => setAuthPassword(e.target.value)} />
      </label>
      <button type="submit">Log In</button>
      {result && <div>{result.success ? 'Success!' : 'Error: ' + result.message}</div>}
    </form>
  );
};

export default LoginForm;


