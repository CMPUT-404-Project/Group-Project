
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
import { gatherAll } from './Logic';


import AuthorSignupForm from './components/AuthorSignupForm';
import LoginForm from './components/LoginForm';
import GithubActivity from './components/GithubActivity';
import ReactDOM from 'react-dom';
import React from 'react';
import AuthorLookup from './components/author_lookup/AuthorLookup';
import AuthorInbox from './components/author_inbox/AuthorInbox';
import GithubActivityCard from './components/post_components/GithubActivityCard';

function App() {
  const [userID, setUserID] = useState({});
  const [authString, setAuthString] = useState('');
  const [postItems, setPostItems] = useState([]);
  useEffect(() => {
    // Update the document title using the browser API
    console.log('Loading Posts')
    if (authString !== ''){
      gatherAll(userID, authString).then((result) => {
        console.log(result);
        setPostItems(result);
      })
    }
    

    // if (authString !== ''){
    //   axios.get(userID.id + '/posts').then(res => {
    //   setPostItems(res.data.items)
    // })}
  }, [authString]);
  const postItemComponents = postItems?.map((onePost) => {
    if (onePost.type === "post"){
      return <Post author={userID} authString={authString} postObject={onePost} setPostItems={setPostItems} key={onePost.id} />
    } else {
      return <GithubActivityCard githubContent={onePost} key={onePost.id}/>
    }
  }
    
  );

  const refresh_main_page = () => {
    // make the requests to fetch all posts

    // store them in an array

    // use setPostItems to alter that array
    
  }

  const [signedup, setSignedup] = useState(true);
  const [loggedin, setLoggedin] = useState(false);
  // if (signedup === false){
  //   return (
  //     <div className="App">
  //       <Navigation loggedin={loggedin}/>
  //       <AuthorSignupForm signedup={signedup} setSignedup={setSignedup} />
  //     </div>
  //   );
  // }

  if(loggedin === false) {
    return(
      <div className="App">
        {/* <Navigation loggedin={loggedin}/> */}
        <AuthorSignupForm signedup={signedup} setSignedup={setSignedup} />
        <LoginForm setAuthString={setAuthString} setUserID={setUserID} setLoggedin={setLoggedin}/>
      </div>
    );
  }

  else if (loggedin === true) {
    return (
      <div className="App">
        <Navigation loggedin={loggedin} authString={authString} author={userID} setPostItems={setPostItems} currPosts={postItems}/>

        {/* Author Actions */}
        <PostSubmit authString={authString} author={userID} setPostItems={setPostItems}/>
        <GithubActivity userID={userID.id}/>
        {/* <AuthorLookup authString={authString} author={userID} />
        <AuthorInbox authString={authString} author={userID} /> */} 
        <div style={{
          margin:'auto',
          width: '90%',
          }}>
          {postItemComponents}
        </div>
        {/* <p>{userID.id}</p> */}
        
      </div>
    );
  }
  
  
}
ReactDOM.render(<App />, document.getElementById('root'));
export default App;


