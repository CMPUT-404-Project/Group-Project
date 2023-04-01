
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import axios from 'axios';
import signup from '../signup';

function FollowAuthor(props) {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    // var actorAuthor = {}; // this is the person we are trying to follow
    // const handleShow = () => setShow(true);

    const [contactInfo, setContactInfo] = useState({
        // hostaddress: "127.0.0.1:8000",
        id: "",
        actorAuthor: {},
      });
    
      const onChangeHandler = (event) => {
        let contactInfoHolder = { ...contactInfo, [event.target.name]: event.target.value };
        setContactInfo(contactInfoHolder);
      };

    const sendRequest = () => {

        // GET the author we want to follow
        axios.get(contactInfo.id)
            .then((response) => {
                console.log(response.data);
                axios.post(
                    // response.data.id + '/inbox/', // url for our database
                    response.data.id + '/inbox', // url for floating fjord
                    { // body
                        "type": "follow",
                        "summary": props.author.displayName + " wants to follow " + response.data.displayName,
                        "actor": props.author,
                        "object": response.data,
                    }, 
                    {
                        'Accept': '*/*',
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + props.authString
                    }
                )

                // DUPLICATED CODE FOR inconsistent APIs
                axios.post(
                    // response.data.id + '/inbox/', // url for our database
                    response.data.id + '/inbox/', // url for floating fjord
                    { // body
                        "type": "follow",
                        "summary": props.author.displayName + " wants to follow " + response.data.displayName,
                        "actor": props.author,
                        "object": response.data,
                    }, 
                    {
                        'Accept': '*/*',
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + props.authString
                    }
                )
            });
    };

    var userPreview = (Object.keys(contactInfo.actorAuthor).length === 0) ? "Username not found" : contactInfo.actorAuthor.displayName;
    
    return (
        <Form>
            <h5> Follow Authors </h5>

            <InputGroup className="mb-3">
                <InputGroup.Text id="inputGroup-sizing-default">
                    UserID
                </InputGroup.Text>
                {/* <Form.Label>Username</Form.Label> */}
                <Form.Control type="text" placeholder="id" name="id" value={contactInfo.id} onChange={onChangeHandler}/>
                <Button variant="outline-secondary" id="button-addon2" onClick={sendRequest}>
                    Follow
                </Button> <br />
            </InputGroup>
            
            <Form.Text className="text-muted">{"Your ID: " + props.author.id}</Form.Text>
        </Form>
    );
}

export default FollowAuthor;
