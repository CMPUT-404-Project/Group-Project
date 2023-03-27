import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState,useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from "axios";

function AddComment( props ) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  
  const [content, setContent] = useState('');
  
  const [contactInfo, setContactInfo] = useState({
    author: props.postContent.author,
    
    //url:"",
    type:"comment",
    contentType: "text/plain",
    comment:"",

  });

  // const onChangeHandler = (event) => {
  //   setContactInfo({ ...contactInfo, [event.target.name]: event.target.value });
  // };

  const discardContent = () => {
    setContactInfo({
      author: props.postContent.author,
    
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
        }
      
    
    // fetch(
    //     'http://127.0.0.1:8000/service/authors/' + props.postContent.author.id + '/posts/'+ props.postContent.id +'/comments', 
    //     {
    //       method: 'POST',
    //       headers: {
    //           'Accept': '*/*',
    //           'Content-Type': 'application/json',
    //           'Authorization': 'Basic ' + 'UmljaGVlazpwYXNz'//props.authString
    //       },
    //       body: JSON.stringify({
    //         author: contactInfo.author,
    //         //url:"http://127.0.0.1:8000//service/authors/afa3a22920eb4714bd281fc32b0add62/posts/d57301f1a63b47549559931836f965dc/comments",
    //         contentType: contactInfo.contentType,
    //         comments: contactInfo.comment,
    //       })
        }).then(function (response) {
            axios.get( props.postContent.author.id + '/posts').then(res => {
              props.setPostItems(res.data.items);
              discardContent();
            })
          });
      // handle success
      //console.log(`Comment ${commentId} created.`);
    
    // setContent('');
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
            <Button variant="primary" type="submit" onClick={handleSubmit}>
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

export default AddComment;