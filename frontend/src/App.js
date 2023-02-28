
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Post from './components/Post';
import PostSubmit from './components/PostSubmit';
import Navigation from './components/Navigation';
import {submitPost, likeData, getPosts} from './Logic';



function App() {

  const postItems = getPosts().map((onePost) => 
    <Post postObject={onePost} key={onePost.id} />
  );

  return (
    <div className="App">

      

      <div id="navbar-area">
        <Navigation />
      </div>
      
      <br /> <br />

      <Container>

      <div id="create-post">
        <PostSubmit submitAction={submitPost}/>
      </div>

      <div id="posts-section">
        {postItems}
      </div>


      <div id="footer-area">
        {/* I guess this is empty for now? */}
      </div>

      </Container>
      
    </div>
  );
}

export default App;