import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/esm/Button';
import axios from 'axios';
import './likestyle.css';

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

function LikePost(props) {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState([]);
    const [hasLiked, setHasLiked] = useState(false);
    const [showLikesList, setShowLikesList] = useState(false);

    const message = props.message;
    const origin = message.origin.endsWith('/') ? message.origin : `${message.origin}/`;
    
    useEffect(() => {
        axios.get(`${props.message.id}/likes`)
            .then(response => {
                setLikes(response.data.items);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);
    
    useEffect(() => {
        if (likes.length > 0) {
            setLiked(likes.some(like => like.author.id === props.author.id));
            setHasLiked(likes.some(like => like.author.id === props.author.id));
        }
    }, [likes, props.message.author.id]);
    

    const processLikeClick = () => {
        //console.log(props.author.id) //this is me
        //console.log(message.author.id) //this is the author of the post i am seeing in my inbox
        console.log(message.id)
        // '//service' doesn't work
        if (!hasLiked) {
            setLiked(true);
            setHasLiked(true);
            axios.post(
                `${props.message.author.id}/inbox/`,
                {
                    type: 'like',
                    author: props.author,
                    object: message.id,
                    summary: `${props.author.displayName} likes your post`
                },
            ).then(response => {console.log('sent to inbox');
                                setLikes([...likes, { author: props.author }])
                                setHasLiked(true);;
                                }
            ).catch(error => {console.log(error);});
            
            axios.post(
                `${props.message.author.id}/inbox`,
                {
                    type: 'like',
                    author: props.author,
                    object: message.id,
                    summary: `${props.author.displayName} likes your post`
                },
            ).then(response => {console.log('sent to inbox');
                                setLikes([...likes, { author: props.author }])
                                setHasLiked(true);;
                                }
            ).catch(error => {console.log(error);});
        }
    };

    const handleLikesListClick = () => {
        setShowLikesList(!showLikesList);
    }


    return (
      <div className="like-post">
          <Button variant="outline-success" onClick={processLikeClick}
            className={liked ? 'like-button liked' : 'like-button'}>
            {liked ? 'Liked' : 'Like'}
          </Button>
          {likes.length > 0 && (
            <div
              className="like-count"
              onClick={() => setShowLikesList(!showLikesList)}
            >
              {likes.length} {likes.length === 1 ? 'like' : 'likes'}
            </div>
          )}
          {showLikesList && (
            <ul className="like-list">
              {likes.map((like, index) => (
                <li key={index}>{like.author.displayName}</li>
              ))}
            </ul>
          )}
        </div>
      );
      
}

export default LikePost;
