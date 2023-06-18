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
  ScrollView,
} from "react-native";
import Container from "./Container";
import { useQuery, useSubscription } from "@apollo/client";
import {
  BUS_LIST_QUERY,
  DELETE_SUB,
  BUS_ADDED,
} from "../graphql/BUS_LIST_QUERY";
import Context from "../Context";
import { useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";

export default List = ({ navigation, ...prop }) => {
  const { data, loading, error } = useQuery(BUS_LIST_QUERY);
  const sub = useSubscription(DELETE_SUB);
  
  const context = useContext(Context);
  const subAdd = useSubscription(BUS_ADDED, { onData: ({data: { data : { bus }}}) => {
    console.log('b', bus)
    if (bus) {
      context.setList([...context.list, bus])
    }
    return;
  }});;
  useEffect(() => {
    if (data?.allBus) context.setList(data.allBus);
  }, [data]);
  useEffect(() => {
    if (sub?.data) {
      context.setList(
        context.list.filter(
          (item) => item.bus_id != sub?.data?.deleteBus.bus_id
        )
      );
    }
  }, [sub]);

  if (loading)
    return <ActivityIndicator size="small" color="rgba(255, 255, 255, 0.6)" />;

  return (
    <Container title="Bus List" showAdd>
      {context.list.map((item) => (
        <TouchableOpacity
          key={`touch-${item.id}`}
          onPress={() => {
            navigation.navigate("View");
            context.setSelected(item);
          }}
          style={{
            marginBottom: 5,
            flex: 1,
            width: "100%",
            backgroundColor: "transparent",
          }}
        >
          <Text style={{ color: "#333" }}>
            Bus #: <Text style={{ fontWeight: "bold" }}>{item.bus_id}</Text>
          </Text>
          <Text style={{ color: "#333" }}>
            Bus Name:{" "}
            <Text style={{ fontWeight: "bold" }}>{item.bus_name}</Text>
          </Text>
          <Text style={{ color: "#333" }}>
            Origin: <Text style={{ fontWeight: "bold" }}>{item.arrival}</Text>
          </Text>
          <Text style={{ color: "#333" }}>
            Time of arrival:{" "}
            <Text style={{ fontWeight: "bold" }}>{item.arrival_time}</Text>
          </Text>
          <Text style={{ color: "#333" }}>
            Destination:{" "}
            <Text style={{ fontWeight: "bold" }}>{item.departure}</Text>
          </Text>
          <Text style={{ color: "#333" }}>
            Destination ETA:{" "}
            <Text style={{ fontWeight: "bold" }}>{item.arrival_time}</Text>
          </Text>
        </TouchableOpacity>
      ))}
    </Container>
  );
};
