/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TextInput,
  Image,
  PermissionsAndroid,
  TouchableOpacity,
  ScrollView
} from "react-native";

import {
  Colors,
} from "react-native/Libraries/NewAppScreen";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

import { useQuery, useSubscription } from "@apollo/client";
import { SwipeablePanel } from "rn-swipeable-panel";

import { BUS_LIST_QUERY } from "./graphql/BUS_LIST_QUERY";
import { SUBSCRIPTION, DELETE_SUBSCRIPTION } from "./graphql/SUBSCRIPTION";
import mapStyle from "./config/mapStyles/blue.json";

import BusMarker from "./components/BusMarker";
import { uniqBy, get, groupBy, orderBy, map, filter, includes } from "lodash";
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
  const mapRef = useRef()
  const { data, loading, error } = useQuery(BUS_LIST_QUERY);
  const [searchResult, setSearch] = useState();
  const [searchTouch, setSearchTouch] = useState();
  const [list, setList] = useState([]);
  const { data: subData } = useSubscription(SUBSCRIPTION, { onData: ({data: { data : { bus }}}) => {
    if (bus) {
      setList([...list, bus])
    }
    return;
  }});
  const { data: newCoordinate } = useSubscription(
    DELETE_SUBSCRIPTION,
    {
      onData: ({
        data
      }) => {
        setList([...list.filter(item => item.bus_id !== data?.data?.deleteBus?.bus_id)])
        return;
      },
    })

  const [selected, setSelected] = useState();

  useEffect(() => {
    requestLocationPermission().then((res) => {
      console.log('e', res)
    })
  }, [])
  useEffect(() => {
    if (data) {
      setList(data.allBus)
      setSearch(data.allBus)
    }
  }, [data]);

  const onChangeText = (string) =>  {
    setSearch(filter(list, (e) => includes(e.bus_name.toLowerCase(), string.toLowerCase()) || includes(e.bus_id.toLowerCase(), string.toLowerCase())))
  }

  const onSearchSelected = (item) => {
    // mapRef.current.animateToRegion()
    setSearchTouch(false)
    setSelected(item)
  }
  
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
      <MapContext.Provider value={{ selected, setSelected, list, setList }}>
        <View style={styles.container}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={defaultRegion}
            camera={Camera}
            customMapStyle={mapStyle}
            showsUserLocation={true}
            followsUserLocation={true}
            showsCompass={false}
            showsMyLocationButton={false}
          >
            <BusMarker data={[...list]} />
            {selected && <MapViewDirections
                origin={`${selected.arrival}, Philippines`}
                destination={`${selected.departure}, Philippines`}
                apikey={'AIzaSyDI9qW7VwEn8bSc2UrxbvXxAlYs2C-V0Ps'}
                strokeWidth={3}
                strokeColor="hotpink"
            />}
            
          </MapView>
        </View>
      </MapContext.Provider>
      
      <View
        style={{ position: "absolute", top: 10, width: "100%", zIndex: 999, padding: 10 }}
      >
        <TextInput
          style={{
            borderRadius: 10,
            color: "#333",
            borderColor: "rgba(255, 255, 255, 0.6)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderWidth: 1,
            height: 45,
            paddingHorizontal: 10,
            fontSize: 18,
            marginBottom: 10
          }}
          placeholder={"Search"}
          placeholderTextColor={"rgba(100, 100, 100, 0.4)"}
          onChangeText={onChangeText}
          onFocus={() => setSearchTouch(true)}
        />
        {(searchTouch && searchResult) && <ScrollView style={{ 
            padding: 10,
            borderRadius: 10,
            borderColor: "rgba(255, 255, 255, 0.6)",
            backgroundColor: "#FFF",
            color: "#333",
            zIndex: 1000,
            maxHeight: 200 }}>
              {searchResult.length > 0 ? searchResult.map(item => <TouchableOpacity key={`touch-${item.id}`} onPress={() => onSearchSelected(item)} style={{ marginBottom: 5, flex: 1, width: "100%", backgroundColor: "transparent" }}>
                <Text style={{ color: "#333"}}>Bus #: <Text style={{ fontWeight: "bold" }}>{item.bus_id}</Text></Text>
                <Text style={{ color: "#333"}}>Bus Name: <Text style={{ fontWeight: "bold" }}>{item.bus_name}</Text></Text>
                <Text style={{ color: "#333"}}>Origin: <Text style={{ fontWeight: "bold" }}>{item.arrival}</Text></Text>
                <Text style={{ color: "#333"}}>Time of arrival: <Text style={{ fontWeight: "bold" }}>{item.arrival_time}</Text></Text>
                <Text style={{ color: "#333"}}>Destination: <Text style={{ fontWeight: "bold" }}>{item.departure}</Text></Text>
                <Text style={{ color: "#333"}}>Destination ETA: <Text style={{ fontWeight: "bold" }}>{item.arrival_time}</Text></Text>
          </TouchableOpacity>) : <Text style={{ color: "#333"}}>No item found</Text>}
        </ScrollView>}
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
              <Image source={{ uri: `http://${SERVER_ADDED}/images/bus-${selected?.id}.png?${selected?.createdAt}`}} style={{ height: 60, width: 60 }} />
            </View>
            <View>
              <ItemData label="ID" value={selected?.bus_id} />
              <ItemData label="Bus Name" value={selected?.bus_name} />
              <ItemData label="Passenger" value={(selected?.passenger_count || 0) + "/45"} />
              <ItemData label="Origin" value={selected?.arrival} />
              <ItemData label="Departure Time" value={selected?.arrival_time} />
              <ItemData label="Destination" value={selected?.departure} />
              <ItemData label="Arrival Time" value={selected?.departure_time} />
            </View>
          </View>
          
          <View style={{ marginTop: 10, flexDirection: "row" }}>
            <View style={{ height: 60, width: 60, backgroundColor: "#FAFAFA", marginRight: 10}}>
              <Image source={{ uri: `http://${SERVER_ADDED}/images/driver-${selected?.id}.png?${selected?.createdAt}`}} style={{ height: 60, width: 60 }} />
            </View>
            <View>
              <ItemData label="Driver" value={selected?.driver_name} />
              <ItemData label="Contact Number" value={selected?.driver_contact} />
            </View>
          </View>

          <View style={{ marginTop: 10, flexDirection: "row" }}>
            <View style={{ height: 60, width: 60, backgroundColor: "#FAFAFA", marginRight: 10}}>
              <Image source={{ uri: `http://${SERVER_ADDED}/images/conductor-${selected?.id}.png?${selected?.createdAt}`}} style={{ height: 60, width: 60 }} />
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
