
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import ListGroup from 'react-bootstrap/ListGroup';
import PostModal from './PostModal';
import PostEdit from './PostEdit';
import PostDelete from './PostDelete';
import SharePost from './SharePost';
import LikePost from './author_inbox/LikePost';
import PostComment from './PostComment';
import AddComment from './AddComment';
import ReactMarkdown from 'react-markdown';



function Post(props) {


  var main_content = props.postObject.content;
  if (props.postObject.contentType === "text/markdown"){
    main_content = <ReactMarkdown>{props.postObject.content}</ReactMarkdown>
  }

  var extra_buttons = "";
  if (props.postObject.author.id === props.author.id){
    // if the post is from the logged-in user
    extra_buttons = (
      <>
        <PostEdit authString={props.authString} postContent={props.postObject} setPostItems={props.setPostItems}/>
        <PostDelete author={props.author}  postContent={props.postObject} setPostItems={props.setPostItems}/>
      </>
    )
  } else {
    extra_buttons = (
      <>
        <SharePost authString={props.authString} author={props.author} postContent={props.postObject} setPostItems={props.setPostItems}/>
      </>
    )
  }
    
    return (
        <Card style={{ width: '70%', margin:'1em' }}>
        {/* use the line below for image posts */}
          {/* { <Card.Img variant="top" src="https://i.pinimg.com/564x/ff/d9/b7/ffd9b7a367a74742ebf0f4e7c892d815.jpg" alt = "This is the uploaded image" /> } */}
        
          {/* The Card.Body can be rendered conditionally. depending on the type of text that it is. */}
          <Card.Body>
            <Card.Title>{props.postObject.title}</Card.Title>
            <Card.Text>
              {main_content}
            </Card.Text>
            <Card.Subtitle className="mb-2 text-muted">{props.postObject.description}</Card.Subtitle>
            {/* implement the onclick for the view comments */}
            {/* <PostModal postContent={props.postObject}/> */}
            {/* <PostComment authString={props.authString} postContent={props.postObject} setPostItems={props.setPostItems}/> */}
            {extra_buttons}
            <AddComment author={props.author} authString={props.authString} postContent={props.postObject} setPostItems={props.setPostItems}/>
            
            {/* <LikePost  message={props.message} author={props.postObject.author} authString={props.authString} /> */}
            <LikePost message={props.postObject} author={props.author}/>
          </Card.Body>

          <ListGroup variant="flush">
            <ListGroup.Item>
                {/* <img width="100px" src="https://i.imgur.com/k7XVwpB.jpeg" /> */}
                <Card.Link href={props.postObject.author.url}>{props.postObject.author.displayName}</Card.Link>
                {/* | */}
                {/* <Card.Link href={props.postObject.author.github}>Github</Card.Link> */}
            </ListGroup.Item>
        </ListGroup>

          
          
        </Card>
    );
}

export default Post;
