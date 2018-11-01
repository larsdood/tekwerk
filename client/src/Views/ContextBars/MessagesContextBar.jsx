import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import { Responsive, Grid, Segment, Card, Header, Statistic, Button, Icon, Menu, Input, Dimmer, Loader } from 'semantic-ui-react';
import * as A from '../../State/actions';
import * as S from '../../State/selectors';
import EmployerPostingCard from '../../Components/EmployerPostingCard';
import NewPostingModal from '../../Containers/NewPostingModal';
import EmployerPostingsView from '../Employer/EmployerPostingsView';
import EmployerPostingDetailsView from '../Employer/EmployerPostingDetailsView';

class EmployerMessagesContextBar extends React.Component {
  state = {
    selectedThreadId: undefined,
    messageText: '',
    activeMessageGroup: 'active',
  }

  componentWillMount() {
    this.props.queryMessageThreads();
  }

  selectMessageGroup = (_, { value }) => {
    this.setState({ activeMessageGroup: value });
  }

  selectThread = (threadId) => {
    this.props.queryMessagesInThread(threadId);
    this.setState({ selectedThreadId: threadId })
  }

  getReducedThreads = () => (
    this.props.threads ? this.props.threads.map(thread => ({
      id: thread.id,
      candidate: thread.users.find(user => user.id !== this.props.ownId)
    }))
      : []
  );

  renderMessageGroupTab = () => {
    const { activeMessageGroup, selectedThreadId } = this.state;
    const reducedThreads = this.getReducedThreads();

    return (
      <React.Fragment>
        <Menu fluid secondary borderless>
          <Menu.Item color='teal' active={activeMessageGroup === 'active'} value={'active'} onClick={this.selectMessageGroup}>
            Active
      </Menu.Item>
          <Menu.Item color='teal' active={activeMessageGroup === 'archived'} value={'archived'} onClick={this.selectMessageGroup}>
            Archived
      </Menu.Item>
        </Menu>
        <Menu secondary vertical>
          {reducedThreads.map(thread => <Menu.Item color='blue' active={selectedThreadId === thread.id} onClick={() => { this.selectThread(thread.id) }}>{thread.candidate.firstName} {thread.candidate.lastName}</Menu.Item>)}
        </Menu>
      </React.Fragment>
    );}

  render() {
    const { subView } = this.state;
    return (
      <React.Fragment>
        <Grid.Row></Grid.Row>
        <Header as='h5'>Search by name</Header>
        <Input
          icon={{ name: 'search', link: true }}
          placeholder='Search...' />
        {this.renderMessageGroupTab()}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  threads: S.messageThreadsSelector(state),
  selectedThread: S.selectedThreadSelector(state),
  ownId: S.ownUserIdSelector(state),
});

const mapDispatchToProps = dispatch => ({
  queryMessageThreads: () => dispatch(A.queryMessageThreads.request()),
  queryMessagesInThread: threadId => dispatch(A.queryMessagesInThread.request(threadId)),
  sendMessage: (toId, message) => dispatch(A.postMessage.request(toId, message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EmployerMessagesContextBar);