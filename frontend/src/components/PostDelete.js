
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import CommentCard from './CommentCard';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

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
        axios.delete('http://127.0.0.1:8000/authors/' + props.postContent.author + '/posts/' + props.postContent.id)
        .then(function (response) {
                    axios.get('http://127.0.0.1:8000/authors/' + props.postContent.author + '/posts').then(res => {
                    props.setPostItems(res.data.items)
                    handleClose();
                    setContactInfo({
                    postTitle: contactInfo.postTitle,
                    postContent: contactInfo.postContent,
                    postID: props.postContent.id,
                    })
                })
            })
        }
    
        
            return (
                <>
                <Button variant="danger"  onClick={handleShow}>
                         Delete
                      </Button>
    
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