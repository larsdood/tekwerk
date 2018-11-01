import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'semantic-ui-react';

class EmployerPostingCard extends Component {
  releaseButtonClicked = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.onReleaseClick(this.props.posting.customId);
  }

  render() {
    const { postingTitle, positionTitle, employmentType, createdDate, expiresAt, customId, id, status } = this.props.posting;

    return (
      <Card as={Link} to={`/employer/postings/${status.toLowerCase()}/${id}`}>
        <Card.Content>
          <Card.Header textAlign='center'>
            {postingTitle}
          </Card.Header>
          <Card.Meta>
            {customId}
          </Card.Meta>

          <Card.Description>
            {positionTitle}, {employmentType}
          </Card.Description>
          <Card.Description>
            Expires: {new Date(expiresAt).toDateString()}
          </Card.Description>

        </Card.Content>
        <Card.Content>
          {status === 'ACTIVE' && `${this.props.posting.applications.length} applicants`} 
          {status === 'UPCOMING' && <Button onClick={this.releaseButtonClicked} color='blue' floated='right'>Publish posting</Button>}
        </Card.Content>
      </Card>
      )
  }
}

export default EmployerPostingCard;
