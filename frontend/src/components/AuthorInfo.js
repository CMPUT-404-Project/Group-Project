import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState,useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import Card from 'react-bootstrap/Card';
//import AddComment from './AddComment';


function AuthorInfo(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [username, setUsername] = useState('');
    const [github, setGit] = useState('');
    //const [comments, setComments] = useState('');
    //const [comments, setComments] = useState('');
  
   


console.log(props.postContent.author)
let url = new URL(props.postContent.author.host);

return (
    <>
    <Button variant="outline-info"  onClick={() => {handleShow();}}>
             {props.postContent.author.displayName}
          </Button>

    <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
            <Modal.Title>Author Information</Modal.Title>
        </Modal.Header>
        
    <Modal.Body>

        <p style={{ textAlign: "center" }}> <img src={props.postContent.author.profileImage} width="50" height="50" style={ {borderRadius: "20px" }}/></p>
        <p><b>Display Name: </b>{props.postContent.author.displayName}</p>
        <p><b>Host: </b>{url.host}</p>
        <p><b>Github: </b><a href={props.postContent.author.github}> {props.postContent.author.github} </a>  </p>
        <p><a href={props.postContent.author.id}> User ID </a>  </p>
     

    </Modal.Body>

    <Modal.Footer>
    <Button variant="outline-warning" onClick={handleClose}>
        Close
    </Button>
    </Modal.Footer>
    </Modal>
    </>
)

}

export default AuthorInfo;