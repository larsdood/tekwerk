import ApolloClient from 'apollo-boost';

const production = true;

let client = new ApolloClient({
  uri: production ? '/graphql' : 'http://localhost:4000/graphql',
});

export default client;