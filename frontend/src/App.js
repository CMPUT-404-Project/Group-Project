
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Post from './components/Post';
import PostSubmit from './components/PostSubmit';
import Navigation from './components/Navigation';
import {submitPost, likeData, getPosts} from './Logic';
import { useEffect, useState } from 'react';
import axios from 'axios'; 
import Login from './components/Login';


import AuthorSignupForm from './components/AuthorSignupForm';
import LoginForm from './components/LoginForm';
import GithubActivity from './components/GithubActivity';
import ReactDOM from 'react-dom';
import React from 'react';

function App() {
  const [userID, setUserID] = useState('');
  const [postItems, setPostItems] = useState([]);
  useEffect(() => {
    // Update the document title using the browser API
    console.log('hello')
    if (userID !== ''){
      axios.get('http://127.0.0.1:8000/authors/' + userID + '/posts').then(res => {
      setPostItems(res.data.items)
    })}
  }, [userID]);
  const postItemComponents = postItems.map((onePost) => 
    <Post postObject={onePost} setPostItems={setPostItems} key={onePost.id} />
  );

  // if (userID === ''){ // if the user has not logged in yet

    // return(
    //   <div className="App">
    //     <Navigation />
    //     <Login setUserID={setUserID}/>
    //   </div>
    // );
  // }
  



  // // If we get here, that means that the user has logged in
  // return (
  //   <div className="App">
  //     <Navigation />
  //     <PostSubmit userID={userID} setPostItems={setPostItems}/>
  //     {postItemComponents}
  //     <p>{userID}</p>
  //   </div>
  // );
  //my code
  const [signedup, setSignedup] = useState(false);
  const [loggedin, setLoggedin] = useState(false);
  // if (signedup === false){
  //   return (
  //     <div className="App">
  //       <Navigation />
  //       <AuthorSignupForm signedup={signedup} setSignedup={setSignedup} />
  //     </div>
  //   );
  // }
  //do else here
  //do login

  if(loggedin === false) {
    return(
      <div className="App">
        <Navigation />
        <LoginForm setUserID={setUserID} setLoggedin={setLoggedin}/>
      </div>
    );
  }

  else if (loggedin === true) {
    return (
      <div className="App">
        <Navigation />
        <PostSubmit userID={userID} setPostItems={setPostItems}/>
        {postItemComponents}
        <p>{userID}</p>
        <GithubActivity userID={userID}/>
      </div>
    );
  }
  
  
}
ReactDOM.render(<App />, document.getElementById('root'));
export default App;


