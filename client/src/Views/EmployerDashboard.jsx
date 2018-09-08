import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Statistic, Menu, Image, Button, Grid, Header, Responsive, Dropdown, Icon, Container, Divider, Dimmer, Loader } from 'semantic-ui-react';
import * as selectors from '../State/selectors';
import * as A from '../State/actions';

import LogoHorizontal from '../Media/LogoHorizontal4x.png';
import NewPostingModal from '../Containers/NewPostingModal';
import EmployerPostingCard from '../Components/EmployerPostingCard';

class EmployerDashboard extends Component {
  componentWillMount() {
    this.props.queryPostings(5);
  }

  render() {
    if (!this.props.employer) {
      return(
          <Dimmer active>
            <Loader size='huge' />
          </Dimmer>
      )
    }
    return (
      <React.Fragment>
        <Image style={{ width: '200px', height: 'auto', padding: '5px 0px 5px 20px', position: 'absolute' }} src={LogoHorizontal}/>
        <Menu secondary>
          <Menu.Item position='right'name="hello"/>
        </Menu>
        <div style={{ padding: '20px 20px 0px 0px', position: 'absolute', width: '260px', height: '100%', backgroundColor: '#2A9CD8' }}>
          <Header textAlign='center' as='h3' inverted>{this.props.employer.name}</Header>
            <Statistic.Group inverted size='small' widths='2'>
              <Statistic>
                <Statistic.Value>{this.props.postingsCount}</Statistic.Value>
                <Statistic.Label>Postings</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>72</Statistic.Value>
                <Statistic.Label>Applicants</Statistic.Label>
              </Statistic>
            </Statistic.Group>

          <Menu style={{ paddingLeft: '20px'}}secondary vertical>
            <Menu.Item value="dashboard">
              <Header inverted as='h3'>
                <Icon name='th large' />
                <Header.Content>Dashboard</Header.Content>
              </Header>
            </Menu.Item>
            <Menu.Item value="postings">
              <Header inverted as='h3'>
                <Icon name='folder' />
                <Header.Content>Postings</Header.Content>
              </Header>
            </Menu.Item>
            <Menu.Item value="applicants">
              <Header inverted as='h3'>
                <Icon name='user' />
                <Header.Content>Applicants</Header.Content>
              </Header>
            </Menu.Item>
            <Menu.Item value="messages">
              <Header inverted as='h3'>
                <Icon name='mail' />
                <Header.Content>Messages</Header.Content>
              </Header>
            </Menu.Item>
          </Menu>
        </div>
        <div style={{ padding: '40px', left: '240px', position: 'absolute', width: '100% - 260px', height: '100%', backgroundColor: '#EFEFEF'}}>
          <Grid>
            <Grid.Row>
              <NewPostingModal trigger = {
              <Button icon size='huge' color='blue'>
                <Icon name='calendar plus' />
                {' '}New Posting
              </Button>} />
            </Grid.Row>
            <Grid.Row>
              <Header as='h1' color='blue'>Active Postings</Header>
            </Grid.Row>
            
            <Grid.Row>
              <Card.Group>
                {this.props.activePostings.map(posting => <EmployerPostingCard posting={posting} />)}
              </Card.Group>
            </Grid.Row>
            <Grid.Row>
              <Header as='h1' color='blue'>Unreleased Postings</Header>
              </Grid.Row>
              <Grid.Row>
              <Card.Group>
                {this.props.upcomingPostings.map(posting => <EmployerPostingCard onReleaseClick={this.props.releasePosting} posting={posting} />)}
              </Card.Group>
            </Grid.Row>
          </Grid>
        </div>
        Hello
      
      
      
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  employer: selectors.employerSelector(state),
  postings: selectors.employerPostingsSelector(state),
  activePostings: selectors.employerActivePostingsSelector(state),
  postingsCount: selectors.employerPostingsCountSelector(state),
  upcomingPostings: selectors.employerUpcomingPostingsSelector(state),
})

const mapDispatchToProps = dispatch => ({
  queryPostings: (count) => dispatch(A.queryPostings.request(count)),
  releasePosting: (customId) => dispatch(A.releasePosting.request(customId))
})

export default connect(mapStateToProps, mapDispatchToProps)(EmployerDashboard);