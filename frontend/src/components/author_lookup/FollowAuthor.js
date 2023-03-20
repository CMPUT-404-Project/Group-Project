
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

function FollowAuthor(props) {

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
        // lookup if the user exists
        // if yes, send follow request
        if (true) {
            // make the POST request here
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
        <Form>
            {/* <Form.Group className="mb-3" controlId="hostaddress">
            <Form.Control type="text" placeholder="127.0.0.1" name="hostaddress" value={contactInfo.hostaddress} onChange={onChangeHandler}/>
            </Form.Group> */}
            <h5> Follow Authors </h5>

            <InputGroup className="mb-3">
                <InputGroup.Text id="inputGroup-sizing-default">
                    Host
                </InputGroup.Text>
                {/* <Form.Label>Username</Form.Label> */}
                <Form.Control type="text" placeholder="127.0.0.1" name="hostaddress" value={contactInfo.hostaddress} onChange={onChangeHandler}/>
            </InputGroup>

            {/* <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Username" name="username" value={contactInfo.username} onChange={onChangeHandler}/>
            </Form.Group> */}

            <InputGroup className="mb-3">
                <InputGroup.Text id="inputGroup-sizing-default">
                    User
                </InputGroup.Text>
                {/* <Form.Label>Username</Form.Label> */}
                <Form.Control type="text" placeholder="Username" name="username" value={contactInfo.username} onChange={onChangeHandler}/>
                <Button variant="outline-secondary" id="button-addon2" onClick={sendRequest}>
                    Follow
                </Button>
            </InputGroup>
        </Form>
    );
}

export default FollowAuthor;
