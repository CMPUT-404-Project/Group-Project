import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/esm/Button';
import axios from 'axios';

import SendIcon from '@mui/icons-material/Send';
import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

import './likestyle.css';

import { determine_headers } from '../helper_functions';
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
                if (response.data.items){
                    setLikes(response.data.items);
                }
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
        const vis = message.visibility.toLowerCase();
        // '//service' doesn't work
        if (!hasLiked) {
            setLiked(true);
            setHasLiked(true);

            const url = `${props.message.author.id}/inbox/`;
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
              ).catch(error => {console.log(error);});
              
              axios.post(
                  `${props.message.author.id}/inbox`,
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
              ).catch(error => {console.log(error);});
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
              
              axios.post(
                  `${props.message.author.id}/inbox`,
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


    return (
      // <div className="like-post">
      //     {/* <Button variant="outline-success" onClick={processLikeClick}
      //       className={liked ? 'like-button liked' : 'like-button'}>
      //       {liked ? 'Liked' : 'Like'}
      //     </Button> */}
      //     <Button variant="outline-success" onClick={processLikeClick}
      //       className={liked ? <IconButton><FavoriteIcon/></IconButton> : <IconButton><FavoriteBorderIcon/></IconButton>}>
      //       {liked ? <IconButton><FavoriteIcon/></IconButton> : <IconButton><FavoriteBorderIcon/></IconButton>}
      //     </Button>
      //     {likes.length > 0 && (
      //       <div
      //         className="like-count"
      //         onClick={() => setShowLikesList(!showLikesList)}
      //       >
      //         {likes.length} {likes.length === 1 ? 'like' : 'likes'}
      //       </div>
      //     )}
      //     {showLikesList && (
      //       <ul className="like-list">
      //         {likes.map((like, index) => (
      //           <li key={index}>{like.author.displayName}</li>
      //         ))}
      //       </ul>
      //     )}
      //   </div>


      <div className="like-post">
          <Button variant="outline-success" onClick={processLikeClick}
            className={liked ? <IconButton><FavoriteIcon/></IconButton> : <IconButton><FavoriteBorderIcon/></IconButton>}>
            {liked ? <IconButton><FavoriteIcon/></IconButton> : <IconButton><FavoriteBorderIcon/></IconButton>}
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
