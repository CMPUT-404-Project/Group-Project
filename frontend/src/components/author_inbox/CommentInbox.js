import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/esm/Button';
import axios from 'axios';

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

function CommentInbox(props) {
  const [commented, setCommented] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState(false);

  const message = props.message;
 // const origin = message.origin.endsWith('/') ? message.origin : `${message.origin}/`;

  var authorId, postId;
  if (message.author.id.includes("authors")) {
      authorId = message.author.id.split("/authors/")[1];
      
    } 
  else {
      authorId = message.author.id;  
  }

  if (message.id.includes("posts")) {
      postId = message.id.split("/posts/")[1];
      
    } 
  else {
      postId = message.id;  
  }
  console.log(message);
  //console.log(origin);
  useEffect(() => {
      axios.get(`${props.message.id}/comments`)
          .then(response => {
              setComments(response.data.items);
          })
          .catch(error => {
              console.log(error);
          });
  }, []);
  
  useEffect(() => {
      if (comments.length > 0) {
          setCommented(comments.some(like => like.author.id === props.message.author.id));
          setComment(comments.some(like => like.author.id === props.message.author.id));
      }
  }, [comments, props.message.author.id]);

  
  const handleComment = () => {
    //console.log(props.author.id) //this is me
    //console.log(message.author.id) //this is the author of the post i am seeing in my inbox
    console.log(message)
    // '//service' doesn't work
    if (!commented) {
        setCommented(true);
        setComment(true);
        axios.post(
            `${message.author.id}/inbox/`,
            {
                type: 'comment',
                author: props.author,
                object: message.id,
                summary: `${props.author.displayName} commented on your post`
            },
        )
            .then(response => {
                console.log('sent to inbox');
            })
            .catch(error => {
                console.log(error);
            });
    }
};
  

    return (
        <div>
        <div>
            {handleComment}
                {comments.map((comm) => (
                    <p> {comm.author.displayName} commented on this post</p>
                ))}
            
        </div>
        </div>
    );
}

export default CommentInbox;
