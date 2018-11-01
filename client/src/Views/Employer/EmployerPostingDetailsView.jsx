import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Header, Segment, Grid, Button, Modal, TextArea, Card } from 'semantic-ui-react';
import ApplicationCard from '../../Components/ApplicationCard';
import * as A from '../../State/actions';
import * as S from '../../State/selectors';

class EmployerPostingDetailsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showApplyModal: false,
      applicationLetter: '',
    }
    this.props.queryPostingDetails(this.props.pathname.split('/').reverse()[0]);
  }

  setApplyModalVisible = setTo => {
    this.setState({ showApplyModal: setTo });
  }

  applicationLetterChange = (_, { value }) => {
    this.setState({ applicationLetter: value });
  }

  renderApplicationCardsSegment = () => {
    const { postingDetails } = this.props;
    if (!postingDetails.applications || postingDetails.applications.length < 1) return null;

    return (
      <React.Fragment>
          <Header textAlign='center'>Applications</Header>
          <Card.Group>
            {postingDetails.applications.map(application =>
              <ApplicationCard
                key={application.applicant.email}
                firstName={application.applicant.firstName}
                lastName={application.applicant.lastName}
                email={application.applicant.email}
                applicationLetter={application.applicationLetter}
                status={application.status}
                sendMessage={this.props.sendMessage}
                applicantId={application.applicant.id} />)}
          </Card.Group>
      </React.Fragment>
    );
  }

  render() {
    const { postingDetails } = this.props;
    if (!postingDetails || Object.keys(postingDetails).length === 0) {
      return <div>Loading...</div>
    }
    return (
      <React.Fragment>
            <Grid.Row>
                <Header textAlign='center'>{postingDetails.postingTitle}</Header>
                <Grid>
                  <Grid.Column width='10'>
                    <Header size='small' textAlign='left'>Position title:</Header>
                    <Header textAlign='left'>{postingDetails.positionTitle}</Header>
                    <Header size='small' textAlign='left'>Employment type:</Header>
                    <Header size='small' textAlign='left'>{postingDetails.employmentType}</Header>
                    <Header size='small'>Description:</Header>{postingDetails.description}
                    <Header size='small'>Requirements:</Header>blablabla
                </Grid.Column>
                  <Grid.Column width='4'>
                    <Header size='small'>{postingDetails.offeredBy && postingDetails.offeredBy.companyName}</Header>
                    <br />
                    <br />
                  </Grid.Column>
                </Grid>
            </Grid.Row>
            <br/>
            <Grid.Row>
          {this.renderApplicationCardsSegment()}

            </Grid.Row>
      </React.Fragment>
      
    )
  }
}

const mapStateToProps = state => ({
  pathname: S.pathnameSelector(state),
  postingDetails: S.internalPostingDetailsSelector(state),
});

const mapDispatchToProps = dispatch => ({
  queryPostingDetails: id => dispatch(A.queryInternalPostingDetails.request(id)),
  sendMessage: (toId, message) => dispatch(A.postMessage.request(toId, message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EmployerPostingDetailsView);
