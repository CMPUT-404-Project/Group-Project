import { useState } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const LoginForm = ({setAuthString, setUserID, setLoggedin}) => {
  const [authusername, setAuthUsername] = useState('');
  const [authpassword, setAuthPassword] = useState('');
  const [result, setResult] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();

    const authString = `${authusername}:${authpassword}`;
    const encodedAuthString = btoa(authString);

    const response = await fetch('https://distributed-social-net.herokuapp.com/auth/login/', {

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
      axios.get('https://distributed-social-net.herokuapp.com/service/authors/' + authorId)
        .then((response) => {
          // console.log(response.data);
          setAuthString(encodedAuthString);
          setUserID(response.data);
          setLoggedin(true);
        })
    }
  };

  return (
    <div style={{
      position: 'absolute', left: '50%', top: '40%',
      transform: 'translate(-50%, -50%)',
    }}>
    <Card style={{
      width: '25rem',
      // margin: 'auto',
      padding: '2rem'
      }}>

    <h1>Social Distribution</h1>

    <Form onSubmit={handleLogin}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Username</Form.Label>
        <Form.Control type="text" placeholder="Enter username" value={authusername} onChange={(e) => setAuthUsername(e.target.value)}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" value={authpassword} onChange={(e) => setAuthPassword(e.target.value)} />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
      {result && <div>{result.success ? 'Success!' : 'Error: ' + result.message}</div>}
    </Form>

      {/* <form onSubmit={handleLogin}>
        <label>
          Username:
          <input type="text" value={authusername} onChange={(e) => setAuthUsername(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" value={authpassword} onChange={(e) => setAuthPassword(e.target.value)} />
        </label>
        <button type="submit">Log In</button>
        
      </form> */}
    </Card>
    </div>
    
  );
};

export default LoginForm;


