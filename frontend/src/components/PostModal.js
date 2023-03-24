
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import CommentCard from './CommentCard';

function PostModal(props) {
    const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // const commentCards = props.postContent.commentsSrc.comments.map((oneComment) => 
  //                       <CommentCard commentData={oneComment} key={oneComment.id} />
  //       );
  let postContent = props.postContent;
  console.log(postContent);

  return (
    <>
      <Button variant="secondary" onClick={handleShow}>
        Expand Post
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{props.postContent.title}</Modal.Title>

        </Modal.Header>
        <Modal.Body>
            {props.postContent.content} <br />
            <p>Source: {postContent.source}</p>
            <p>Origin: {postContent.origin}</p>
            
            {/* {commentCards} */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}


export default PostModal;
