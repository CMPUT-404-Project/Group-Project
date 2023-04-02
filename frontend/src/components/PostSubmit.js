
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { Component, useState, ChangeEvent, useRef } from 'react';   
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { gatherAll } from '../Logic';
import { determine_inbox_endpoint } from './helper_functions';
import PostAddIcon from '@mui/icons-material/PostAdd';
import IconButton from "@mui/material/IconButton";





function PostSubmit(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [contentType, setContentType] = useState('text/plain');
  const [privateFriendTarget, setPrivateFriendTarget] = useState('');
  const [showUploadOption, setShowUploadOption] = useState(false);
  const [showTextOption, setShowTextOption] = useState(true);

  const handleContentChange = (e) => {
    console.log(contentType);
    setContentType(e.target.value);
    console.log(contentType);
    setShowUploadOption((contentType === 'image/png;base64') || (contentType ==='image/jpeg;base64') || (contentType ==='application/base64'));
    setShowTextOption(contentType === 'text/plain'||contentType === 'text/markdown');
  };

  
  const discardContent = () => {
    setContactInfo({
      title: "",
      source: "",
      origin: "",
      description: "",
      contentType: "text/plain",
      content: "",
      author: props.author,
      categories: "",
      comments: "",
      visibility: "PUBLIC",
      fileToUpload: null,
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
    categories: "",
    comments: "",
    visibility: "PUBLIC",
    unlisted: false,
    image: null,
  });

  const [picture, setPicture] = useState(null);
  // function getBase64(file) {
  //   var reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = function () {
  //     console.log("QWERTYUIOPASDFGHJKLZXCVNM<M");
  //     console.log(reader.result);
  //     setContactInfo({ ...contactInfo, content: reader.result});
  //   };
  //   reader.onerror = function (error) {
  //     console.log('Error: ', error);
  //   };
  // }
  const onChangePicture = e => {
    console.log('picture: ', e.target.files[0]);
    getBase64(e.target.files[0]);
    // setContactInfo({ ...contactInfo, content: event.target.value });
    // setPicture(e.target.files[0]);
};

  const onChangeHandler = (event) => {
    console.log(contactInfo.content);
    setContactInfo({ ...contactInfo, [event.target.name]: event.target.value });
  };

  const { v4: uuidv4 } = require('uuid');

  // Source:  https://stackoverflow.com/questions/6150289/how-can-i-convert-an-image-into-base64-string-using-javascript
  function getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log(reader.result);
      setContactInfo({ ...contactInfo, content: reader.result});
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
 }

 // for rendering the input field for the post content
 var main_content_input;
 if ((contentType === 'image/png;base64') || (contentType ==='image/jpeg;base64') || (contentType ==='application/base64')){
  main_content_input =  <Form.Group className="mb-3" controlId="Add Image">
                          <Form.Label>Post Image</Form.Label>
                          <input type="file" 
                          id = "image"
                          name = "image"
                          accept = "image/png, image/jpeg" onChange={onChangePicture} /> 
                          {/* <img src={file} />  */}
                        </Form.Group>
 } else { // text input
  main_content_input =  <Form.Group className="mb-3" controlId="content">
                          <Form.Label>Post Content</Form.Label>
                          <Form.Control as="textarea" rows={5} placeholder="content" name="content" value={contactInfo.content} onChange={onChangeHandler}/>
                        </Form.Group>
 }

 var form_for_private_post = "";
 if (contactInfo.visibility === "PRIVATE"){
  form_for_private_post = <Form.Group className="mb-3" controlId="friendTarget">
                            <Form.Label>Friend Target</Form.Label>
                            <Form.Control type="text" placeholder="ID of Target" name="friendTarget"
                              value={privateFriendTarget} onChange={(e) => setPrivateFriendTarget(e.target.value)}/>
                          </Form.Group>
 }

  const submitPost = () => {
    var body_of_request = {
      title: contactInfo.title,
      source: props.author.id, // what is this?
      origin: props.author.id, // what is this?
      description: contactInfo.description,
      contentType: contentType,
      content: contactInfo.content,
      author: props.author,
      visibility: contactInfo.visibility,
      unlisted: contactInfo.unlisted,
    }
    if (contactInfo.categories){
      body_of_request.categories = contactInfo.categories.split(',').map(cat => cat.trim());
    }
    fetch(
      props.author.id + '/posts/', // url
      {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + props.authString
        },
        body: JSON.stringify(body_of_request)
      }).then((response) => response.json()).then( (resp) => {
        // if friends: send to your follower's inbox
        // console.log(resp);
        if (contactInfo.visibility === "FRIENDS")
        { // send to followers
          axios.get(props.author.id + '/followers/').then((response) => {
            console.log(response.data);
            response.data.items.forEach( (minion) => {
              axios.post(minion.id + determine_inbox_endpoint(minion.id), resp);
            })
          })
        } else if (contactInfo.visibility === "PRIVATE")
        {
          axios.post(privateFriendTarget + determine_inbox_endpoint(privateFriendTarget), resp);
        }
          
        }
      ).then(function (response) {
        // After Making a post, refresh the main page
        gatherAll(props.author, props.authString).then(result => props.setPostItems(result));
        discardContent();
      });
  };

  return (
    <>
      {/* <Button variant="dark" onClick={handleShow}>
        Create Post
      </Button> */}
      <IconButton size="large" onClick={handleShow}>
        <PostAddIcon/>
    </IconButton>
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
                  <Form.Control as="select" value={contentType}
                    onChange={e => {
                      console.log(e.target.value);
                      // setContactInfo({ ...contactInfo, contentType: e.target.value });
                      // console.log(contactInfo);
                      setContentType(e.target.value);
                      // handleContentChange(e);
                    }}
                  >
                    <option value="text/plain">text/plain</option>
                    <option value="text/markdown">text/markdown</option>
                    <option value="application/base64">application/base64</option>
                    <option value="image/png;base64">image/png;base64</option>
                    <option value="image/jpeg;base64">image/jpeg;base64</option>
                  </Form.Control>
                </Form.Group>

                {/* { showTextOption &&
                <Form.Group className="mb-3" controlId="content">
                    <Form.Label>Post Content</Form.Label>
                    <Form.Control as="textarea" rows={5} placeholder="content" name="content" value={contactInfo.content} onChange={onChangeHandler}/>
                </Form.Group>}

                {showUploadOption &&
                <Form.Group className="mb-3" controlId="Add Image">
                    <Form.Label>Post Image</Form.Label>
                    <input type="file" 
                     id = "image"
                     name = "image"
                     accept = "image/png, image/jpeg" onChange={onChangePicture} /> 
                    {/* <img src={file} />  */}
                {/* </Form.Group> } */} 

                {main_content_input}
                

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
                    <option value="PRIVATE">Private</option>
                  </Form.Control>
                </Form.Group>
                
                {form_for_private_post}
                

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
