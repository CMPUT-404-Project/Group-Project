
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/esm/Button';
import PostSubmit from './PostSubmit';
import AuthorLookup from './author_lookup/AuthorLookup';
import AuthorInbox from './author_inbox/AuthorInbox';
import { gatherAll } from '../Logic';
import UserProfile from './user_profile/UserProfile';
import GithubActivity from './GithubActivity';
import { useState } from 'react';

function Navigation(props) {
  // if (!props.loggedin){
  //   return (
  //     <Navbar bg="dark" variant="dark">
  //       <Container>
  //         <Navbar.Brand href="#">Social Distribution</Navbar.Brand>
  //         <Nav className="me-auto">
  //         </Nav>
  //       </Container>
  //     </Navbar>
  //   )
  // } else {
    const [authorToDisplay, setAuthorToDisplay] = useState(props.author);
    console.log(props.author);
    return (
      <Navbar sticky="top" bg="success" variant="dark">
      <Container>
        <Navbar.Brand href="#"><h3>Social Distribution</h3></Navbar.Brand>
        <Nav className="me-auto">
          {/* <PostSubmit authString={props.authString} author={props.author} setPostItems={props.setPostItems}/> */}
          <AuthorLookup authString={props.authString} author={props.author} />
          <AuthorInbox authString={props.authString} author={props.author} />
          <GithubActivity userID={props.author.id}/>
          
        </Nav>
        <Nav className="ml-auto">
          <Button variant="secondary" onClick={() => gatherAll(props.author, props.authString)
                                                      .then(result => props.setPostItems(result))}>
            ⟳</Button>
          {/* <Nav.Link>{props.author.displayName}</Nav.Link> */}
          <UserProfile setAuthorToDisplay={setAuthorToDisplay} authorToDisplay={authorToDisplay}  authString={props.authString} author={props.author} postContent={props.postObject} setPostItems={props.setPostItems} />
          <img src={authorToDisplay.profileImage} width="30" height="30" style={ {borderRadius: "20px" }}/>
        

        </Nav>
      </Container>
    </Navbar>
    
  );
  // }
    
}

export default Navigation;
