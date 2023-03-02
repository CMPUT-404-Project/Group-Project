
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

function PostSubmit(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  
  const discardContent = () => {
    setContactInfo({
      postTitle: "",
      postContent: "",
      postID: "",
    })
    setShow(false)
  }

  const [contactInfo, setContactInfo] = useState({
    postTitle: "",
    postContent: "",
    postID: "",
  });

  const onChangeHandler = (event) => {
    setContactInfo({ ...contactInfo, [event.target.name]: event.target.value });
  };

  const { v4: uuidv4 } = require('uuid');
  const submitPost = () => {
    // do something with the postTitle and postContent variables
    // send the appropriate axios method
    // props.userID will contain the user's ID
    axios.post('http://127.0.0.1:8000/authors/' + props.userID + '/posts', {
      type: "Post",
      title: contactInfo.postTitle,
      id: uuidv4(),
      content_type: "text/plain",
      content: contactInfo.postContent,
      caption: null,
      author: props.userID,
      count_likes: 0,
      // published_time: "2023-03-01T03:51:19Z",
      visibility: "PUBLIC",
    })
    .then(function (response) {
      axios.get('http://127.0.0.1:8000/authors/' + props.userID + '/posts').then(res => {
        props.setPostItems(res.data.items)
        handleClose();
        setContactInfo({
        postTitle: "",
        postContent: "",
        postID: "",
        })
      })
    })
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Create Post
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3" controlId="postTitle">
                    <Form.Label>Post Title</Form.Label>
                    <Form.Control type="text" placeholder="Title" name="postTitle" value={contactInfo.postTitle} onChange={onChangeHandler}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="postType">
                    <Form.Label>Post Type</Form.Label>
                    <Form.Select>
                        <option>text/markdown</option>
                        <option>text/plain</option>
                        <option>application/base64</option>
                        <option>image/png;base64</option>
                        <option>image/jpeg;base64</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="postContent">
                    <Form.Label>Post Content</Form.Label>
                    <Form.Control type="text" placeholder="content" name="postContent" value={contactInfo.postContent} onChange={onChangeHandler}/>
                </Form.Group>


                
            </Form>

        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" type="submit" onClick={submitPost}>
              Submit
            </Button>
            <Button variant="warning" onClick={discardContent}>
              Discard
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}


export default PostSubmit;
