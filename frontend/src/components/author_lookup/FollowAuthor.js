
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import axios from 'axios';
import signup from '../signup';
import { determine_headers, determine_inbox_endpoint, object_is_local } from '../helper_functions';
import { getAuthors } from '../../Logic';

function FollowAuthor(props) {

    const [show, setShow] = useState(false);
    const [authorOptions, setAuthorOptions] = useState([]);

    const loadAuthors = () => {
        getAuthors(props.author, props.authString).then(resp => {
            console.log("LOAD AUTHORS");
            console.log(resp);
            setAuthorOptions(resp);
        });
    }
    useEffect( () => loadAuthors(), []);

    var authorOptionsComponents = authorOptions.map(oneaut => {
        let url = new URL(oneaut.host);
        return (
            // <option value={oneaut.id} key={oneaut.id}>{url.host + " -- " + oneaut.displayName}</option>
            <option value={oneaut.id} key={oneaut.id}>{oneaut.displayName}</option>
    )})

    // var actorAuthor = {}; // this is the person we are trying to follow
    // const handleShow = () => setShow(true);

    const [contactInfo, setContactInfo] = useState({
        id: "",
        actorAuthor: {},
      });
      
    const handleClose = () => {setShow(false); setContactInfo({id: "",actorAuthor: {},})};
    
      const onChangeHandler = (event) => {
        let contactInfoHolder = { ...contactInfo, [event.target.name]: event.target.value };
        setContactInfo(contactInfoHolder);
      };

    

    const sendRequest = () => {
        var request_headers = {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + props.authString
        }
        if (!object_is_local(contactInfo.id)){
            request_headers = determine_headers(contactInfo.id)
        }
        console.log(request_headers);

        // GET the author we want to follow
        axios.get(contactInfo.id, {headers:determine_headers(contactInfo.id)})
            .then((response) => {
                var request_body = { // body
                    "type": "follow",
                    "summary": props.author.displayName + " wants to follow " + response.data.displayName,
                    "actor": props.author,
                    "object": response.data,
                };
                console.log(response.data);
                if (object_is_local(contactInfo.id)){
                    axios.post(
                        response.data.id + determine_inbox_endpoint(response.data.id),
                        request_body,
                        {headers:{
                            'Accept': '*/*',
                            'Content-Type': 'application/json',
                            'Authorization': 'Basic ' + props.authString
                        }}
                    )
                } else {
                    console.log("WE POST TO OUR SENDREQUEST ENDPOINT");
                    axios.post(
                        props.author.id + '/sendrequest/',
                        response.data,
                        {headers:{
                            'Accept': '*/*',
                            'Content-Type': 'application/json',
                            'Authorization': 'Basic ' + props.authString
                        }}
                    ).then( sendRequestResponse => {
                        sendRequestResponse.data.follow_request.type = "follow";
                        console.log("WE SEND THE REQUEST TO THEM");
                        console.log(sendRequestResponse.data);
                        axios.post(
                            // response.data.id + '/inbox/', // url for our database
                            response.data.id + determine_inbox_endpoint(response.data.id),
                            sendRequestResponse.data.follow_request,
                            {headers:determine_headers(contactInfo.id)}
                        ).then((resp) => setContactInfo({id: "",actorAuthor: {},}));
                    });
                }
                
                // axios.get("https://distributed-social-net.herokuapp.com/service/authors").then((list_of_authors) => {
                //     console.log(list_of_authors.data)
                //     let list_of_authors_filtered = list_of_authors.data.items.filter((oneAuthor) => oneAuthor.id===contactInfo.id);
                //     console.log(list_of_authors_filtered)
                //     if (list_of_authors_filtered){
                //         axios.post(
                //             response.data.id + determine_inbox_endpoint(response.data.id),
                //             request_body,
                //             {headers:request_headers}
                //         )
                //     } else {
                //         axios.post(
                //             props.author.id + '/sendrequest/',
                //             response.data,
                //             {headers:request_headers}
                //         ).then( sendRequestResponse => {
                //             sendRequestResponse.data.follow_request.type = "follow";
                //             console.log(sendRequestResponse.data);
                //             axios.post(
                //                 // response.data.id + '/inbox/', // url for our database
                //                 response.data.id + determine_inbox_endpoint(response.data.id),
                //                 sendRequestResponse.data.follow_request,
                //                 {headers:determine_headers(contactInfo.id)}
                //             )
                //         });
                //     }
                // })
                // if (object_is_local(contactInfo.id)){
                    
                // } else {
                //     axios.post(
                //         props.author.id + '/sendrequest/',
                //         response.data,
                //         {headers:request_headers}
                //     ).then( sendRequestResponse => {
                //         sendRequestResponse.data.follow_request.type = "follow";
                //         console.log(sendRequestResponse.data);
                //         axios.post(
                //             // response.data.id + '/inbox/', // url for our database
                //             response.data.id + determine_inbox_endpoint(response.data.id),
                //             sendRequestResponse.data.follow_request,
                //             {headers:determine_headers(contactInfo.id)}
                //         )
                //     });
                // }
            });
    };

    var userPreview = (Object.keys(contactInfo.actorAuthor).length === 0) ? "Username not found" : contactInfo.actorAuthor.displayName;
    
    return (
        <Form>
            <h5> Follow Authors </h5>

                {/* <InputGroup.Text id="inputGroup-sizing-default">
                    UserID
                </InputGroup.Text> */}
                {/* <Form.Label>Username</Form.Label> */}
                {/* <Form.Control type="text" placeholder="id" name="id" value={contactInfo.id} onChange={onChangeHandler}/> */}

                <Form.Group className="mb-3" controlId="visibility">
                    <Form.Label>Visibility</Form.Label>
                  <Form.Control as="select" value={contactInfo.visibility}
                    onChange={e => {setContactInfo({ ...contactInfo, id: e.target.value });}}>
                    {authorOptionsComponents}

                    
                  </Form.Control>
                </Form.Group>


                <Button variant="outline-primary" id="button-addon2" onClick={sendRequest}>
                    Follow
                </Button>
            <br />
            {/* <Form.Text className="text-muted">{"Other ID: " + contactInfo.id}</Form.Text><br />
            <Form.Text className="text-muted">{"Your ID: " + props.author.id}</Form.Text> */}
        </Form>
    );
}

export default FollowAuthor;
