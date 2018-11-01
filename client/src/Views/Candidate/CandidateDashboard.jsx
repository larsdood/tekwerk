import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Card, Header, Input, Label } from 'semantic-ui-react';
import PublicPostingCard from '../../Components/PublicPostingCard';
import * as A from '../../State/actions';
import * as S from '../../State/selectors';

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
          <Grid.Column width='1' />
          <Grid.Column width='4'>
            <Header as='h5'>Search for jobs</Header>
            <Input
              icon={{ name: 'search', link: true }}
              placeholder='Search...' />
            <Header as='h5'>Popular tags</Header>
            <Label>Javascript</Label>
          </Grid.Column>
          <Grid.Column width='10'>
          <Header>Popular Job Postings</Header>
          <Card.Group>
            {this.props.postings.map(posting =>
              <PublicPostingCard posting={posting} key={posting.id} />)}
            </Card.Group>
          </Grid.Column>
          <Grid.Column width='1' />
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