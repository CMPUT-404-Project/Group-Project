
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

  return (
    <>
      <Button variant="secondary" onClick={handleShow}>
        View Comments
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{props.postContent.title}</Modal.Title>

        </Modal.Header>
        <Modal.Body>
            {props.postContent.content}
            
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
