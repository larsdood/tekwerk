import React from 'react';
import { Card, Button, Label } from 'semantic-ui-react';

const applicationStatusDict = {
  WAITING_FOR_REVIEW: 'Awaiting Review',
}

const ApplicationCard = ({ firstName, lastName, email, applicationLetter, status, sendMessage, applicantId }) => (
  <Card>
    <Card.Content>
      <Label attached='top right' content={applicationStatusDict[status]} ribbon={false} color='blue' />
      <Card.Header>{firstName} {lastName}</Card.Header>
      <Card.Meta>{email}</Card.Meta>
      <Card.Description>
        <strong>Programmer, Norway</strong>
      </Card.Description>
    </Card.Content>
    <Card.Content extra>
      <div className='ui two buttons'>
        <Button onClick={() => sendMessage(applicantId, "wazzap fool")} color='blue'>
          Message
        </Button>
        <Button color='teal'>
          View Application
        </Button>
      </div>
    </Card.Content>
  </Card>
);

export default ApplicationCard;