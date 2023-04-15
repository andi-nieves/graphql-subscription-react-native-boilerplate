/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ActivityIndicator,
  TextInput,
} from "react-native";

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from "react-native/Libraries/NewAppScreen";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";

import { useQuery, useSubscription } from "@apollo/client";
import { SwipeablePanel } from "rn-swipeable-panel";

import { BUS_LIST_QUERY } from "./graphql/BUS_LIST_QUERY";
import { SUBSCRIPTION } from "./graphql/SUBSCRIPTION";
import mapStyle from "./config/mapStyles/blue.json";

import BusMarker from "./components/BusMarker";
import { uniqBy, get, groupBy, orderBy, map } from "lodash";

const defaultRegion = {
  latitude: 15.58775,
  longitude: 120.726478,
  latitudeDelta: 15.58775,
  longitudeDelta: 120.726478,
};

const Camera = {
  center: {
    latitude: 15.58775,
    longitude: 120.726478,
  },
  pitch: 1,
  heading: 1,
  zoom: 8,
};

const ItemData = ({ label, value }) => (
  <Text style={{ color: "#333" }}>
    {label}: <Text style={{ fontWeight: "bold" }}>{value}</Text>{" "}
  </Text>
);

function App() {
  const { data, loading, error } = useQuery(BUS_LIST_QUERY);
  
  const [list, setList] = useState([]);
  const { data: subData } = useSubscription(SUBSCRIPTION, { onData: ({data: { data : { bus }}}) => {
    if (bus) {
      setList([...list, bus])
    }
    return;
  }});

  const [selected, setSelected] = useState();

  useEffect(() => {
    if (data) {
      setList(data.allBus)
    }
  }, [data]);

  console.log("list", list.filter(a => a.bus_id === "2725").length)
  const isDarkMode = true; //useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    height: "100%",
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "rgba(255, 255, 255, 0.6)", position: "absolute", bottom: 15 }}>Bus Tracker App v1</Text>
        <ActivityIndicator size="small" color="rgba(255, 255, 255, 0.6)" />
      </View>
    );
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={defaultRegion}
          camera={Camera}
          customMapStyle={mapStyle}
        >
          <BusMarker data={[...list]} setSelected={setSelected} />
        </MapView>
      </View>
      <View
        style={{ position: "absolute", top: 10, width: "100%", zIndex: 100 }}
      >
        <TextInput
          style={{
            borderRadius: 10,
            margin: 10,
            color: "#333",
            borderColor: "rgba(255, 255, 255, 0.6)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderWidth: 1,
            height: 45,
            paddingHorizontal: 10,
            fontSize: 18,
          }}
          placeholder={"Search"}
          placeholderTextColor={"rgba(100, 100, 100, 0.4)"}
        />
      </View>
      <SwipeablePanel
        fullWidth
        isActive={selected ? true : false}
        onClose={() => setSelected(null)}
        style={{ zIndex: 9999 }}
        closeOnTouchOutside={true}
      >
        <View style={{ padding: 15 }}>
          <Text
            style={{
              color: "#333",
              fontWeight: "bold",
              fontSize: 16,
              marginBottom: 10,
            }}
          >
            Bus Info
          </Text>
          <ItemData label="ID" value={selected?.bus_id} />
          <ItemData label="Bus Name" value={selected?.bus_name} />
          <ItemData label="Passenger" value={selected?.passenger_count} />
          <ItemData label="Departure" value={selected?.departure} />
          <ItemData label="Arrival" value={selected?.arrival} />
        </View>
      </SwipeablePanel>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#193a55",
  },
});

export default App;
