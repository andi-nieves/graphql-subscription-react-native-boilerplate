
import { ApolloProvider, ApolloClient, InMemoryCache , split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from 'apollo-link-ws';

const httpLink = new HttpLink({
  uri: 'http://192.168.254.103:4000/graphql'
});


const wsLink = new WebSocketLink({
  uri: 'ws://192.168.254.103:4000/graphql',
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    console.log('de', definition)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});

export { ApolloProvider, client }