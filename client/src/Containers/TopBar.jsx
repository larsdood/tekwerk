import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, Menu, Button, Header } from 'semantic-ui-react';
import * as A from '../State/actions';
import LogoHorizontal from '../Media/LogoHorizontal4x.png';

class TopBar extends Component {
  render() {
    return (
      <React.Fragment>
        <Menu pointing secondary>
          <Image style={{ width: '200px', height: '50px', padding: '5px 20px 5px 20px' }} src={LogoHorizontal} />
          <Menu.Menu position='left'>
            <Menu.Item >
              <Header color='grey' as='h4'>Jobs</Header>
            </Menu.Item>
            <Menu.Item>
              <Header color='grey' as='h4'>Applications</Header>
            </Menu.Item>
            <Menu.Item>
              <Header color='grey' as='h4'>Messages</Header>
            </Menu.Item>
          </Menu.Menu>
          
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

})

const mapDispatchToProps =  dispatch => ({
  logout: () => dispatch(A.logout.request()),
})

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
