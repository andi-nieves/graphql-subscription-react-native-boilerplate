import { AppRegistry } from "react-native";
import MyRootComponent from "./App";
import { name as appName } from "./app.json";
import { ApolloProvider, client } from "./graphql/client";

const App = () => (
  <ApolloProvider client={client}>
    <MyRootComponent />
  </ApolloProvider>
);

AppRegistry.registerComponent(appName, () => App);
