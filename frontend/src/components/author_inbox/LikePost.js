
// import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
// import React, { useState, useEffect } from 'react';
// import Button from 'react-bootstrap/esm/Button';
// import axios from 'axios'; 


// function LikePost(props) {

//     const [liked, setLiked] = useState(false);

    

//     const message  = props.message;
//     var extras = "";
//     var card_style;

//     useEffect(() => {
//         axios.get(
//             '' // url
//         )
//     }, []); // run this the first time it renders

//     const processLikeClick = () => {
//         console.log(message);
//         axios.post(
//             message.author.url + '/inbox/', // url
//             { // body
//                 type: "Like",
//                 author: message.author,
//                 object: message.url,
//            },
//             { // config

//             }
//         )
//     };
    
//     return (
//         <Button variant='outline-success' onClick={processLikeClick}>
//             {"<3"}
//         </Button>
//     );
// }

// export default LikePost;


import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/esm/Button';
import axios from 'axios';

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

function LikePost(props) {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState([]);

    const message = props.message;
    let authorId, postId;
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
    

    useEffect(() => {
        axios.get(`${message.origin}service/authors/${authorId}/posts/${postId}/likes`)
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
        }
    }, [likes, props.author.id]);
    

    const processLikeClick = () => {
        setLiked(true);
        //console.log(props.author.id) //this is me
        //console.log(message.author.id) //this is the author of the post i am seeing in my inbox
        
        // assuming the origin ends with a '/'. '//service' doesn't work
        axios.post(
            `${message.origin}service/authors/${authorId}/inbox/`,
            {
                type: 'like',
                author: props.author,
                object: message.url,
                summary: '${props.author.displayName} likes your post'
            },
        )
            .then(response => {
                console.log('sent to inbox');
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <div>
            <Button variant="outline-success" onClick={processLikeClick}>
                {liked ? 'Liked' : 'Like'}
            </Button>
            <div>
                {likes.map((like, index) => (
                    <p key={index}>{like.author.displayName} liked this post</p>
                ))}
            </div>
        </div>
    );
}

export default LikePost;
