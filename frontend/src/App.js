
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
import AuthorLookup from './components/author_lookup/AuthorLookup';
import AuthorInbox from './components/author_inbox/AuthorInbox';

function App() {
  const [userID, setUserID] = useState({});
  const [authString, setAuthString] = useState('');
  const [postItems, setPostItems] = useState([]);
  useEffect(() => {
    // Update the document title using the browser API
    console.log('hello')
    if (authString !== ''){
      axios.get('http://127.0.0.1:8000/service/authors/' + userID.id + '/posts').then(res => {
      setPostItems(res.data.items)
    })}
  }, [authString]);
  const postItemComponents = postItems.map((onePost) => 
    <Post authString={authString} postObject={onePost} setPostItems={setPostItems} key={onePost.id} />
  );

  const [signedup, setSignedup] = useState(true);
  const [loggedin, setLoggedin] = useState(false);
  if (signedup === false){
    return (
      <div className="App">
        <Navigation />
        <AuthorSignupForm signedup={signedup} setSignedup={setSignedup} />
      </div>
    );
  }

  else if(loggedin === false) {
    return(
      <div className="App">
        <Navigation />
        <AuthorSignupForm signedup={signedup} setSignedup={setSignedup} />
        <LoginForm setAuthString={setAuthString} setUserID={setUserID} setLoggedin={setLoggedin}/>
      </div>
    );
  }

  else if (loggedin === true) {
    return (
      <div className="App">
        <Navigation />

        {/* Author Actions */}
        <PostSubmit authString={authString} author={userID} setPostItems={setPostItems}/>
        <AuthorLookup author={userID} />
        <AuthorInbox author={userID} />



        {postItemComponents}
        <p>{userID.id}</p>
        <GithubActivity userID={userID.id}/>
      </div>
    );
  }
  
  
}
ReactDOM.render(<App />, document.getElementById('root'));
export default App;


