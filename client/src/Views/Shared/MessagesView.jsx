import React from 'react';
import { connect } from 'react-redux';
import * as A from '../../State/actions';
import * as S from '../../State/selectors';
import { Tab, Grid, Segment, Container, Menu, Input, Header, Form, TextArea, Button, Divider } from 'semantic-ui-react';

class MessagesView extends React.Component {
  state = {
    messageText: '',
    activeMessageGroup: 'active',
  }

  isOwnId = id => this.props.ownId === id;

  formatDate = dateString => (
    new Date(dateString).toLocaleString()
  )

  renderMessages() {
    const { selectedThread } = this.props;
    if (!selectedThread || !selectedThread.messages) return null;
    return (
      <Grid.Row>
        {selectedThread.messages.map(message =>
          <Segment basic clearing>
            <Segment
              floated={this.isOwnId(message.from.id) ? 'right' : 'left'}
              inverted
              color={this.isOwnId(message.from.id) ? 'teal' : 'blue'}
              secondary>
              <Header inverted as='h4'>
                {message.from.firstName} {message.from.lastName}
                <Header.Subheader inverted color='grey'>
                  {this.formatDate(message.sentAt)}
                </Header.Subheader>
              </Header>
            {message.message}
          </Segment>
          </Segment>)
        }
      </Grid.Row>);
  }

  renderTextAreaButton = () => {
    const { selectedThread } = this.props;
    if (!selectedThread || !selectedThread.messages) return null;
    return (
    <Grid.Row>
      <Form>
        <Form.Group>
          <TextArea onChange={this.messageChanged} placeHolder='...'>
          </TextArea>
          <Button color='teal' compact onClick={this.sendMessage}>Send</Button>
        </Form.Group>
      </Form>
    </Grid.Row>
    )
  }

  messageChanged = (_, { value }) => {
    this.setState({
      messageText: value
    });
  }

  sendMessage = () => {
    const { selectedThread} = this.props;
    const toId = selectedThread.users.find(user => user.id !== this.props.ownId).id;
    this.props.sendMessage(toId, this.state.messageText)
  }

  renderHeader = () => {
    const { selectedThread } = this.props;
    const selectedUser = selectedThread && selectedThread.users
      ? selectedThread.users.find(user => !this.isOwnId(user.id))
      : undefined;
    const headerText = selectedUser
      ? `${selectedUser.firstName} ${selectedUser.lastName}`
      : 'Messages';
    return (
      <Grid.Row centered>
        <Segment vertical textAlign='center' clearing>
          <Header as='h4'>{headerText}</Header>
        </Segment>
      </Grid.Row>
    )
  }

  render() {
    return (
      <React.Fragment>
        {this.renderHeader()}
        {this.renderMessages()}
        {this.renderTextAreaButton()}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  selectedThread: S.selectedThreadSelector(state),
  ownId: S.ownUserIdSelector(state),
});

const mapDispatchToProps = dispatch => ({
  queryMessagesInThread: threadId => dispatch(A.queryMessagesInThread.request(threadId)),
  sendMessage: (toId, message) => dispatch(A.postMessage.request(toId, message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MessagesView);