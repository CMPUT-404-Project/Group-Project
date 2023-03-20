
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';


function InboxItem(props) {

    const message  = props.message;
    var card_style;

    switch(message.type){
        case "post":
            card_style = "success";break;
        case "like":
            card_style = "success";break;
        default:
            card_style = "warning";
    }
    
    return (
        <Card style={{ width: '100%' }} border={card_style}>
        <Card.Body>
            <Card.Title>{message.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{message.description}</Card.Subtitle>
            <Card.Text>{message.content}</Card.Text>
        <Card.Link href={message.author.id}>{message.author.displayName}</Card.Link>
        </Card.Body>
        </Card>
    );
}

export default InboxItem;
