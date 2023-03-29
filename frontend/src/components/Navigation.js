
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import PostSubmit from './PostSubmit';
import AuthorLookup from './author_lookup/AuthorLookup';
import AuthorInbox from './author_inbox/AuthorInbox';

function Navigation(props) {
  if (!props.loggedin){
    return (
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand href="#">Social Distribution</Navbar.Brand>
          <Nav className="me-auto">
          </Nav>
        </Container>
      </Navbar>
    )
  } else {
    return (
      <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#">Social Distribution</Navbar.Brand>
        <Nav className="me-auto">
          <PostSubmit authString={props.authString} author={props.author} setPostItems={props.setPostItems}/>
          <AuthorLookup authString={props.authString} author={props.author} />
          <AuthorInbox authString={props.authString} author={props.author} />
          
        </Nav>
      </Container>
    </Navbar>
  );
  }
    
}

export default Navigation;
