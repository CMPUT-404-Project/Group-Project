
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import axios from 'axios';
import signup from '../signup';

function FollowAuthor(props) {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    // var actorAuthor = {}; // this is the person we are trying to follow
    // const handleShow = () => setShow(true);

    const [contactInfo, setContactInfo] = useState({
        // hostaddress: "127.0.0.1:8000",
        id: "",
        actorAuthor: {},
      });
    
      const onChangeHandler = (event) => {
        let contactInfoHolder = { ...contactInfo, [event.target.name]: event.target.value };
        // axios.get(
        //     'http://' +contactInfoHolder.hostaddress+ '/service/authors/' + contactInfoHolder.id, // url
        //     { // configs
        //         headers: {
        //             'Accept': '*/*',
        //             'Content-Type': 'application/json',
        //             'Authorization': 'Basic ' + props.authString
        //         },
        //     }
        // ).then((response) => {
        //     contactInfoHolder = { ...contactInfoHolder, actorAuthor: response.data};
        //     console.log(contactInfoHolder);
        //     setContactInfo(contactInfoHolder);
        // }).catch(error => {
        //     contactInfoHolder = { ...contactInfoHolder, actorAuthor: {}};
        //     setContactInfo(contactInfoHolder);
        // });
        // console.log(contactInfo);
        setContactInfo(contactInfoHolder);
      };

    const sendRequest = () => {

        // GET the author we want to follow
        axios.get(contactInfo.id)
            .then((response) => {
                console.log(response.data);
                axios.post(
                    response.data.id + '/inbox/', // url
                    { // body
                        "type": "Follow",
                        "summary": props.author.displayName + " wants to follow " + response.data.displayName,
                        "actor": props.author,
                        "object": response.data,
                    }, 
                    {
                        'Accept': '*/*',
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + props.authString
                    }
                )
            });




        // lookup if the user exists
        // console.log(props.author);
        // console.log(contactInfo.actorAuthor);
        // var prepend = "";
        // if (contactInfo.hostaddress.localeCompare('127.0.0.1')){
        //     // our port 
        //     prepend = "/service";
        // }
        // console.log(contactInfo.hostaddress === '127.0.0.1');
        // // console.log(contactInfo.hostaddress);
        // if (contactInfo.hostaddress  !== '127.0.0.1'){
        //     // the hostaddress is not the local database
        //     console.log('http://' + contactInfo.hostaddress + '/authors/');
        //     axios.get(
        //         'http://' + contactInfo.hostaddress + '/authors/', // url
        //         { // config
        //             'Access-Control-Allow-Origin': '*',
        //         }).then((response) => {
        //             console.log(response.data);
        //             console.log("HELLO");
        //             // response.data is going to be an array of authors
        //             var matching_author = response.data.items.filter((oneAuthor) => {return oneAuthor.display_name === contactInfo.id;})
        //             if (matching_author === undefined || matching_author.length == 0) {
        //                 // array does not exist or is empty
        //                 alert("There were no matches. Please try again.");
        //             } else {
        //                 console.log(matching_author);
        //                 matching_author = matching_author[0]; // grab the first one
        //                 matching_author = {...matching_author, displayName:matching_author.display_name, github:"https://github.com/"};
        //                 delete matching_author.id;
        //                 // save it to our database
        //                 console.log(matching_author);
        //                 signup(matching_author.display_name, "password", "https://github.com/");
        //                 axios.post(
        //                     'http://' + '127.0.0.1:8000' + '/service/authors', // url
        //                     matching_author // body
        //                 );
        //             }
        //         })

        // }
        // axios.post(
        //     'http://' + contactInfo.hostaddress + '/service/authors/' + props.author.id + '/sendrequest/', // url
        //     { // body of the request
        //         // "type": "Follow",
        //         // "actor": props.author,
        //         // "object": contactInfo.actorAuthor,
        //         displayName: contactInfo.id,
        //     },
        //     { // configs
        //         headers: {
        //             'Accept': '*/*',
        //             'Content-Type': 'application/json',
        //             'Authorization': 'Basic ' + props.authString
        //         },
        //     }
        // ).then((response) => {
        //     // send the response data to the url of the second user
        //     console.log(response);
        //     alert("SENT!!!");
        // });

        // if yes, send follow request
        // if (true) {
        //     // make the POST request here
        //     setContactInfo({
        //         hostaddress: "127.0.0.1:8000",
        //         id: "",
        //         actorAuthor: {},
        //     });
        //     return;
        // }
        // if no, send an alert
        // alert("No user found! Please check the host/username.")
    };

    var userPreview = (Object.keys(contactInfo.actorAuthor).length === 0) ? "Username not found" : contactInfo.actorAuthor.displayName;
    
    return (
        <Form>
            {/* <Form.Group className="mb-3" controlId="hostaddress">
            <Form.Control type="text" placeholder="127.0.0.1" name="hostaddress" value={contactInfo.hostaddress} onChange={onChangeHandler}/>
            </Form.Group> */}
            <h5> Follow Authors </h5>
{/* 
            <InputGroup className="mb-3">
                <InputGroup.Text id="inputGroup-sizing-default">
                    Host
                </InputGroup.Text>
                <Form.Control type="text" placeholder="127.0.0.1" name="hostaddress" value={contactInfo.hostaddress} onChange={onChangeHandler}/>
            </InputGroup> */}

            {/* <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Username" name="username" value={contactInfo.username} onChange={onChangeHandler}/>
            </Form.Group> */}

            <InputGroup className="mb-3">
                <InputGroup.Text id="inputGroup-sizing-default">
                    UserID
                </InputGroup.Text>
                {/* <Form.Label>Username</Form.Label> */}
                <Form.Control type="text" placeholder="id" name="id" value={contactInfo.id} onChange={onChangeHandler}/>
                <Button variant="outline-secondary" id="button-addon2" onClick={sendRequest}>
                    Follow
                </Button> <br />
            </InputGroup>
            
            <Form.Text className="text-muted">{"Display Name: " + userPreview}</Form.Text>
        </Form>
    );
}

export default FollowAuthor;
