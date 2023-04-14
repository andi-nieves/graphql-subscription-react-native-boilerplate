/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from "react-native/Libraries/NewAppScreen";

import { useQuery, useSubscription } from "@apollo/client";
// import { useSubscription } from '@apollo/react-hooks';
import { BUS_LIST_QUERY } from "./graphql/BUS_LIST_QUERY";
import { SUBSCRIPTION } from "./graphql/SUBSCRIPTION";

function App() {
  const { data, loading, error: queErr } = useQuery(BUS_LIST_QUERY);
  // const { data: subData, loading: subLoading, error } = useQuery(SUBSCRIPTION);
  const {
    data: subData,
    loading: subLoading,
    error,
  } = useSubscription(SUBSCRIPTION);
  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
      >
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}
        >
          <Text>Working</Text>
          {loading && <Text>Loading</Text>}
          <Text>{JSON.stringify(data)}</Text>

          <Text>SUB DATA: {JSON.stringify(subData)}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
