
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import ListGroup from 'react-bootstrap/ListGroup';
import PostModal from './PostModal';
import PostEdit from './PostEdit';
import PostDelete from './PostDelete';
import LikePost from './author_inbox/LikePost';




function Post(props) {
    
    return (
        <Card style={{ width: '70%', margin:'1em' }}>
        {/* use the line below for image posts */}
          {/* { <Card.Img variant="top" src="https://i.pinimg.com/564x/ff/d9/b7/ffd9b7a367a74742ebf0f4e7c892d815.jpg" alt = "This is the uploaded image" /> } */}
        
          {/* The Card.Body can be rendered conditionally. depending on the type of text that it is. */}
          <Card.Body>
            <Card.Title>{props.postObject.title}</Card.Title>
            <Card.Text>
              {props.postObject.content}
            </Card.Text>
            {/* implement the onclick for the view comments */}
            <PostModal postContent={props.postObject}/>
            <PostEdit authString={props.authString} postContent={props.postObject} setPostItems={props.setPostItems}/>
            <PostDelete postContent={props.postObject} setPostItems={props.setPostItems}/>
            <LikePost message={props.postObject} />
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
