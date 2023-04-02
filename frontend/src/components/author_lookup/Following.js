
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import stubbed_followers from '../stubobject';
import axios from 'axios';

// These are the authors that You Follow
function Following(props) {
    const [authors_you_follow, set_authors_you_follow] = useState([]);

    useEffect(() => {
        console.log({headers:{Authorization:props.authString}});
        axios.get(props.author.id+"/sendrequest/", {headers:{Authorization:'Basic ' + props.authString}})
        .then((resp) => {
            console.log(resp.data.items);
            // var authors_im_trying_to_follow = resp.data.items.filter((oneRequest) => oneRequest.actor.id===props.author.id)
            //                                     .filter((oneRequest) => !oneRequest.status)
            //                                     .map((oneRequest) => oneRequest.object);
            
            // for (let i=0; i<authors_im_trying_to_follow.length; i++){
            //     // get that person's followers
            //     axios.get(authors_im_trying_to_follow[i].id+'/followers/',)
            //     // check if I'm in it
            //     // if yes, set this row in the table to true

            // }
            set_authors_you_follow(resp.data.items
                            .filter((oneRequest) => oneRequest.actor.id===props.author.id)
                            .filter((oneRequest) => oneRequest.status));
        });
    }, []); // run this when it renders

    const remove_an_author = (hostname, authorID) => {
        // create a DELETE Request
        // create a GET request
        // repopulate authors_you_follow set_authors_you_follow
        console.log("Unfollowing: ", authorID);
    }

    console.log(authors_you_follow);
    const authors_you_follow_components = authors_you_follow.map((author) => {
        return (<ListGroup.Item key={author.id}>
            {author.object.displayName}
            {/* <Button variant="outline-danger" onClick={() => remove_an_author(author.host, author.id)}>Unfollow</Button> */}
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
