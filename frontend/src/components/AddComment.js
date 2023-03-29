import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState,useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';

function AddComment( props ) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {setShow(true);}
  
  const [comments, setComments] = useState([]);
  const handleCommentView = () => {
    axios.get( props.postContent.id +'/comments')
    //.then((response) => {setComments(response.data.comments[0].comment);})
    .then((response) => {setComments(response.data.comments)})
    .catch(error => console.log(error));
    }

  useEffect(handleCommentView, [show]);
  var commentView = comments.map((comm) => <Card><Card.Body>{comm.author.displayName}{": "}{comm.comment}</Card.Body></Card>)
  
  
  const [content, setContent] = useState('');
  
  const [contactInfo, setContactInfo] = useState({
    author: props.postContent.author,
    
    //url:"",
    type:"comment",
    contentType: "text/plain",
    comment:"",

  });
  const discardContent = () => {
    setContactInfo({
      author: props.postContent.author,
    
      //url:"",
      type:"comment",
      contentType: "text/plain",
      comment:"",
    })
    // setShow(false)
  }


  const handleSubmit = () => {
    // if (!content) return;
    console.log(props)
    axios.post(
      `${props.postContent.id}/comments`,
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
        }}).then(function (response) {
            axios.get( props.postContent.author.id + '/posts').then(res => {
              props.setPostItems(res.data.items);
              handleCommentView();
              discardContent();
            })
          });
  };

  return (
    <>
    <Button variant="outline-primary" onClick={handleShow}>
        Comment
    </Button>
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Comments</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {/* <Form>
                <Form.Group className="mb-3" controlId="Comment">
                <Form.Control type="text" placeholder="comment" name="comment" value={contactInfo.comment} 
                 onChange={e => {setContactInfo({ ...contactInfo, comment: e.target.value });}}
                 />
                </Form.Group>
            </Form>
            <Button variant="primary" type="submit" onClick={handleSubmit}>
              Submit
            </Button> */}

            <InputGroup className="mb-3">
                <Form.Control type="text" placeholder="comment" name="comment" value={contactInfo.comment} 
                  onChange={e => {setContactInfo({ ...contactInfo, comment: e.target.value });}}/>
                <Button variant="outline-secondary" id="button-addon2" onClick={handleSubmit}>
                    Submit
                </Button> <br />
            </InputGroup>

            {commentView}

        </Modal.Body>
        {/* <Modal.Footer>
            
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
};

export default AddComment;