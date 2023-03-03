
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import CommentCard from './CommentCard';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

function PostEdit(props) {
    const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const discardChanges = () => {
    setContactInfo({
        postTitle: props.postContent.title,
        postContent: props.postContent.content,
        postID: props.postContent.postID,
      });
      handleClose();
  };

  const saveEdit = () => {
    // do something with the postTitle and postContent variables
    // send the appropriate axios method
    // props.userID will contain the user's ID
    console.log(props.postContent);
    axios.put('http://127.0.0.1:8000/authors/' + props.postContent.author + '/posts/' + props.postContent.id, {
      type: "Post",
      title: contactInfo.postTitle,
      id: props.postContent.id,
      content_type: "text/plain",
      content: contactInfo.postContent,
      caption: null,
      author: props.postContent.author,
      count_likes: 0,
      // published_time: "2023-03-01T03:51:19Z",
      visibility: "PUBLIC",
    })
    .then(function (response) {
      axios.get('http://127.0.0.1:8000/authors/' + props.postContent.author + '/posts').then(res => {
        props.setPostItems(res.data.items)
        handleClose();
        setContactInfo({
        postTitle: contactInfo.postTitle,
        postContent: contactInfo.postContent,
        postID: props.postContent.id,
        })
      })
    })
  };

  const [contactInfo, setContactInfo] = useState({
    postTitle: props.postContent.title,
    postContent: props.postContent.content,
    postID: props.postContent.content,
  });

  const onChangeHandler = (event) => {
    setContactInfo({ ...contactInfo, [event.target.name]: event.target.value });
  };

  return (
    <>
      <Button variant="secondary" onClick={handleShow}>
        Edit Post
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{props.postContent.title}</Modal.Title>

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

          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>

          <Button variant="warning" onClick={discardChanges}>
            Discard Changes
          </Button>
          
          <Button variant="success" onClick={saveEdit}>
            Save
          </Button>

        </Modal.Footer>
      </Modal>
    </>
  );
}


export default PostEdit;
