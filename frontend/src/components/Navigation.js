import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function Navigation(props) {
    return (
        <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#">Social Distribution</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Posts</Nav.Link>
            <Nav.Link href="#features">Profile</Nav.Link>
            <Nav.Link href="#pricing">Friends</Nav.Link>
            <Nav.Link href="https://google.com">Google</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    );
}

export default Navigation;