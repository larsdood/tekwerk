import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';

class PublicPostingCard extends Component {
  render() {
    const { id, postingTitle, positionTitle, employmentType, expiresAt, customId } = this.props.posting;

    return (
      <Card fluid href = {`/candidate/postings/${id}`}>
        <Card.Content>
          <Card.Header textAlign='left'>
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
      </Card>
      )
  }
}

export default PublicPostingCard;
