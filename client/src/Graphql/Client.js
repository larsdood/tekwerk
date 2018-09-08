import ApolloClient from 'apollo-boost';

let client = new ApolloClient({
  uri: 'http://localhost:4000',
});

export default client;