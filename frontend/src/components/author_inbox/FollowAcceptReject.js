
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import axios from 'axios';

function FollowAcceptReject(props) {

    // URL: ://service/authors/{AUTHOR_ID}/followers/{FOREIGN_AUTHOR_ID}
    const acceptFollowRequest = () => {
        console.log(props.message);
        axios.put(
            '', // url
            { // data
                
            },
            { // config

            }
        )
    };

    const rejectFollowRequest = () => {

    };
    
    return (
        <>
            <br/>
            <Button variant='outline-success' onClick={acceptFollowRequest}>Accept</Button>
            <Button variant="outline-danger"  onClick={rejectFollowRequest}>Reject</Button>
        </>
    );
}

export default FollowAcceptReject;
