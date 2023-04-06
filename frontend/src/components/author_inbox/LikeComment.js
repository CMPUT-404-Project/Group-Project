import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/esm/Button';
import axios from 'axios';
import './likestyle.css';
import { determine_headers, determine_inbox_endpoint } from '../helper_functions';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

function LikeComment(props) {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState([]);
    const [hasLiked, setHasLiked] = useState(false);
    const [showLikesList, setShowLikesList] = useState(false);

    const comm = props.comment;
    var url = `${comm.id}/likes`;
    var headers = determine_headers(url);
    // const origin = message.origin.endsWith('/') ? message.origin : `${message.origin}/`;
   
    
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
    }, []);
    
    useEffect(() => {
        if (likes && likes.length > 0) {
            setLiked(likes.some(like => like.author.id === props.author.id));
            setHasLiked(likes.some(like => like.author.id === props.author.id));
        }
    }, [likes, comm.author.id]);
    

    const processLikeClick = () => {
        //console.log(props.author.id) //this is me
        //console.log(message.author.id) //this is the author of the post i am seeing in my inbox
        const vis = props.vis.toLowerCase();
      
        // '//service' doesn't work
        if (!hasLiked) {
            setLiked(true);
            setHasLiked(true);
            const post = props.post;
            var uri = `${comm.author.id}`;
            var inbox = determine_inbox_endpoint(uri);
            var url = `${comm.author.id}${inbox}`;
            
            var headers = determine_headers(url);
            
            if (Object.keys(headers).length === 0) {
              headers = {Authorization: "Basic " + props.authString};
            }
            if (vis === "public") {
            
            axios.post(
                url,
                {
                    type: 'like',
                    author: props.author,
                    object: comm.id,
                    summary: `${props.author.displayName} likes your comment`
                },
                { headers }
            ).then(response => {console.log('sent to inbox');
                                setLikes([...likes, { author: props.author }])
                                setHasLiked(true);;
                                }
            ).catch(error => {if (error.response && error.response.data.message === "Post does not exist in our database"){
                                console.log('error handling');
                                uri = `${post.author.id}`;
                                inbox = determine_inbox_endpoint(uri);
                                uri = `${post.author.id}${inbox}`;
                                var header = determine_headers(uri);
                                console.log('headers are here>');
                                console.log(header);
                                axios.post(
                                  uri,
                                  {
                                      type: 'Like',
                                      author: props.author,
                                      object: comm.id,
                                      summary: `${props.author.displayName} likes a comment on your post`
                                  },
                                  {headers: header}
                                ).then(response => {console.log('sent to inbox');
                                                  setLikes([...likes, { author: props.author }])
                                                  setHasLiked(true);})

                              } else {
                                console.log(error);
                              }
                              });
            
          }

          else if (vis === 'friends' || vis === 'private') {
            const sub = comm.id.substring(comm.id.indexOf('/authors'));
            console.log('in friends')
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
              console.error('Error liking comment:', error);
            });
          };
      }
    }

    const handleLikesListClick = () => {
        setShowLikesList(!showLikesList);
    }

    var likesview = likes?.map((like) => (<p>{like.author.displayName}</p>))
    return (
        // <div className="like-post">
        // <IconButton variant="outline-success" onClick={processLikeClick}
        //     className={liked ? <IconButton><FavoriteIcon/></IconButton> : <IconButton><FavoriteBorderIcon/></IconButton>}>
        //     {liked ? <IconButton><FavoriteIcon/></IconButton> : <IconButton><FavoriteBorderIcon/></IconButton>}
        //   </IconButton>
        //   {likes && likes.length >= 0 && (
        //     <div
        //       className="like-count"
        //       onMouseEnter={() => setShowLikesList(!showLikesList)}
        //       onMouseLeave={() => setShowLikesList(!showLikesList)}
        //     >
        //       {likes.length}
        //     </div>
        //   )}
        //   {showLikesList && (
        //     <ul className="like-list2">
        //       {likes.map((like, index) => (
        //         <li key={index}>{like.author.displayName}</li>
        //       ))}
        //     </ul>
        //   )}
        // </div>

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

export default LikeComment;
