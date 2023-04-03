
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import axios from 'axios';
import { author_id_to_number, object_is_local } from '../helper_functions';

function FollowAcceptReject(props) {

    const [showAcceptButton, setShowAcceptButton] = useState(false);
    axios.get(props.author.id + '/followers/',{headers:{'Authorization': 'Basic ' + props.authString}})
        .then((resp) => {
            // if they don't already follow me
            if(resp.data.items.filter(aut => aut.id===props.message.actor.id).length === 0){
                setShowAcceptButton(true);
            }
        })

    // URL: ://service/authors/{AUTHOR_ID}/followers/{FOREIGN_AUTHOR_ID}
    const acceptFollowRequest = () => {
        // console.log(props.message);
        // console.log('Basic ' + props.authString);
        var actors_id = (object_is_local(props.message.actor.id)) ? author_id_to_number(props.message.actor.id) : props.message.actor;
        axios.put(
            props.author.id + '/followers/' + author_id_to_number(props.message.actor.id), // url
            { // no data
            },
            { headers: { // config
                'Authorization': 'Basic ' + props.authString
            }}
        ).then(e => {console.log("Done!"); setShowAcceptButton(false);})
    };

    if(!showAcceptButton){
        return (<></>)
    }
 
    return (
        <>
            <br/>
            <Button variant='outline-success' onClick={acceptFollowRequest}>Accept</Button>
            {/* <Button variant="outline-danger"  onClick={rejectFollowRequest}>Reject</Button> */}
        </>
    );
}

export default FollowAcceptReject;
