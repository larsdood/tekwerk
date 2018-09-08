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
        console.log`--- one state --- awaiting, success, failure`
        console.log(nextProps.awaitingResponse);
        console.log(nextProps.successStack)
        console.log(nextProps.failureStack)
        if (nextProps.failureStack.includes(A.registerEmployer.ROOT)) {
          this.setState({ awaitingRequest: false });
          console.log('bro, register failed');
        }
      }
    }
    if (this.props.awaitingResponse && nextProps.awaitingResponse) {
      if (this.props.awaitingResponse.includes(A.registerEmployer.ROOT) && !nextProps.awaitingResponse.includes(A.registerEmployer.ROOT)) {
      }
    }
  }

  onChange = (_, { name, value }) => {
    this.setState({[name]: value});
  }

  submitForm = () => {
    this.setState({ awaitingRequest: true });
    const { name, email, password } = this.state;
    this.props.registerEmployer(
      name,
      email,
      password
    );
  }

  render() {
    console.log('hsould register be open?', this.props.open);
    return (
      <Modal onClose={this.props.close} open={this.props.open} basic size='tiny' trigger={this.props.trigger}>
        <Modal.Header content={`Register ${this.props.clientType}`}/>
        <Modal.Content>
          <Form inverted onSubmit={this.submitForm}>
            <Form.Input name='name' label='Company Name' required onChange={this.onChange} />
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
  registerEmployer: (name, email, password) => { dispatch(A.registerEmployer.request(name, email, password))}
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterModal);
