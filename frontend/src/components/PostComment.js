
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState,useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import Card from 'react-bootstrap/Card';

function PostComment(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [comments, setComments] = useState([]);

  const handleCommentView = () => {
    axios.get( props.postContent.id +'/comments')
    //.then((response) => {setComments(response.data.comments[0].comment);})
    
    .then((response) => {setComments(response.data.comments)})
    .catch(error => console.log(error));
    }

  var commentView = comments.map((comm) => <Card><Card.Body>{comm.author.displayName}{": "}{comm.comment}</Card.Body></Card>)
  
  
  return (
    <>
    <Button variant="outline-info"  onClick={() => {handleCommentView(); handleShow();}}>
             Comments
          </Button>

    <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
            <Modal.Title>View Comments</Modal.Title>
        </Modal.Header>
        
    <Modal.Body>
    {commentView}
    </Modal.Body>

    <Modal.Footer>
    <Button variant="outline-warning" onClick={handleClose}>
        Close
    </Button>
    </Modal.Footer>
    </Modal>
    </>
)

  }
  
  export default PostComment;