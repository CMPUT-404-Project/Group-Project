
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';


function CommentCard(props) {
    
    return (
        <Card>
            <Card.Subtitle className="mb-2 text-muted">{props.commentData.author.displayName}</Card.Subtitle>
            <Card.Text>{props.commentData.comment}</Card.Text>
            
        </Card>
    );
}

export default CommentCard;
