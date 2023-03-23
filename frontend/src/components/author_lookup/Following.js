
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import stubbed_followers from '../stubobject';

// These are the authors that You Follow
function Following(props) {
    const [authors_you_follow, set_authors_you_follow] = useState(stubbed_followers);
    const remove_an_author = (hostname, authorID) => {
        // create a DELETE Request
        // create a GET request
        // repopulate authors_you_follow set_authors_you_follow
        console.log("Unfollowing: ", authorID);
    }

    const authors_you_follow_components = authors_you_follow.items.map((author) => {
        return (<ListGroup.Item key={author.id}>
            {author.displayName}
            <Button variant="outline-danger" onClick={() => remove_an_author(author.host, author.id)}>Unfollow</Button>
        </ListGroup.Item>);
    });
    
    return (
        <>
            <h5> Authors You Follow </h5>
            <ListGroup>
                {authors_you_follow_components}
            </ListGroup>
        </>
    );
}

export default Following;