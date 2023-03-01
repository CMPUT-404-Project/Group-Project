import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import axios from 'axios'; 



function Login(props) {

    const [inputValue, setInputValue] = useState("");
    const onChangeHandler = event => {
        setInputValue(event.target.value);
     };

    const findUserID = () => {
        axios.get('http://127.0.0.1:8000/authors').then(res => {
            const userMatch = res.data.items.filter(author => {return author.displayName === inputValue})
            console.log(userMatch[0])
            if (userMatch.length === 0){ // invalid
                alert("No matches")
            } else {
                props.setUserID(userMatch[0].id)
            }
        })
    }
     

  return (
    <div className="login">

      <input
        type="text"
        name="name"
        onChange={onChangeHandler}
        value={inputValue}
     />
     <Button variant="success" onClick={findUserID}>
        Log In
     </Button>

      
    </div>
  );
}

export default Login;