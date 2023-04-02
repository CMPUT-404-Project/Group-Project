
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { gatherAll } from '../Logic';

function SharePost(props) {

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const [contactInfo, setContactInfo] = useState(props.postContent);



  const [shareInput, setShareInput] = useState("")
  const onChangeHandler = (event) => {
    setContactInfo();
  };

  const saveEdit = () => {
    console.log(shareInput);
    console.log(props.postContent);
    // clone the post content type: https://www.samanthaming.com/tidbits/70-3-ways-to-clone-objects/
    const clonePost = JSON.parse(JSON.stringify(props.postContent));
    clonePost.source = props.author.id;
    // clonePost.source = props.author; // idk if this is how it's supposed to be
    console.log(clonePost);
    if (shareInput == "PUBLIC"){
        // send it to everyone
        
        axios.post(
          props.author.id + '/posts/', // url
          clonePost,
          {
            headers: {
              'Accept': '*/*',
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + props.authString
            }
          }
        ).then(() => {
          gatherAll(props.author).then(result => props.setPostItems(result));
          handleClose();
        })
    } else {
        // send to followers only
        axios.post(
          props.author.id + '/posts/', // url
          clonePost,
          {
            headers: {
              'Accept': '*/*',
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + props.authString
            }
          }
        ).then(() => {
          gatherAll(props.author).then(result => props.setPostItems(result));
          handleClose();
        })
    }
    
  };

  return (
    <>
      <Button variant="outline-info" onClick={handleShow}>
        Share
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Share Post</Modal.Title>

        </Modal.Header>
        <Modal.Body>
            <Form>

                <Form.Group className="mb-3" controlId="visibility">
                    <Form.Label>Visibility</Form.Label>
                  <Form.Control as="select" value={shareInput}
                    onChange={e => {
                        setShareInput(e.target.value);
                    }}
                  >
                    {/* cannot share to public if visibility is only for friends */}
                    <option value="PUBLIC" disabled={(props.postContent.visibility === "FRIENDS")}>Public</option>
                    <option value="FRIENDS">Friends</option>
                  </Form.Control>
                </Form.Group>
                
            </Form>

        </Modal.Body>
        <Modal.Footer>

          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>

          {/* <Button variant="warning" onClick={discardChanges}>
            Discard Changes
          </Button> */}
          
          <Button variant="success" onClick={saveEdit}>
            Share
          </Button>

        </Modal.Footer>
      </Modal>
    </>
  );
}


export default SharePost;