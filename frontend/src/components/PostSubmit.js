
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { Component, useState } from 'react';   
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
      title: "",
      source: "",
      origin: "",
      description: "",
      contentType: "text/plain",
      content: "",
      author: props.author,
      categories: [],
      comments: "",
      visibility: "PUBLIC",
      unlisted: false,
      image: null,
    })
    setShow(false)
  }

  const [contactInfo, setContactInfo] = useState({
    title: "",
    source: "",
    origin: "",
    description: "",
    contentType: "text/plain",
    content: "",
    author: props.author,
    categories: [],
    comments: "",
    visibility: "PUBLIC",
    unlisted: false,
    image: null,
  });

  const onChangeHandler = (event) => {
    setContactInfo({ ...contactInfo, [event.target.name]: event.target.value });
  };

  const { v4: uuidv4 } = require('uuid');

  // const handleChange = (event) => {
  //   this.setState({
  //     [event.target.id]: event.target.value
  //   })
  // };

  // const handleImageChange = (event) => {
  //   this.setState({
  //     image: event.target.files[0]
  //   })
  // };

  const submitPost = () => {
    fetch(
      props.author.id + '/posts/', // url
      {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + props.authString
        },
        body: JSON.stringify({
          title: contactInfo.title,
          // source: contactInfo.source, // what is this?
          // origin: contactInfo.origin, // what is this?
          source: props.author.host, // what is this?
          origin: props.author.host, // what is this?
          description: contactInfo.description,
          contentType: contactInfo.contentType,
          content: contactInfo.content,
          author: props.author,
          // comments: contactInfo.comments,
          // visibility: contactInfo.visibility,
          // unlisted: contactInfo.unlisted,
          // image: null,
        })
      }).then((response) => response.json()).then( (resp) => {
        console.log(resp);
          axios.get(props.author.id + '/followers/').then((response) => {
            console.log(response.data);
            response.data.items.forEach( (minion) => {
              axios.post(minion.id + '/inbox/', resp);
              axios.post(minion.id + '/inbox', resp);
            })
          })
        }
      ).then(function (response) {
        // After Making a post, refresh the 
        axios.get(props.author.id + '/posts').then(res => {
          props.setPostItems(res.data.items);
          discardContent();
        })
      });
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
                <Form.Group className="mb-3" controlId="title">
                    <Form.Label>Post Title</Form.Label>
                    <Form.Control type="text" placeholder="Title" name="title" value={contactInfo.title} onChange={onChangeHandler}/>
                </Form.Group>
                {/* <Form.Group className="mb-3" controlId="source">
                    <Form.Label>Post source</Form.Label>
                    <Form.Control type="text" placeholder="Enter a valid URL" name="source" value={contactInfo.source} onChange={onChangeHandler}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="origin">
                    <Form.Label>Post origin</Form.Label>
                    <Form.Control type="text" placeholder="Enter a valid URL" name="origin" value={contactInfo.origin} onChange={onChangeHandler}/>
                </Form.Group> */}
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
