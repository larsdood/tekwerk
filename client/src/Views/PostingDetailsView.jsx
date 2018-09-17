import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Header, Segment, Grid, Button, Modal, TextArea } from 'semantic-ui-react';
import * as A from '../State/actions';
import * as S from '../State/selectors';

class PostingDetailsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showApplyModal: false,
    }
    this.props.queryPostingDetails(this.props.pathname.split('/').reverse()[0]);

  }

  openApplyModal = () => {
    this.setState({showApplyModal: true})
  }

  render() {
    const { postingDetails } = this.props;
    if (!postingDetails) {
      return <div>Loading...</div>
    }
    return (
      <React.Fragment>
        <Grid columns='12'>
          <Grid.Column width='2'></Grid.Column>
          <Grid.Column width='12'>
            <Segment raised>
              <Header textAlign='center'>{postingDetails.postingTitle}</Header>
              <Grid>
                <Grid.Column width='10'>
                  <Header textAlign='left'>{postingDetails.positionTitle}</Header>
                  <Header size='small' textAlign='left'>{postingDetails.employmentType}</Header>
                  <Header size='small'>Description:</Header>{postingDetails.description}
                  <Header size='small'>Requirements:</Header>blablabla
              </Grid.Column>
                <Grid.Column width='4'>
                  <Header size='small'>{postingDetails.offeredBy && postingDetails.offeredBy.companyName}</Header>
                  {postingDetails.offeredBy.contactEmail}
                  <br />
                  <br />

                  <Button.Group>
                    <Button color='green'>Contact</Button>
                    <Button.Or text='' />
                    <Button onClick={this.openApplyModal} color='blue'>Apply</Button>
                  </Button.Group>
                </Grid.Column>

              </Grid>
            </Segment>
          </Grid.Column>
          <Grid.Column width='2'></Grid.Column>
        </Grid>
        <Modal open={this.state.showApplyModal}>
          <Modal.Header>{postingDetails.postingTitle}</Modal.Header>
          <Modal.Content>
            <Header>Application Text</Header>
            <TextArea style={{ width: '100%', minHeight: 140 }}/>
          </Modal.Content>
          <Modal.Actions>
            <Button  color='blue'>
              Send
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
      
    )
  }
}

const mapStateToProps = state => ({
  pathname: S.pathnameSelector(state),
  postingDetails: S.postingDetailsSelector(state),
});

const mapDispatchToProps = dispatch => ({
  queryPostingDetails: id => dispatch(A.queryPostingDetails.request(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(PostingDetailsView);
