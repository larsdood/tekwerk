import React from 'react';
import { connect } from 'react-redux';
import { Transition, Grid, Segment, Card, Header, Statistic, Button, Icon, Menu, Input, Dimmer, Loader } from 'semantic-ui-react';
import * as A from '../../State/actions';
import * as S from '../../State/selectors';
import EmployerPostingCard from '../../Components/EmployerPostingCard';
import NewPostingModal from '../../Containers/NewPostingModal';


class EmployerPostingsView extends React.Component {
  
  constructor(props) {
    super(props);
  
    this.state = {
      subView: 'dashboard'
    }
    this.props.queryPostings(20);

    this.props.queryMessageThreads();
  }

  renderActivePostings = () => {
    if (!this.props.activePostings || !this.props.activePostings.length) {
      return <Header as='h4'>No active postings</Header>
    }
    return (
      <Card.Group>
        {this.props.activePostings.map(posting =>
          <EmployerPostingCard posting={posting} />)}
      </Card.Group>
    )
  }

  renderUpcomingPostings = () => {
    if (!this.props.upcomingPostings || !this.props.upcomingPostings.length) {
      return <Header as='h4'>No unreleased postings</Header>
    }
    return (
      <Transition.Group as={Card.Group} duration={2000} animation='fade' divided >
        {this.props.upcomingPostings.map(posting =>
        <EmployerPostingCard onReleaseClick={this.props.releasePosting} posting={posting} />)}
      </Transition.Group>
    )
  }

  render() {
    const { pathname } = this.props;
    const { subView } = this.state;
    if (!this.props.employer) {
      return (
        <Dimmer active>
          <Loader size='huge' />
        </Dimmer>
      )
    }
    return (<React.Fragment>
          <Grid.Row>
            <br />
          </Grid.Row>
          <Grid.Row>
            <Header as='h1' color='blue'>Active Postings</Header>
            <br/>
          </Grid.Row>
          <Grid.Row>
            {this.renderActivePostings()}
          </Grid.Row>
          <br/>
          <Grid.Row>
            <Header as='h1' color='blue'>Unreleased Postings</Header>
            <br/>
          </Grid.Row>
          <Grid.Row>
            {this.renderUpcomingPostings()}
          </Grid.Row>
    </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  employer: S.employerSelector(state),
  postings: S.employerPostingsSelector(state),
  activePostings: S.employerActivePostingsSelector(state),
  postingsCount: S.employerPostingsCountSelector(state),
  upcomingPostings: S.employerUpcomingPostingsSelector(state),
  numberOfApplicants: S.numberOfApplicationsSelector(state),
  pathname: S.pathnameSelector(state),
})

const mapDispatchToProps = dispatch => ({
  queryPostings: (count) => dispatch(A.queryInternalPostings.request(count)),
  queryMessageThreads: () => dispatch(A.queryMessageThreads.request()),
  releasePosting: (customId) => dispatch(A.releasePosting.request(customId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EmployerPostingsView);