import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Image, Menu, Button, Header } from 'semantic-ui-react';
import * as A from '../State/actions';
import * as S from '../State/selectors';
import LogoHorizontal from '../Media/LogoHorizontal4x.png';

class TopBar extends Component {

  renderMenuMenu(pathname) {
    switch(pathname.split('/')[1]) {
      case 'employer':
        return this.renderEmployerMenuMenu();
      case 'candidate':
        return this.renderCandidateMenuMenu();
      default:
        return <div>well this is awkward</div>
    }
  }
  renderCandidateMenuMenu() {
    return (
      <Menu.Menu position='left'>
        <Menu.Item active={this.props.pathname === '/candidate/dashboard/'}>
          <Header size='small' to='/candidate/dashboard/' color='grey' as={Link}>Jobs</Header>          
        </Menu.Item>
        <Menu.Item>
          <Header color='grey' as='h4'>Applications</Header>
        </Menu.Item>
        <Menu.Item active={this.props.pathname === '/candidate/messages/'}>
          <Header size='small' to='/candidate/messages/' color='grey' as={Link}>Messages</Header>
        </Menu.Item>
      </Menu.Menu>
    );
  }

  renderEmployerMenuMenu() {
    const path = this.props.pathname;
    return (
      <Menu.Menu position='left'>
        <Menu.Item active={path.includes('postings')}>
          <Header size='small' to='/employer/postings/' color='grey' as={Link}>Postings</Header>
        </Menu.Item>
        <Menu.Item>
          <Header color='grey' as='h4'>Applicants</Header>
        </Menu.Item>
        <Menu.Item active={path === '/employer/messages/'}>
          <Header size='small' to='/employer/messages/' color='grey' as={Link}>Messages</Header>
        </Menu.Item>
      </Menu.Menu>
    );
  }

  render() {
    return (
      <React.Fragment>
        <Menu pointing secondary>
          <Image style={{ width: '200px', height: '50px', padding: '5px 20px 5px 20px' }} src={LogoHorizontal} />
          {this.renderMenuMenu(this.props.pathname)}
          <Menu.Item position='right'>
            <Button onClick={() => { this.props.logout() }} color='blue'>Logout</Button>  
          </Menu.Item> 
        </Menu>
        {this.props.children}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  pathname: S.pathnameSelector(state),
})

const mapDispatchToProps =  dispatch => ({
  logout: () => dispatch(A.logout.request()),
})

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
