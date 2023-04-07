
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function GithubActivityCard(props) {

    let githubContent = props.githubContent;

    var extra = "";
    if (githubContent.type === "PushEvent"){
        extra = <>Branch: {props.githubContent.payload.ref}<br /></>;
    }
    
    return (
        <Card >
          <Card.Body>
            <Card.Title>{githubContent.type}</Card.Title>
            <Card.Text>
                {extra}
                <>Repository: {githubContent.repo.name}<br /></>
                <>Time:  {githubContent.published}</>
            </Card.Text>
          </Card.Body>

          
        </Card>
    );
}

export default GithubActivityCard;
