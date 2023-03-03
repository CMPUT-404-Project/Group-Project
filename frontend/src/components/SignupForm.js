import React from 'react';
import axios from 'axios';

function SignupForm({ user, setUser, handleSignup }) {

    const handleChange = (e) => {
        setUser({
        ...user,
        [e.target.name]: e.target.value
        });
    
    }
    //   const handleSignup = (e) => {
    //     e.preventDefault();
    //     axios.post('http://127.0.0.1:8000/authors/signup/', user)
    //       .then(response => {
    //         console.log(response.data);
    //       })
    //       .catch(error => {
    //         console.error(error);
    //       });
    
    return (
        <form onSubmit={handleSignup}>
            <label>
                Username:
                <input type="text" name="username" value={user.username} onChange={handleChange} />
            </label>
            <label>
                Password:
                <input type="password" name="password" value={user.password} onChange={handleChange} />
            </label>
            <label>
                displayName:
                <input type="text" name="displayName" value={user.displayName} onChange={handleChange} />
            </label>
            <label>
                host:
                <input type="text" name="host" value={user.host} onChange={handleChange} />
            </label>
            <label>
                url:
                <input type="text" name="url" value={user.url} onChange={handleChange} />
            </label>
            <label>
                github:
                <input type="text" name="github" value={user.github} onChange={handleChange} />
            </label>
            <button type="submit"onClick={() => {
                const result = handleSignup();
                console.log(result); // Use the return value of the function
                }}> 
            Signup 
            </button>
        </form>
   );``
}

export default SignupForm;


