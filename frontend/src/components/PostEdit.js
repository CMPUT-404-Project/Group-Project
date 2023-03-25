
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

function PostEdit(props) {

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const [contactInfo, setContactInfo] = useState(props.postContent);

  const discardChanges = () => {
    setContactInfo(props.postContent);
    handleClose();
  };

  const saveEdit = () => {
    fetch(
      props.postContent.id, // url
      {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + props.authString
        },
        body: JSON.stringify({
          title: contactInfo.title,
          source: contactInfo.source,
          origin: contactInfo.origin,
          description: contactInfo.description,
          contentType: contactInfo.contentType,
          content: contactInfo.content,
          author: props.postContent.author,
          // comments: contactInfo.comments,
          // visibility: contactInfo.visibility,
          // unlisted: contactInfo.unlisted,
          // image: null,
        })
      }).then(function (response) {
        // After Making a post, refresh the 
        axios.get(props.postContent.author.id + '/posts').then(res => {
          props.setPostItems(res.data.items);
          handleClose();
        })
      });
  };

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
          <Modal.Title>Edit Post</Modal.Title>

        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3" controlId="title">
                    <Form.Label>Post Title</Form.Label>
                    <Form.Control type="text" placeholder="Title" name="title" value={contactInfo.title} onChange={onChangeHandler}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="source">
                    <Form.Label>Post source</Form.Label>
                    <Form.Control type="text" placeholder="Enter a valid URL" name="source" value={contactInfo.source} onChange={onChangeHandler}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="origin">
                    <Form.Label>Post origin</Form.Label>
                    <Form.Control type="text" placeholder="Enter a valid URL" name="origin" value={contactInfo.origin} onChange={onChangeHandler}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="description">
                    <Form.Label>Post Description</Form.Label>
                    <Form.Control type="text" placeholder="Post Description" name="description" value={contactInfo.description} onChange={onChangeHandler}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="contentType">
                  <Form.Label>Content Type</Form.Label>
                  <Form.Control as="select" value={contactInfo.contentType}
                    onChange={e => {setContactInfo({ ...contactInfo, contentType: e.target.value });}}
                  >
                    <option value="text/plain">text/plain</option>
                    <option value="text/markdown">text/markdown</option>
                    <option value="application/base64">application/base64</option>
                    <option value="image/png;base64">image/png;base64</option>
                    <option value="image/jpeg;base64">image/jpeg;base64</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId="content">
                    <Form.Label>Post Content</Form.Label>
                    <Form.Control type="text" placeholder="content" name="content" value={contactInfo.content} onChange={onChangeHandler}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="categories">
                    <Form.Label>Post Categories</Form.Label>
                    <Form.Control type="text" placeholder="space separated list of tags" name="categories" value={contactInfo.categories} onChange={onChangeHandler}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="visibility">
                    <Form.Label>Visibility</Form.Label>
                  <Form.Control as="select" value={contactInfo.visibility}
                    onChange={e => {setContactInfo({ ...contactInfo, visibility: e.target.value });}}
                  >
                    <option value="PUBLIC">Public</option>
                    <option value="FRIENDS">Friends</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId="unlisted">
                    {/* <Form.Label>Unlisted</Form.Label> */}
                    <Form.Check
                      type="checkbox"
                      name="unlisted" label="Unlisted"
                      checked={contactInfo.unlisted}
                      onChange={() => setContactInfo({ ...contactInfo, unlisted: !contactInfo.unlisted })}/>
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
