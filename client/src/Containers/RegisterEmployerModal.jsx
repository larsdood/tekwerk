import React, { Component } from 'react';
import { Header, Modal, Form, Button, Loader, Dimmer } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as A from '../State/actions';
import * as S from '../State/selectors';


class RegisterEmployerModal extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    awaitingRequest: false,
    step: 0,
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
    const { adminFirstName, adminLastName, email, password } = this.state;
  
    this.props.signupEmployer(this.state)
  }

  nextStep =() => {
    this.setState({ step: this.state.step + 1});
  }

  renderCompanyInfoStep = () => {
    return (
      <React.Fragment>
        <Form.Input name='companyName' label='Company Name' required onChange={this.onChange} />
        <Form.Input name='contactEmail' label='Contact Email' required onChange={this.onChange} />
        <Button color='blue' onClick={this.nextStep}>Continue</Button>
      </React.Fragment>
    )
  }

  renderAdminSignupStep = () => {
    return (
      <React.Fragment>
        <Header content='Admin user info'/>
        An admin user is required. This user will have absolute authority to 
        edit company information. More users, with or without admin authority, 
        can be added after registration is complete.
      <Form.Group>
        <Form.Input name='adminFirstName' label='First Name' required onChange={this.onChange} />
        <Form.Input name='adminLastName' label='Last name' required onChange={this.onChange} />
      </Form.Group>
      <Form.Input name='adminEmail' label='Email address' required onChange={this.onChange} />
      <Form.Input name='adminPassword' type='password' label='Password' required onChange={this.onChange} />
      <Button active={!this.state.awaitingRequest} color='blue' type='submit'>Register</Button>       
    </React.Fragment>
    ) 
  }

  onClose = () => {
    this.setState({ step: 0 });
    this.props.close();
  }

  render() {
    return (
      <Modal onClose={this.onClose} open={this.props.open} basic size='tiny' trigger={this.props.trigger}>
        <Modal.Header content={`Register ${this.props.clientType}`}/>
        <Modal.Content>
          <Form inverted onSubmit={this.submitForm}>
            { this.state.step === 0 && this.renderCompanyInfoStep()}
            { this.state.step === 1 && this.renderAdminSignupStep()}
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
  signupEmployer: (params) => {
    dispatch(A.signupEmployer.request(params))},
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterEmployerModal);
