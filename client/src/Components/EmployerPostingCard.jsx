import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';

class EmployerPostingCard extends Component {
  releaseButtonClicked = (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('release the kraken!');
    this.props.onReleaseClick(this.props.posting.customId);
  }

  render() {
    const { postingTitle, positionTitle, employmentType, createdDate, expiresAt, customId } = this.props.posting;

    return (
      <Card href = {`/postings/${customId}`}>
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
            Posted: {new Date(createdDate).toDateString()}
            <br/>
            Expires: {new Date(expiresAt).toDateString()}
          </Card.Description>

        </Card.Content>
        <Card.Content>
          0 applicants
          {this.props.posting.status === 'UPCOMING' && <Button onClick={this.releaseButtonClicked} color='blue' floated='right'>Release posting</Button>}
        </Card.Content>
      </Card>
      )
  }
}

export default EmployerPostingCard;
