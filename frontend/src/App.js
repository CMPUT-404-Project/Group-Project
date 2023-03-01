
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Post from './components/Post';
import PostSubmit from './components/PostSubmit';
import Navigation from './components/Navigation';
import {submitPost, likeData, getPosts} from './Logic';
import { useEffect } from 'react';
import axios from 'axios'; 



function App() {

  // const postItems = getPosts().map((onePost) => 
  //   <Post postObject={onePost} key={onePost.id} />
  // );
  const postItems = {}
  useEffect(() => {
    // Update the document title using the browser API
    console.log('hello')
    axios.get('http://127.0.0.1:8000/authors').then(res => {console.log(res.data)})
  },[]);
  return (
    <div className="App">

      HELLO

      
    </div>
  );
}

export default App;