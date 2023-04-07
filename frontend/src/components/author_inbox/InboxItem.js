
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import FollowAcceptReject from './FollowAcceptReject';
import LikePost from './LikePost';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';


function InboxItem(props) {

    const message  = props.message;
    var user_origin = "";
    var extras = "";
    var card_style;

    switch(message.type){
        case "post":
            var content_to_render;
            if (message.contentType === 'text/plain'){
                content_to_render = <Card.Text>{message.content}</Card.Text>
            } else if (message.contentType === 'text/markdown') {
                content_to_render = <ReactMarkdown>{message.content}</ReactMarkdown>
            } else {
                content_to_render = <Card.Img variant="top" src= {message.content} alt = "This is the uploaded image" />
            }
            return (
                <Card style={{ width: '100%' }} border={"success"}>
                <Card.Body>
                    <Card.Title>{message.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{message.type}</Card.Subtitle>
                    {content_to_render}
                    <LikePost  message={message} author={props.author} authString={props.authString} />
                </Card.Body>
                </Card>
            );
        case "comment":
            return (
                <Card style={{ width: '100%' }} border={"info"}>
                <Card.Body>
                    <Card.Title>{message.comment}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{message.type}</Card.Subtitle>
                    {/* <Card.Text>{message.summary}</Card.Text> */}
                    <Card.Link href={message.author.id}>{message.author.displayName}</Card.Link>
                </Card.Body>
                </Card>
            )
        case "like":
            card_style = "success";
            break;
        case "Follow":
            return (
                <Card style={{ width: '100%' }} border={"info"}>
                <Card.Body>
                    <Card.Title>{message.summary}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{message.type}</Card.Subtitle>
                    <Card.Text>{message.summary}</Card.Text>
                    <Card.Link href={message.actor.url}>{message.actor.displayName}</Card.Link>
                    <FollowAcceptReject message={message} author={props.author} authString={props.authString} />
                </Card.Body>
                </Card>
            );
        default:
            card_style = "warning";
    }
    
    return (
        <Card style={{ width: '100%' }} border={card_style}>
        <Card.Body>
            <Card.Title>{message.summary}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{message.type}</Card.Subtitle>
            <Card.Text>{message.summary}</Card.Text>
        {user_origin}
        {extras}
        </Card.Body>
        </Card>
    );
}

export default InboxItem;
