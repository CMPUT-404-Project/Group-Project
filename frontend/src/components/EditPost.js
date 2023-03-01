
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import CommentCard from './CommentCard';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';

function EditPost(props) {
    const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="secondary" onClick={handleShow}>
        Edit Post
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{props.postContent.title}</Modal.Title>

        </Modal.Header>
        <Modal.Body>
            
            <Form>

                <Form.Group className="mb-3" controlId="postTitle">
                    <Form.Label>Post Title</Form.Label>
                    <Form.Control type="text" defaultValue={props.postContent.title}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="postType">
                    <Form.Select>
                        <Form.Label>Post Type</Form.Label>
                        <option>text/markdown</option>
                        <option>text/plain</option>
                        <option>application/base64</option>
                        <option>image/png;base64</option>
                        <option>image/jpeg;base64</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="postContent">
                    <Form.Label>Post Content</Form.Label>
                    <Form.Control type="text" defaultValue={props.postContent.content}/>
                </Form.Group>

            </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleClose}>
            Delete Post
          </Button>
          <Button variant="success" onClick={handleClose}>
            Save
          </Button>
        </Modal.Footer>

      </Modal>
    </>
  );
}


export default EditPost;
