import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Card, Header } from 'semantic-ui-react';
import TopBar from '../Containers/TopBar';
import PublicPostingCard from '../Components/PublicPostingCard';
import * as A from '../State/actions';
import * as S from '../State/selectors';

class CandidateDashboard extends Component {
  constructor(props) {
    super(props);
    this.props.queryPublicPostings();
    this.state = { activePosting: null }
  }

  render() {
    return (
    <React.Fragment>
        <Grid columns='12'>
          <Grid.Row>

          </Grid.Row>
          <Grid.Column width='4'>
            Hello
          </Grid.Column>
          <Grid.Column width='10'>
          <Header>Jobs for you</Header>
          <Card.Group>
            {this.props.postings.map(posting =>
              <PublicPostingCard posting={posting} key={posting.id} />)}
            </Card.Group>
          </Grid.Column>
        </Grid>
    </React.Fragment>)
  }
}

const mapStateToProps = state => ({
  postings: S.publicPostingsSelector(state),
});

const mapDispatchToProps = dispatch => ({
  queryPublicPostings: () => dispatch(A.queryPublicPostings.request())
});

export default connect(mapStateToProps, mapDispatchToProps)(CandidateDashboard);