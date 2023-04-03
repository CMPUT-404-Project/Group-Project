
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { gatherAll } from '../../Logic';

function EditProfile(props) {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
 
    const [userInfo, setUserInfo] = useState({
        type: "author",
        id: props.author.id,
        url: props.author.id,
        host: props.author.id,
        displayName: props.author.displayName,
        github: props.author.github,
        profileImage: props.author.profileImage,
      });

    const discardChanges = () => {
        setUserInfo({
            type: "author",
            id: props.author.id,
            url: props.author.id,
            host: props.author.id,
            displayName: props.author.displayName,
            github: props.author.github,
            profileImage: props.author.profileImage,
        })
        setShow(false)
      }

    const saveEdit = () => {
        fetch(
          props.author.id, // url
          {
            method: 'PUT',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + props.authString
            },
            body: JSON.stringify({
              type: "author",
              id: props.author.id,
              url: props.author.id,
              host: props.author.id,
              displayName: userInfo.displayName,
              github: userInfo.github,
              profileImage: userInfo.profileImage,
            })
          }).then((response) => {
            // After Making a post, refresh the
            //gatherAll(props.postContent.author, props.authString).then(result => props.setPostItems(result));
            console.log(response);
            props.setAuthorToDisplay(
              {
                ...props.author,
                displayName: userInfo.displayName,
                github: userInfo.github,
              }
            );
            handleClose();
            // axios.get(props.postContent.author.id + '/posts').then(res => {
            //   props.setPostItems(res.data.items);
            //   handleClose();
            // })
          });
      };
    
    const onChangeHandler = (event) => {
    setUserInfo({ ...userInfo, [event.target.name]: event.target.value });
    };


    const onChangePicture = e => {
        console.log('picture: ', e.target.files[0]);
        getBase64(e.target.files[0]);
        // setContactInfo({ ...contactInfo, content: event.target.value });
        // setPicture(e.target.files[0]);
    };

    function getBase64(file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          console.log(reader.result);
          setUserInfo({ ...userInfo, profileImage: reader.result});
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
     }

    return (
    <>
      <Button variant="outline-secondary" onClick={handleShow}>
        Edit
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Author</Modal.Title>

        </Modal.Header>
        <Modal.Body>
            <Form>
                
                <Form.Group className="mb-3" controlId="description">
                    <Form.Label>Display Name</Form.Label>
                    <Form.Control type="text" placeholder="DisplayName" name="displayName" value={userInfo.displayName} onChange={onChangeHandler}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="github">
                    <Form.Label>Github</Form.Label>
                    <Form.Control as="textarea" placeholder="github" name="github" value={userInfo.github} onChange={onChangeHandler}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="Add Image">
                          <Form.Label>Profile Image</Form.Label>
                          <input type="file" 
                          id = "image"
                          name = "image"
                          accept = "image/png, image/jpeg" onChange={onChangePicture} /> 
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


export default EditProfile;
