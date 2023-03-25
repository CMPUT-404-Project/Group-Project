
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import stubbed_followers from '../stubobject';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios';
import { author_id_to_number, object_is_local } from '../helper_functions';

// These are authors that follow you
function Followers(props) {

    const [your_followers, set_your_followers] = useState([]);
    const remove_a_follower = (hostname, authorID) => {
        // create a DELETE Request
        // create a GET request
        // repopulate your_followers set_your_followers
        console.log("Removing a follower: ", authorID);
        let follower_to_delete = (object_is_local(authorID)) ? author_id_to_number(authorID) : authorID;
        axios.delete(props.author.id + '/followers/'+follower_to_delete).then(
            axios.get(props.author.id + '/followers').then(response => set_your_followers(response.data))
        );
    }

    useEffect(() => {
        axios.get(props.author.id + '/followers').then(response => set_your_followers(response.data));
    } , []);// run this once

    if (your_followers.length === 0){
        return (<h5> Your Followers </h5>)
    }

    const your_followers_components = your_followers.items.map((author) => {
        return (
            <ListGroup.Item key={author.id}>
                {author.displayName}
                <Button variant="outline-danger" onClick={() => remove_a_follower(author.host, author.id)}>Remove</Button>
            </ListGroup.Item>
        );});
    
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
