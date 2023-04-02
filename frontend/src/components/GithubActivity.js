
import './gitstyle.css';
import React, { useEffect, useState } from 'react';
import { author_id_to_number } from './helper_functions';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import GithubActivityCard from './post_components/GithubActivityCard';

function GithubActivity({userID}) {
  const [activity, setActivity] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  useEffect(() => handleClick(),[]);

  const handleClick = () => {
    fetch('https://distributed-social-net.herokuapp.com/service/authors/github/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userID:author_id_to_number(userID) })
    })
      .then(response => response.json())
      .then(data => {
        setActivity(data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <>
      <Button onClick={() => setShow(true)}>GitHub</Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
            <Modal.Title>Recent Github Activities</Modal.Title>
        </Modal.Header>
          <Modal.Body>
            {/* <ListGroup>{inbox_list_components}</ListGroup> */}
            {activity.slice(0, 10).map(act => 
              <GithubActivityCard githubContent={act}/>
              )}
          </Modal.Body>
      </Modal>
    </>
  );
}

export default GithubActivity;