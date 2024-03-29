
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { gatherAll } from '../Logic';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from "@mui/material/IconButton";

function PostDelete(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [contactInfo, setContactInfo] = useState({
        postTitle: props.postContent.title,
        postContent: props.postContent.content,
        postID: props.postContent.content,
      });

    const handleDelete = () => {
        axios.delete(props.postContent.id)
        .then(function (response) {
                    gatherAll(props.author, props.authString).then(result => props.setPostItems(result));
                    handleClose();
            })
        }
    
        
            return (
                <>
                {/* <Button variant="outline-danger"  onClick={handleShow}>
                         Delete
                      </Button>
     */}        
                <IconButton size="large" onClick={handleShow}>
        <DeleteIcon/>
    </IconButton>
                <Modal show={show} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Confirmation</Modal.Title>
                    </Modal.Header>

                <Modal.Body><div className="alert alert-danger">{"Are you sure you want to delete this Post?"}</div></Modal.Body>

                <Modal.Footer>
                <Button variant="default" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Delete Post
                </Button>
                </Modal.Footer>
                </Modal>
                </>
            )
    }

export default PostDelete;