
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import CommentCard from './CommentCard';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';

function AddComment(props) {

  return (
   <>
    <Form>
        <Form.Group className="mb-3" controlId="postComment">
            <Form.Control type="text" placeholder="comment" />
        </Form.Group>
        <Button>
            Add Comment
        </Button>
    </Form>
   </>
  );
}


export default AddComment;
