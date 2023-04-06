import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/esm/Button';
import axios from 'axios';

import SendIcon from '@mui/icons-material/Send';
import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

import './likestyle.css';

import { determine_headers, determine_inbox_endpoint } from '../helper_functions';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { Text } from 'react-markdown/lib/ast-to-react';

function LikePost(props) {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState([]);
    const [hasLiked, setHasLiked] = useState(false);
    const [showLikesList, setShowLikesList] = useState(false);

    const message = props.message;
    const origin = message.origin.endsWith('/') ? message.origin : `${message.origin}/`;
    var url = `${props.message.id}/likes`;
    var headers = determine_headers(url);
    const inbox = determine_inbox_endpoint(url);
    
    useEffect(() => {
        axios.get(url, { headers })
            .then(response => {
                if (response.data.items){
                    setLikes(response.data.items);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [hasLiked]);
    
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
        const vis = message.visibility.toLowerCase();
        // '//service' doesn't work
        if (!hasLiked) {
            setLiked(true);
            setHasLiked(true);

            var url = `${props.message.author.id}${inbox}`;
            var headers = determine_headers(url);
            if (Object.keys(headers).length === 0) {
              headers = {Authorization: "Basic " + props.authString};
            }
            console.log(headers)
            if (vis === "public") {

              axios.post(
                  url,
                  {
                      type: 'like',
                      author: props.author,
                      object: message.id,
                      summary: `${props.author.displayName} likes your post`
                  },
                  { headers }
              ).then(response => {console.log('sent to inbox');
                                  setLikes([...likes, { author: props.author }])
                                  setHasLiked(true);;
                                  }
              ).catch(error =>  {console.log(error);});
              
             
          }

          else if (vis === 'friends' || vis === 'private') {
            const sub = props.message.id.substring(props.message.id.indexOf('/authors'));
            axios.post('https://distributed-social-net.herokuapp.com/service'+sub+'/likes',{author: props.author})
            .then(response => {
              console.log('like:', response.data);
              const like = response.data;

              axios.post(
                url,
                like,
                { headers }
              ).then(response => {console.log('sent to inbox');
                                  setLikes([...likes, { author: props.author }])
                                  setHasLiked(true);;
                                  }
              ).catch(error => {console.log(error);});
              
              
              })
            .catch(error => {
              console.error('Error liking post:', error);
            });
          }
    };
  }
    const handleLikesListClick = () => {
        setShowLikesList(!showLikesList);
    }

    var likesview = likes?.map((like) => (<p>{like.author.displayName}</p>))

    return (

      <div className="like-post">    
      <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="overlay-example">Like</Tooltip>}>
      <IconButton variant="outline-success" onClick={processLikeClick} className={liked ? "liked" : "not-liked"}>
          {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
      </OverlayTrigger>

      <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="overlay-example">{likesview}</Tooltip>}>
        <Button variant="outline">{likes.length}</Button>
      </OverlayTrigger>

      </div>
      
      );
      
  
}

export default LikePost;
