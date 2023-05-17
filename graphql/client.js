
import { ApolloProvider, ApolloClient, InMemoryCache , split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from 'apollo-link-ws';

const SERVER_ADDED = '13.210.177.188:4000';

const httpLink = new HttpLink({
  uri: `http://${SERVER_ADDED}/graphql`
});


const wsLink = new WebSocketLink({
  uri: `ws://${SERVER_ADDED}/graphql`,
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
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

export { ApolloProvider, client, SERVER_ADDED }