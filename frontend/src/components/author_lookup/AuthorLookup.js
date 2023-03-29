
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FollowAuthor from './FollowAuthor';
import Following from './Following';
import Followers from './Followers';

function AuthorLookup(props) {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);

    const [contactInfo, setContactInfo] = useState({
        hostaddress: "",
        username: "",
      });
    
      const onChangeHandler = (event) => {
        setContactInfo({ ...contactInfo, [event.target.name]: event.target.value });
      };

    const sendRequest = () => {
        alert("User Request sent!");

        // lookup if the user exists
        // if yes, send follow request
        if (true) {
            setContactInfo({
                hostaddress: "",
                username: "",
            });
            return;
        }
        // if no, send an alert
        alert("No user found! Please check the host/username.")
    };
    
    return (
        <>
        <Button variant="dark" onClick={() => setShow(true)}>
          Author Lookup
        </Button>
  
        <Modal size={'lg'} show={show} onHide={handleClose} centered>

          <Modal.Header closeButton>
            <Modal.Title>Other Authors</Modal.Title>
  
          </Modal.Header>

        <Modal.Body>
            
            <FollowAuthor authString={props.authString} author={props.author}/> <hr />
            {/* <Following authString={props.authString} author={props.author}/> <hr /> */}
            <Followers authString={props.authString} author={props.author}/>

        </Modal.Body>

          {/* <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>

          </Modal.Footer> */}
        </Modal>
      </>
    );
}

export default AuthorLookup;
