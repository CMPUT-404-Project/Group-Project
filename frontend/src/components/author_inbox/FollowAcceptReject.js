
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import axios from 'axios';
import { author_id_to_number, object_is_local } from '../helper_functions';

function FollowAcceptReject(props) {

    // URL: ://service/authors/{AUTHOR_ID}/followers/{FOREIGN_AUTHOR_ID}
    const acceptFollowRequest = () => {
        // console.log(props.message);
        // console.log('Basic ' + props.authString);
        var actors_id = (object_is_local(props.message.actor.id)) ? author_id_to_number(props.message.actor.id) : props.message.actor;
        axios.put(
            props.author.id + '/followers/' + actors_id, // url
            { // no data
            },
            { headers: { // config
                'Authorization': 'Basic ' + props.authString
            }}
        ).then(console.log("Done!"))
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
