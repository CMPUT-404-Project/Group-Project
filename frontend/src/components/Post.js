
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';

import ListGroup from 'react-bootstrap/ListGroup';
import PostModal from './PostModal';
import PostEdit from './PostEdit';
import PostDelete from './PostDelete';
import SharePost from './SharePost';
import LikePost from './author_inbox/LikePost';
import PostComment from './PostComment';
import AddComment from './AddComment';
import AuthorInfo from './AuthorInfo';
import ReactMarkdown from 'react-markdown';



function Post(props) {


  var main_content = props.postObject.content;
  if (props.postObject.contentType === "text/markdown"){
    main_content = <ReactMarkdown>{props.postObject.content}</ReactMarkdown>
  }

  var visibility_style = "primary"
  if (props.postObject.visibility.toLowerCase()==="friends"){
    visibility_style = "success";
  } else if (props.postObject.visibility.toLowerCase()==="private"){
    visibility_style = "warning";
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
        <Card style={{ width: '100%', margin:'1em' }}>
        {/* use the line below for image posts */}
        { props.postObject.contentType === 'text/plain'||props.postObject.contentType === 'text/markdown'?"":<Card.Img variant="top" src= {props.postObject.content} alt = "This is the uploaded image" />}
        
          {/* The Card.Body can be rendered conditionally. depending on the type of text that it is. */}
          <Card.Body>
            <Card.Title>{props.postObject.title}</Card.Title><Badge bg={visibility_style}>{props.postObject.visibility}</Badge>
            { props.postObject.contentType === 'text/plain'||props.postObject.contentType === 'text/markdown'?<Card.Text>{main_content}</Card.Text>:""}
            {/* <Card.Text>
              {main_content}
            </Card.Text> */}
            <Card.Subtitle className="mb-2 text-muted">{props.postObject.description}</Card.Subtitle>
            {/* implement the onclick for the view comments */}
            {/* <PostModal postContent={props.postObject}/> */}
            {/* <PostComment authString={props.authString} postContent={props.postObject} setPostItems={props.setPostItems}/> */}
            {extra_buttons}
            <AddComment author={props.author} authString={props.authString} postContent={props.postObject} setPostItems={props.setPostItems}/>
            
            {/* <LikePost  message={props.message} author={props.postObject.author} authString={props.authString} /> */}
            <LikePost message={props.postObject} author={props.author} authString={props.authString} />
          </Card.Body>

          <ListGroup variant="flush">
            <ListGroup.Item>
                {/* <img width="100px" src="https://i.imgur.com/k7XVwpB.jpeg" /> */}
                <AuthorInfo author={props.author} authString={props.authString} postContent={props.postObject} setPostItems={props.setPostItems}/>
                {/* | */}
                {/* <Card.Link href={props.postObject.author.github}>Github</Card.Link> */}
            </ListGroup.Item>
        </ListGroup>

          
          
        </Card>
    );
}

export default Post;
