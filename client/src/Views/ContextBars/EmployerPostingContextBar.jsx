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

class EmployerPostingContextBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subView: 'dashboard'
    }
    this.props.queryPostings(20);

    this.props.queryMessageThreads();
  }
  render() {
    const { subView } = this.state;
    const { pathname } = this.props;
    return (
      <React.Fragment>
        <Grid.Row><br/></Grid.Row>
        <Grid.Row>
          <Header as='h5'>Search for posting</Header>
          <Input
            icon={{ name: 'search', link: true }}
            placeholder='Search...' />
        </Grid.Row>
        <br />
        <Grid.Row>
          <Statistic.Group color='blue' size='small' widths='8'>
            <Statistic color='blue' >
              <Statistic.Value>{this.props.postingsCount || 0}</Statistic.Value>
              <Statistic.Label style={{ paddingLeft: '20px', color: '#2185d0' }}>Postings</Statistic.Label>
            </Statistic>
            <Statistic color='blue' >
              <Statistic.Value>{this.props.numberOfApplicants || 0}</Statistic.Value>
              <Statistic.Label style={{ paddingLeft: '20px', color: '#2185d0' }}>Applicants</Statistic.Label>
            </Statistic>
          </Statistic.Group>
        </Grid.Row>
        <br />
        <Grid.Row>
          <Menu color='blue' vertical secondary>
            <Menu.Item to='/employer/postings/' as={Link} active={pathname==='/employer/postings/'}>
              <strong>Dashboard</strong>
            </Menu.Item>
            <Menu.Item to='/employer/postings/archived/' as={Link} active={pathname === '/employer/postings/archived/'}>
              <strong>Archived Postings</strong>
            </Menu.Item>
            <Menu.Item>
              <NewPostingModal trigger={
                <Button size='big' icon color='blue'>
                  <Icon name='calendar plus' />
                  {' '}New Posting
                    </Button>} />
            </Menu.Item>
          </Menu>
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

export default connect(mapStateToProps, mapDispatchToProps)(EmployerPostingContextBar);