import React, { Component } from 'react';
import { Modal, Form, Button, Loader, Dimmer } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as A from '../State/actions';
import * as S from '../State/selectors';


class RegisterModal extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    awaitingRequest: false,
  };

  componentWillReceiveProps(nextProps) {
    if (this.state.awaitingRequest) {
      if (nextProps.awaitingResponse) {
        if (nextProps.failureStack.includes(A.signupEmployer.ROOT)) {
          this.setState({ awaitingRequest: false });
        }
      }
    }
    if (this.props.awaitingResponse && nextProps.awaitingResponse) {
      if (this.props.awaitingResponse.includes(A.signupEmployer.ROOT) && !nextProps.awaitingResponse.includes(A.signupEmployer.ROOT)) {
      }
    }
  }

  onChange = (_, { name, value }) => {
    this.setState({[name]: value});
  }

  submitForm = () => {
    this.setState({ awaitingRequest: true });
    const { firstName, middleNames, lastName, email, password } = this.state;
    this.props.signupCandidate(
      firstName,
      middleNames,
      lastName,
      email,
      password
    )
  }

  render() {
    return (
      <Modal onClose={this.props.close} open={this.props.open} basic size='tiny' trigger={this.props.trigger}>
        <Modal.Header content={`Register ${this.props.clientType}`}/>
        <Modal.Content>
          <Form inverted onSubmit={this.submitForm}>

            <Form.Group>
              <Form.Input name='firstName' label='First Name' required onChange={this.onChange} />
              <Form.Input name='lastName' label='Last name' required onChange={this.onChange} />
            </Form.Group>
            <Form.Input name='email' label='Email address' required onChange={this.onChange} />
            <Form.Input name='password' type='password' label='Password' required onChange={this.onChange} />
            <Button active={!this.state.awaitingRequest} color='blue' type='submit'>Register</Button> 
          </Form>
        </Modal.Content>
        <Dimmer active={this.state.awaitingRequest}><Loader active={this.state.awaitingRequest} /></Dimmer>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  awaitingResponse: S.awaitingResponseSelector(state),
  successStack: S.successStackSelector(state),
  failureStack: S.failureStackSelector(state),
})

const mapDispatchToProps = dispatch => ({
  signupEmployer: (name, email, password) => { dispatch(A.signupEmployer.request(name, email, password))},
  signupCandidate: (firstName, middleNames, lastName, email, password) => { dispatch(A.signupCandidate.request(firstName, middleNames, lastName, email, password))},
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterModal);
