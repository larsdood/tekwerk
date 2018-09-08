import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Segment, Menu, Image, Button, Grid, Header, Responsive, Dropdown, Icon, Container, Divider } from 'semantic-ui-react';
import LogoText from '../Media/LogoText4x.png';
import './LandingPage.css';
import LoginModal from '../Containers/LoginModal';
import RegisterModal from '../Containers/RegisterModal';
import * as A from '../State/actions';

class LandingPage extends Component {
  state = {
    activeItem: 'home',
    topBarOpacity: 0,
    showEmployerRegisterModal: false,
    showCandidateRegisterModal: false,
  }

  componentWillMount() {
    this.props.queryEmployers();
  }

  openEmployerRegisterModal = () => {
    this.setState({ showEmployerRegisterModal: true });
  }

  closeEmployerRegisterModal = () => {
    this.setState({ showEmployerRegisterModal: false });
  }

  handleItemClick = (e, something) => {
    this.refs[something.name].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  render() {
    return (
      <React.Fragment>
        <div className="landing-image" >
          <Image style={{ padding: '20px', position: 'absolute' }} src={LogoText} size='small' />
          <Responsive maxWidth={768}>
            <Menu inverted secondary fixed='top' >
              <Menu.Item position='right'>
                <Dropdown item icon={<Icon color='blue' name='sidebar' style={{ fontSize: '3em' }} />} simple>
                  <Dropdown.Menu >
                    <Dropdown.Item>
                      <Button inverted color='blue'> Log in </Button>
                    </Dropdown.Item>
                    <Dropdown.Item text='Mission' name='mission'
                      onClick={this.handleItemClick} />
                    <Dropdown.Item
                      text='How'
                      name='how'
                      onClick={this.handleItemClick}
                    />
                    <Dropdown.Item
                      text='About'
                      name='about'
                      onClick={this.handleItemClick}
                    />
                  </Dropdown.Menu>
                </Dropdown>
              </Menu.Item>
            </Menu>
          </Responsive>
          <Responsive minWidth={769}>
            <Menu inverted secondary size='massive' style={{ backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 45%)' }}>
              <Menu.Menu position='right'>
                <Menu.Item name='mission'
                  onClick={this.handleItemClick} />
                <Menu.Item
                  name='how'
                  onClick={this.handleItemClick}
                />
                <Menu.Item
                  name='about'
                  onClick={this.handleItemClick}
                />
                <Menu.Item>
                  <LoginModal trigger={<Button inverted color='blue'>Log in</Button>} />
                </Menu.Item>
              </Menu.Menu>
            </Menu>
          </Responsive>
          <Grid style={{ maxHeight: '735px' }} stackable columns="2" padded>
            <Grid.Column>
            </Grid.Column>
            <Grid.Column className='textWrapper' mobile='12' computer='7' tablet='4'>
              <Responsive maxWidth={768} style={{ height: '250px' }} />
              <Header className='gigaTextContainer' style={{ margin: '0 10% 5% 0' }} size='huge' inverted >
                <span className='gigaText'>Work&nbsp;to&nbsp;Work<br />
                  Live&nbsp;to&nbsp;Live</span>
              </Header >
              <Header style={{ margin: '0 10% 5% 0', lineHeight: '35px' }} inverted size='large'>
                We&nbsp;believe&nbsp;that&nbsp;work&nbsp;is<br />
                defined&nbsp;by&nbsp;professional&nbsp;activities<br />
                in&nbsp;a&nbsp;designated&nbsp;workspace.
                </Header>
              <Header style={{ margin: '0 10% 5% 0', lineHeight: '35px' }} inverted size='large'>
                Sign&nbsp;up&nbsp;today&nbsp;and&nbsp;join<br />
                the&nbsp;bleeding&nbsp;edge&nbsp;of<br />
                recruitment&nbsp;in&nbsp;the&nbsp;modern&nbsp;age.
                </Header>

              <Container style={{ padding: '0 10% 0 0' }}>
                <Button.Group size='big' inverted>
                  <RegisterModal open={this.state.showEmployerRegisterModal} close={this.closeEmployerRegisterModal} clientType='employer' trigger={<Button onClick={this.openEmployerRegisterModal} inverted color='blue'>Employer</Button>} />
                  <Button.Or text='' />
                  <RegisterModal clientType='candidate' trigger={<Button inverted color='teal'>Candidate</Button>} />
                </Button.Group>
              </Container>
            </Grid.Column>
          </Grid>
          <div style={{ height: '50px' }} />
        </div>
        <Container text style={{ marginTop: '70px' }}>
          <div ref='mission' />
          <Header textAlign='center' size='huge'>
            RECRUITMENT IN AND WITH THE SPIRIT
          </Header>
          <Divider />
          <br />

          <Header textAlign='center' as='h3'>
            Tekwerk.io is probably the only recruitment site in the world that
            cares about its clients on both a personal and spiritual level.
          <br />
            <br />
            Tekwerk.io offers services such as baptism for newly converted
            candidates, shinto good-luck ceremonies for employers,
            and mandatory prayer sessions for all employees.
          </Header>
          <br />
          <br />
          <Divider />
          <br />

          <br />
          <Grid centered columns='5' mobile='3'>
            <Grid.Row>
              <div ref='how' />

              <Header textAlign='center' size='huge' >
                Candidates
            </Header>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Header as='h3' icon>
                  <Icon size='small' name='user plus' color='blue' />
                  Sign up
                  <Header.Subheader>Create a candidate account</Header.Subheader>
                </Header>
              </Grid.Column>

              <Grid.Column>
                <Header as='h3' icon>
                  <Icon size='small' name='find' color='purple' />
                  Find job
                  <Header.Subheader>Choose from hundreds of employers</Header.Subheader>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h3' icon>
                  <Icon size='small' name='handshake' color='teal' />
                  Get hired
                  <Header.Subheader>Find the job you've always dreamed of</Header.Subheader>
                </Header>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Header textAlign='center' size='huge' >
                Employers
            </Header>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Header as='h3' icon>
                  <Icon size='small' name='user plus' color='blue' />
                  Sign up
                  <Header.Subheader>Create an employer account</Header.Subheader>
                </Header>
              </Grid.Column>

              <Grid.Column>
                <Header as='h3' icon>
                  <Icon size='small' name='compose' color='orange' />
                  Create posting
                  <Header.Subheader>Make your posting visible to thousands of applicants</Header.Subheader>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h3' icon>
                  <Icon size='small' name='lightbulb' color='olive' />
                  Employ
                  <Header.Subheader>Employ your next corporate superstar</Header.Subheader>
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <br/>
          <Divider />
          <Segment textAlign='center'>
            <div ref='about' />            
            <Header as='h1'>About</Header>
            <div>This is a prototype created by Lars Holdaas for experimentation and self-study.<br />
              The stack consists of the following technologies:</div>
              <Header>Front-end</Header>
              <div>React (Create-React-App), Redux, Redux-Observables, RxJs, Semantic UI, Apollo</div>
              <Header>Back-end</Header>
            <div>Node.js, Graphql-Yoga, Prisma, PostgreSQL, JWT, bcrypt</div></Segment>
            <br/>
          
        </Container>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  employers: ['James Bond']
})

const mapDispatchToProps = dispatch => ({
  queryEmployers: () => dispatch(A.queryEmployers.request())
})

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);