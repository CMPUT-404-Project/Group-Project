
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import InboxItem from './InboxItem';
import { useEffect } from 'react';
import axios from 'axios'; 


function AuthorInbox(props) {
    
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const [inboxList, setInboxList] = useState([]);
    const inbox_list_components = inboxList.map((message) => <InboxItem author={props.author} authString={props.authString} message={message} key={message.id}/>);
    // const inbox_list_components = inboxList.map((message) => <InboxItem author={props.author} authString={props.authString} message={message} key={message.id}/>);

    const refresh_inbox = () => {
      axios.get(
        props.author.id +'/inbox/', // url
        { // configs
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + props.authString
            },
        }
      ).then((response) => {
        console.log(response.data.items);
        setInboxList(response.data.items);
      });
    };

    const delete_inbox = () => {
      axios.delete(
        props.author.id +'/inbox/', // url
        { // configs
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + props.authString
            },
        }
      ).then((response) => {
        console.log(response.data.items);
        setInboxList([]);
      });
    };

    useEffect(() => {refresh_inbox()}, []); // run this once at the beginning
    
    return (
        <>
        <Button variant="success" onClick={handleShow}>
          Inbox
        </Button>
  
        <Modal show={show} onHide={handleClose} size="xl" centered>
          <Modal.Header closeButton>
            <Modal.Title>Inbox</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {/* <ListGroup>{inbox_list_components}</ListGroup> */}
            {inbox_list_components}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="outline-danger" onClick={delete_inbox}>
              Clear
            </Button>
            <Button variant="outline-success" onClick={refresh_inbox}>
              Refresh
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
}

export default AuthorInbox;
