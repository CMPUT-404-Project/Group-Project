
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/esm/Button';
import axios from 'axios'; 


function LikePost(props) {

    const [liked, setLiked] = useState(false);

    

    const message  = props.message;
    var extras = "";
    var card_style;

    useEffect(() => {
        axios.get(
            '' // url
        )
    }, []); // run this the first time it renders

    const processLikeClick = () => {
        console.log(message);
        axios.post(
            message.author.url + '/inbox/', // url
            { // body
                type: "Like",
                author: message.author,
                object: message.url,
           },
            { // config

            }
        )
    };
    
    return (
        <Button variant='outline-success' onClick={processLikeClick}>
            {"<3"}
        </Button>
    );
}

export default LikePost;
