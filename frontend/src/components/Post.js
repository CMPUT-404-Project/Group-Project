
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import ListGroup from 'react-bootstrap/ListGroup';
import PostModal from './PostModal';

function Post(props) {
    
    return (
        <Card style={{ width: '70%', margin:'1em' }}>
        {/* use the line below for image posts */}
          {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
        
          {/* The Card.Body can be rendered conditionally. depending on the type of text that it is. */}
          <Card.Body>
            <Card.Title>{props.postObject.title}</Card.Title>
            <Card.Text>
              {props.postObject.content}
            </Card.Text>
            {/* implement the onclick for the view comments */}
            <PostModal postContent={props.postObject}/>
          </Card.Body>

          <ListGroup variant="flush">
            <ListGroup.Item>
                <img width="100px" src="https://i.imgur.com/k7XVwpB.jpeg" />
                <Card.Link href={props.postObject.author.url}>{props.postObject.author.displayName}</Card.Link>
                |
                <Card.Link href={props.postObject.author.github}>Github</Card.Link>
            </ListGroup.Item>
        </ListGroup>

          
          
        </Card>
    );
}

export default Post;
