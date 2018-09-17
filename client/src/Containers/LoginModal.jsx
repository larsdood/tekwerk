import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Button } from 'semantic-ui-react';
import * as A from '../State/actions';


class LoginModal extends Component {
  state = {
    email: '',
    password: '',
  }
  onChange = (_, { name, value }) => {
    this.setState({ [name]: value }, () => { console.log(this.state) })
  }

  submitForm = () => {
    const { email, password } = this.state;
    this.props.login(email, password);
  }

  render() {
    return (
      <Modal basic size='tiny' trigger={this.props.trigger}>
        <Modal.Header content='Log in'/>
        <Modal.Content>
        <Form onSubmit={this.submitForm} inverted>
          <Form.Input name='email' label='Email' required onChange={this.onChange} />
          <Form.Input name='password' type='password' label='Password' required onChange={this.onChange} />
          <Button color='blue' type='submit'>Log in</Button>
        </Form>
        </Modal.Content>
      </Modal>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  login: (email, password) => dispatch(A.login.request(email, password))
})

export default connect(null, mapDispatchToProps)(LoginModal);