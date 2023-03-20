
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import stubbed_followers from '../stubobject';
import ListGroup from 'react-bootstrap/ListGroup';

// These are authors that follow you
function Followers(props) {

    const [your_followers, set_your_followers] = useState(stubbed_followers);
    const remove_a_follower = (hostname, authorID) => {
        // create a DELETE Request
        // create a GET request
        // repopulate your_followers set_your_followers
        console.log("Removing a follower: ", authorID);
    }

    const your_followers_components = your_followers.items.map((author) => {
        return (<ListGroup.Item key={author.id}>
            {author.displayName}
            <Button variant="outline-danger" onClick={() => remove_a_follower(author.host, author.id)}>Remove</Button>
        </ListGroup.Item>);
    });
    
    return (
        <>
            <h5> Your Followers </h5>
            <ListGroup>
                {your_followers_components}
            </ListGroup>
        </>
    );
}

export default Followers;
