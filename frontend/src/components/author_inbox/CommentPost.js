import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState,useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from "axios";

function CommentPost( props ) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  
  const [content, setContent] = useState('');
  
  const [contactInfo, setContactInfo] = useState({
    author: props.author,
    type:"comment",
    contentType: "text/plain",
    comment:"",

  });


  const discardContent = () => {
    setContactInfo({
      author: props.author,
      //url:"",
      type:"comment",
      contentType: "text/plain",
      comment:"",
    })
    setShow(false)
  }


  const handleSubmit = () => {
    // if (!content) return;
    console.log(props)
    axios.post(
      `${props.author.id}/inbox/`,
      {
        author: contactInfo.author,
        type: contactInfo.type,
        contentType: contactInfo.contentType,
        comment: contactInfo.comment,
      },
      {
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + props.authString
        }
        }).then(function (response) {
            discardContent();
          });
  };

  return (
    <>
    <Button variant="outline-primary" onClick={handleShow}>
        Add Comment
    </Button>
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Comments</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3" controlId="Comment">
                <Form.Control type="text" placeholder="comment" name="comment" value={contactInfo.comment} 
                 onChange={e => {setContactInfo({ ...contactInfo, comment: e.target.value });}}
                 //onChange={(e) => setContent(e.target.value)}
                 />
                </Form.Group>
            </Form>

        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" type="submit" onClick = {() =>{handleSubmit();}}>
              Submit
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CommentPost;