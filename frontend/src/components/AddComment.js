import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState,useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';

import CommentIcon from '@mui/icons-material/Comment';
import IconButton from "@mui/material/IconButton";

import LikeComment from './author_inbox/LikeComment.js';
import { object_is_local } from './helper_functions';
import { determine_headers } from './helper_functions';
import { determine_inbox_endpoint } from './helper_functions';
import { v4 as uuid } from 'uuid';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';


function AddComment( props ) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {setShow(true);}
  
  const [comments, setComments] = useState([]);
  const handleCommentView = () => {
    console.log(props.postContent)
    console.log(determine_headers(props.postContent.author.id))
    const url_request = props.postContent.id
    axios.get( props.postContent.id +'/comments',
    { 
      headers: determine_headers(props.postContent.author.id),
    }) 

    //.then((response) => {setComments(response.data.comments[0].comment);})
    .then((response) => {
      if((url_request.includes("floating-fjord-51978.herokuapp.com")))
        {setComments(response.data.items)}
      else{
        setComments(response.data.comments)
      }})
    .catch(error => console.log(error));
    }
    

  useEffect(handleCommentView, [show]);
  var commentView = comments?.map((comm) => <Card><Card.Body>{comm.author.displayName}{": "}{comm.comment} <LikeComment comment={comm} author={props.author} authString={props.authString} /></Card.Body></Card>)
  
  
  const [content, setContent] = useState('');
  
  const [contactInfo, setContactInfo] = useState({
    author: props.postContent.author,
    
    //url:"",
    type:"comment",
    contentType: "text/plain",
    comment:"",

  });
  const discardContent = () => {
    setContactInfo({
      author: props.postContent.author,
    
      //url:"",
      type:"comment",
      contentType: "text/plain",
      comment:"",

    })
    // setShow(false)
  }


  const handleSubmit = () => {
    // if (!content) return;
    console.log(props)
    const unique_id = uuid();
    if (props.postContent.visibility.toLowerCase()==="friends" || props.postContent.visibility.toLowerCase()==="private"){
    if (object_is_local(props.postContent.author.id))
    { 
      console.log("Local Post")
      axios.post(
      `${props.postContent.id}/comments`,
      {
        author: props.author,
        type: contactInfo.type,
        contentType: contactInfo.contentType,
        comment: contactInfo.comment,
      },
      {
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + props.authString
        }}).then(function (response) {
          // response.data.type = "comment";
          // response.id = response.id;
          console.log(response.data)
          axios.post(
            `${props.postContent.author.id}/inbox/`,
            response.data,
            {
              headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + props.authString
            }})
            handleCommentView();
            discardContent();
            // axios.get( props.postContent.author.id + '/posts').then(res => {
            //   props.setPostItems(res.data.items);
            //   handleCommentView();
            //   discardContent();
            // })
          });
        }}
      else{
        console.log("Foreign Post")
        axios.post( props.postContent.author.id + determine_inbox_endpoint(props.postContent.author.id), 
        {
          author: props.author,
          type: contactInfo.type,
          contentType: contactInfo.contentType,
          id: props.postContent.id +'/comments/' + unique_id,
          comment: contactInfo.comment,
        }, 
        { 
          headers: determine_headers(props.postContent.author.id)
        }) 
        .then(function (response)
        {
          console.log(response);
          //console.log(props.postContent.id +'/comments/'+ unique_id);
          discardContent();
          handleClose();
        })
        .catch(function (error) 
        {
          console.log(error);
        });

      }
  };

  return (
    <>
    {/* <Button variant="outline-primary" onClick={handleShow}>
        Comment
    </Button> */}
    <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="overlay-example">Comments</Tooltip>}>
    <IconButton onClick={handleShow}>
      <CommentIcon/>
    </IconButton>
    </OverlayTrigger>
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Comments</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {/* <Form>
                <Form.Group className="mb-3" controlId="Comment">
                <Form.Control type="text" placeholder="comment" name="comment" value={contactInfo.comment} 
                 onChange={e => {setContactInfo({ ...contactInfo, comment: e.target.value });}}
                 />
                </Form.Group>
            </Form>
            <Button variant="primary" type="submit" onClick={handleSubmit}>
              Submit
            </Button> */}

            <InputGroup className="mb-3">
                <Form.Control type="text" placeholder="comment" name="comment" value={contactInfo.comment} 
                  onChange={e => {setContactInfo({ ...contactInfo, comment: e.target.value });}}/>
                <Button variant="outline-secondary" id="button-addon2" onClick={handleSubmit}>
                    Submit
                </Button> <br />
            </InputGroup>

            {commentView}

        </Modal.Body>
        {/* <Modal.Footer>
            
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
};

export default AddComment;