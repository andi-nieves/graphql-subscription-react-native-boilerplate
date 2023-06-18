import { AppRegistry } from "react-native";
import Home from "./screens/Home";
import View from "./screens/View";
import List from "./screens/List";
import Edit from "./screens/Edit";
import { name as appName } from "./app.json";
import { ApolloProvider, client } from "./graphql/client";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef, useState, useContext } from "react";
import Context from "./Context";
const Stack = createNativeStackNavigator();

const App = () => {
  const [list ,setList] = useState([])
  const [selected ,setSelected] = useState()
  return <ApolloProvider client={client} action={{ list, setList }}>
    <Context.Provider value={{ list, setList, selected, setSelected}}>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="List" options={{ headerShown: false }} component={List} />
        <Stack.Screen name="View" options={{ headerShown: false }} component={View} />
        <Stack.Screen name="Edit" options={{ headerShown: false }} component={Edit} />
      </Stack.Navigator>
    </NavigationContainer>
    </Context.Provider>
  </ApolloProvider>
};

AppRegistry.registerComponent(appName, () => App);
