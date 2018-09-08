import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Button, Input } from 'semantic-ui-react';
import * as A from '../State/actions.js';
import * as S from '../State/selectors';

import {
  DateInput,
} from 'semantic-ui-calendar-react';

class NewPostingModal extends Component {

  state = { employmentType: 'fulltime' };
  onChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }
  handleChange = (e, { value }) => {
    console.log('change:', value);
    this.setState({ employmentType: value })
  }
  submitForm= (e, what) => {
    console.log(this.state);
    this.props.newPosting(this.state);
  }
  render() {
    const {employmentType} = this.state;
    return (
      <Modal trigger={this.props.trigger}>
        <Modal.Header>New posting</Modal.Header>
        <Modal.Content>
          <Form onSubmit={this.submitForm}>
            <Form.Input required label='Custom ID - Use this for internal reference' >
              <Input required name='customId' onChange={this.onChange} label={`${this.props.employer.name}-`.toLowerCase()} />
            </Form.Input>
            <Form.Group widths='equal'>
              <Form.Input required name='postingTitle' label='Posting title' onChange={this.onChange} />
              <Form.Input required name='positionTitle' label='Position title' onChange={this.onChange} />
            </Form.Group>
            <Form.Group required inline>
              <label>Employment Type</label>
              <Form.Radio
                label='Fulltime'
                value='FULL_TIME'
                checked={employmentType === 'FULL_TIME'}
                onChange={this.handleChange}
              />
              <Form.Radio
                label='Parttime'
                value='PART_TIME'
                checked={employmentType === 'PART_TIME'}
                onChange={this.handleChange}
              />
              <Form.Radio
                label='Internship'
                value='INTERNSHIP'
                checked={employmentType === 'INTERNSHIP'}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.TextArea required onChange={this.onChange} name='description' label='Description'></Form.TextArea>
            <Form.TextArea required onChange={this.onChange} name='requirements' label='Requirements'></Form.TextArea>
            <DateInput
              label="Expiry date - when do you want to close this application?"
              dateFormat='YYYY-MM-DD'
              required
              name="expiresAt"
              placeholder="Date"
              value={this.state.expiresAt}
              iconPosition="left"
              onChange={this.onChange} />

            <Button color='blue' type='submit'>Post</Button>
          </Form>
        </Modal.Content>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  employer: S.employerSelector(state),
})

const mapDispatchToProps = dispatch => ({
  newPosting: state => dispatch(A.newPosting.request(state.postingTitle, state.positionTitle, state.employmentType, state.description, state.requirements, state.customId, state.expiresAt))
})

export default connect(mapStateToProps, mapDispatchToProps)(NewPostingModal);

/*type Posting {
  id: ID! @unique
  offeredBy: Employer!
  postingTitle: String!
  jobTitle: String!
  employmentType: EmploymentType!
  status: PostingStatus!
  description: String
  requirements: String
  applications: [Application!]!
}*/