import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/esm/Button';
import axios from 'axios';
import './likestyle.css';
import { determine_headers } from '../helper_functions';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

function LikeComment(props) {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState([]);
    const [hasLiked, setHasLiked] = useState(false);
    const [showLikesList, setShowLikesList] = useState(false);

    const comm = props.comment;
    
    // const origin = message.origin.endsWith('/') ? message.origin : `${message.origin}/`;
    
    useEffect(() => {
        axios.get(`${comm.id}/likes`)
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
    }, [likes, comm.author.id]);
    

    const processLikeClick = () => {
        //console.log(props.author.id) //this is me
        //console.log(message.author.id) //this is the author of the post i am seeing in my inbox
        const vis = props.vis.toLowerCase();
      
        // '//service' doesn't work
        if (!hasLiked) {
            setLiked(true);
            setHasLiked(true);
            const url = `${comm.author.id}/inbox/`;
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
            ).catch(error => {console.log(error);});
            
            axios.post(
                `${comm.author.id}/inbox`,
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
            ).catch(error => {console.log(error);});
          }

          else if (vis === 'friends' || vis === 'private') {
            const sub = comm.id.substring(comm.id.indexOf('/authors'));
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
                  `${comm.author.id}/inbox`,
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

export default LikeComment;
