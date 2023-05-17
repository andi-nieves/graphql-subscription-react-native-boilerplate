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
  Image,
  PermissionsAndroid
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
import img from './assets/sil.jpg'

import BusMarker from "./components/BusMarker";
import { uniqBy, get, groupBy, orderBy, map } from "lodash";
import MapViewDirections from 'react-native-maps-directions';
import MapContext from "./config/Context";

import { SERVER_ADDED } from "./graphql/client"

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

const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    console.log('granted', granted);
    if (granted === 'granted') {
      console.log('You can use Geolocation');
      return true;
    } else {
      console.log('You cannot use Geolocation');
      return false;
    }
  } catch (err) {
    return false;
  }
};

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
    requestLocationPermission().then((res) => {
      console.log('e', res)
    })
   
  }, [])
  useEffect(() => {
    if (data) {
      setList(data.allBus)
    }
  }, [data]);
  
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
      <MapContext.Provider value={{ selected, setSelected }}>
        <View style={styles.container}>
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            region={defaultRegion}
            camera={Camera}
            customMapStyle={mapStyle}
            showsUserLocation={true}
            followsUserLocation={true}
          >
            <BusMarker data={[...list]} setSelected={setSelected} selected={selected} />
            {selected && <MapViewDirections
                origin={selected.arrival}
                destination={selected.departure}
                apikey={'AIzaSyDI9qW7VwEn8bSc2UrxbvXxAlYs2C-V0Ps'}
                strokeWidth={3}
                strokeColor="hotpink"
            />}
            
          </MapView>
        </View>
      </MapContext.Provider>
      
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
        // onClose={() => setSelected(null)}
        style={{ zIndex: 9999 }}
        showCloseButton = {true}
        onClose={() => setSelected(null)}
        onPressCloseButton={() => setSelected(null)}
        // closeOnTouchOutside={true}
        allowTouchOutside={true}
      >
        <View style={{ padding: 15 }}>
          <Text
            style={{
              color: "#29446b",
              fontWeight: "bold",
              fontSize: 20,
              marginBottom: 10,
            }}
          >
            Bus Info
          </Text>
          <View style={{ marginTop: 10, flexDirection: "row" }}>
            <View style={{ height: 60, width: 60, backgroundColor: "#FAFAFA", marginRight: 10}}>
              <Image source={{ uri: `http://${SERVER_ADDED}/images/bus-${selected?.id}.png?${Date.now()}`}} style={{ height: 60, width: 60 }} />
            </View>
            <View>
              <ItemData label="ID" value={selected?.bus_id} />
              <ItemData label="Bus Name" value={selected?.bus_name} />
              <ItemData label="Passenger" value={(selected?.passenger_count || 0) + "/45"} />
              <ItemData label="Departure" value={selected?.departure} />
              <ItemData label="Arrival" value={selected?.arrival} />
            </View>
            
          </View>
          
          
          <View style={{ marginTop: 10, flexDirection: "row" }}>
            <View style={{ height: 60, width: 60, backgroundColor: "#FAFAFA", marginRight: 10}}>
              <Image source={{ uri: `http://${SERVER_ADDED}/images/driver-${selected?.id}.png?${Date.now()}`}} style={{ height: 60, width: 60 }} />
            </View>
            <View>
              <ItemData label="Driver" value={selected?.driver_name} />
              <ItemData label="Contact Number" value={selected?.driver_contact} />
            </View>
          </View>

          <View style={{ marginTop: 10, flexDirection: "row" }}>
            <View style={{ height: 60, width: 60, backgroundColor: "#FAFAFA", marginRight: 10}}>
              <Image source={{ uri: `http://${SERVER_ADDED}/images/conductor-${selected?.id}.png?${Date.now()}`}} style={{ height: 60, width: 60 }} />
            </View>
            <View>
              <ItemData label="Conductor" value={selected?.conductor_name} />
              <ItemData label="Contact Number" value={selected?.conductor_contact} />
            </View>
          </View>
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
