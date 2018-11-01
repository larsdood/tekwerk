import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Flag, Label, Modal, Form, Button, Input, Step, Icon, Checkbox, Header } from 'semantic-ui-react';
import * as A from '../State/actions.js';
import * as S from '../State/selectors';

import {
  DateInput,
} from 'semantic-ui-calendar-react';

const currencyOptions = [
  { key: 'NOK', value: 'NOK', text: 'NOK (Norwegian Kroner)'},
  { key: 'USD', value:'USD', text:'USD (Dollars)'},
  { key: 'EUR', value: 'EUR', text: 'EUR (Euro)' },
  { key: 'JPY', value: 'JPY', text: 'JPY (Japanese Yen)' },

];

const countryOptions = [
  { key: 'NO', value: 'NO', text: <Header as='h4'><Flag name='no'/>Norway</Header>},
  { key: 'US', value: 'US', text: <Header as='h4'><Flag name='us' />United States</Header> },
  { key: 'JP', value: 'JP', text: <Header as='h4'><Flag name='jp' />Japan</Header> },
  { key: 'SE', value: 'SE', text: <Header as='h4'><Flag name='se' />Sweden</Header> },
];

const educationOptions = [
  { key: "notSpecified", value: "notSpecified", text: 'Not specified'},
  { key: "highSchool", value: "highSchool", text: "High School"},
  { key: "bachelors", value: "bachelors", text: "Bachelor's Degree"},
  { key: "masters", value: "masters", text: "Master's Degree"},
  { key: "phd", value: "phd", text: "PHD"},
]

const experienceOptions = [
  { key: "none", value: "none", text: "None",},
  { key: "sixMonths", value: "sixMonths", text: "Six Months",},
  { key: "oneYear", value: "oneYear", text: "One Year",},
  { key: "twoYears", value: "twoYears", text: "Two Years",},
  { key: "threeYears", value: "threeYears", text: "Three Years"},
  { key: "fourfiveYears", value: "fourfiveYears", text: "Four-Five Years"},
  { key: "sixsevenYears", value: "sixsevenYears", text: "Six-Seven Years"},
  { key: "eightTenYears", value: "eightTenYears", text: "Eight-Ten Years"},
  { key: "tenfifteenYears", value: "tenfifteenyears", text: "10-15 Years"},
  { key: "fifteenplusYears", value: "fifteenplusYears", text: "More than 15 years"},
];

const tagsOptions = [
  { key: "C#", value: "C#", text: "C#",},
  { key: "javascript", value: "javascript", text: "JavaScript"},
  { key: "UX", value: "UX", text: "UX",},
  { key: "java", value: "java", text: "Java"},
  { key: "es6", value: "es6", text: "ES6" },
]

class NewPostingModal extends Component {

  state = {
    currentPage: 1,
    pagesAvailable: [1],

    customId: undefined,
    postingTitle: undefined,
    positionTitle: undefined,
    country: undefined,
    city: undefined,
    employmentType: 'FULL_TIME',
    description: undefined,
    enableSalary: false,
    minimumSalary: undefined,
    maximumSalary: undefined,
    currency: undefined,
    workingHoursFrom: undefined,
    workingHoursTo: undefined,
    vacationDays: undefined,
    minimumEducation: undefined,
    minimumExperience: undefined,
    internationalOK: true,
    hasRlocationAllowance: false,
    requirements: undefined,
    niceToHave: undefined,
    tags: [],
    automaticRelease: false,
    releaseAt: undefined,
    expiresAt: undefined,
  };
  onChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }
  addTag = (e, { value }) => {
    if(!this.state.tags.includes(value)) {
      this.setState({ tags: [...this.state.tags, value ]});
    }
  }

  removeTag = (tag) => {
    if (this.state.tags.includes(tag)) {
      const tags = this.state.tags;
      tags.splice(tags.indexOf(tag), 1);
      this.setState({ tags });
    }
  }

  handleChange = (e, { value }) => {
    this.setState({ employmentType: value })
  }
  submitForm= (e, what) => {
    this.props.newPosting(this.state);
  }
  toggleSalary = () => {
    this.setState({ enableSalary: !this.state.enableSalary });
  }
  toggleHasRelocationAllowance = () => {
    this.setState({ hasRelocationAllowance: !this.state.hasRelocationAllowance });
  }
  toggleInternationalOK = () => {
    this.setState({ internationalOK: !this.state.internationalOK });
  }
  toggleAutomaticRelease = () => {
    this.setState({ automaticRelease: !this.state.automaticRelease });
  }

  renderPageOne() {
    const { employmentType } = this.state;
    return (
      <Modal.Content>
        <Form onSubmit={this.submitForm}>
          <Form.Input required label='Custom ID - Use this for internal reference' >
            <Input required name='customId' onChange={this.onChange} label={`${this.props.employer.name}-`.toLowerCase()} />
          </Form.Input>
          <Form.Group widths='equal'>
            <Form.Input required name='postingTitle' label='Posting title' onChange={this.onChange} />
            <Form.Input required name='positionTitle' label='Position' onChange={this.onChange} />
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Dropdown name='country' onChange={this.onChange} required label='Country' search selection options={countryOptions} />
            <Form.Input required name='city' label='City' onChange={this.onChange} />
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
          <Form.Checkbox label='Include estimated salary range?' toggle checked={this.state.enableSalary} onChange={this.toggleSalary}/>
          <Form.Group>
            <Form.Input disabled={!this.state.enableSalary} name='minimumSalary' label='Minimum estimated salary' onChange={this.onChange}/>
            <Form.Input disabled={!this.state.enableSalary} name='maximumSalary' label='Maximum estimated salary' onChange={this.onChange}/>
            <Form.Dropdown disabled={!this.state.enableSalary} label='Currency' search selection options={currencyOptions} name='currency' onChange={this.onChange} />
          </Form.Group>
          Working Hours
          <Form.Group>
            <Form.Input label='From' width={2} name='workingHoursFrom' onChange={this.onChange} />
            <Form.Input label='To' width={2} name='workingHoursTo' onChange={this.onChange} /> 
            <Form.Input label='Paid vacation days per year' name='vacationDays' onChange={this.onChange} />
          </Form.Group>
        </Form>
      </Modal.Content>
    )
  }

  renderPageTwo() {
    const { employmentType, internationalOK, hasRelocationAllowance } = this.state;
    return (
      <Modal.Content>
        <Form onSubmit={this.submitForm}> 
          <Form.Group>
            <Form.Dropdown label='Minimum education level' selection options={educationOptions} name='minimumEducation' onChange={this.onChange}/>
            <Form.Dropdown label='Minimum experience in the given field' selection options={experienceOptions} name='minimumExperience' onChange={this.onChange}/>
          </Form.Group>
          <Form.Group>
            <Form.Checkbox label='Candidate must currently reside in ***' toggle checked={internationalOK} onChange={this.toggleInternationalOK} />
            <Form.Checkbox disabled={!internationalOK} label='Relocation allowance included' toggle checked={hasRelocationAllowance && internationalOK} onChange={this.toggleHasRelocationAllowance} />
          </Form.Group>
          <Form.TextArea required onChange={this.onChange} name='requirements' label='Requirements - Candidates without these skills will not be considered'></Form.TextArea>
          <Form.TextArea onChange={this.onChange} name='niceToHave' label='Nice to have - Candidates with these skills get preference'></Form.TextArea>
        </Form>
      </Modal.Content>
    )
  }

  renderPageThree() {
    const { employmentType } = this.state;
    return (
      <Modal.Content>
        <Form onSubmit={this.submitForm}>
          <Form.Dropdown width='4' search label='Relevant tags' selection options={tagsOptions.filter(tag => !this.state.tags.includes(tag.key))} onChange={this.addTag} />
          {this.state.tags.map(tag => 
            <Label onClick={() => this.removeTag(tag)} key={tag}>{tag}</Label>
          )}
          <br/>
          <br />

          <Form.Checkbox label='Schedule automated release?' toggle checked={this.state.automaticRelease} onChange={this.toggleAutomaticRelease} />
          <DateInput
            disabled={!this.state.automaticRelease}
            label="Release date - when do you want this posting to go public?"
            dateFormat='YYYY-MM-DD'
            name="releaseAt"
            placeholder="Date"
            value={this.state.releaseAt}
            iconPosition="left"
            onChange={this.onChange} />
          <DateInput
            label="Expiry date - when do you want to close this application?"
            dateFormat='YYYY-MM-DD'
            required
            name="expiresAt"
            placeholder="Date"
            value={this.state.expiresAt}
            iconPosition="left"
            onChange={this.onChange} />
        </Form>
      </Modal.Content>
    )
  }

  renderContent() {
    const { currentPage } = this.state;
    switch(currentPage) {
      case 1:
        return this.renderPageOne();
      case 2:
        return this.renderPageTwo();
      case 3:
        return this.renderPageThree();
      default:
        return null;
    }
  }

  renderButtons() {
    const { currentPage } = this.state;
    const nextButton =
      <Button 
        size='big'
        color='blue'
        icon
        onClick={() => this.setState({currentPage: currentPage+1})}>
          {`Next `}
          <Icon name='arrow alternate circle right' />
        </Button>

    const previousButton =
      <Button
        size='big'
        icon
        onClick={() => this.setState({ currentPage: currentPage - 1 })}>
        <Icon name='arrow alternate circle left' />
        {` Previous`}
      </Button>

    const postButton =
      <Button
        size='big'
        color='teal'
        onClick={this.submitForm}
        icon
        type='submit'>
          {`Send `}
        <Icon name='send' />
        </Button>
    switch(currentPage) {
      case 1:
        return nextButton;
      case 2:
        return <React.Fragment>{previousButton}{nextButton}</React.Fragment>
      case 3:
        return (
          <React.Fragment>
            {previousButton}
            {postButton}
          </React.Fragment>
        )
      default:
        return null;
    }

  }
  render() {
    const {employmentType, currentPage} = this.state;
    return (
      <Modal trigger={this.props.trigger}>
        <Modal.Header>New posting</Modal.Header>
        <Modal.Description>
          <Step.Group fluid>
            <Step active={currentPage===1}>
              <Icon name='info' />
              <Step.Content>
                <Step.Title>Information</Step.Title>
                <Step.Description>Information about the position</Step.Description>
              </Step.Content>
            </Step>
            <Step active={currentPage === 2}>
              <Icon name='user' />
              <Step.Content>
                <Step.Title>Requirements</Step.Title>
                <Step.Description>Description of ideal candidates</Step.Description>
              </Step.Content>
            </Step>
            <Step active={currentPage === 3}>
              <Icon name='clipboard check' />
              <Step.Content>
                <Step.Title>Meta data</Step.Title>
                <Step.Description>Tags, release date etc.</Step.Description>
              </Step.Content>
            </Step>
          </Step.Group>
        </Modal.Description>
        {this.renderContent()}
        <Modal.Actions>
          {this.renderButtons()}
        </Modal.Actions>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  employer: S.employerSelector(state),
})

const mapDispatchToProps = dispatch => ({
  newPosting: state => dispatch(A.newPosting.request(state))
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