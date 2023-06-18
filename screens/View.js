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
import Context from "../Context";
import { useContext, useCallback, useState } from "react";
import { SERVER_ADDED } from "../graphql/client"
import { useQuery, useMutation } from "@apollo/client";
import { DELETE_BUS } from "../graphql/BUS_LIST_QUERY"


const ItemData = ({ label, value }) => (
    <Text style={{ color: "#333" }}>
      {label}: <Text style={{ fontWeight: "bold" }}>{value}</Text>{" "}
    </Text>
  );
export default Add = ({ navigation }) => {
    const { selected, list, setList } = useContext(Context);
    const [deleteItem, setDelete] = useState();

    const [deleteBus, { loading: deleteLoading }] = useMutation(DELETE_BUS);
    // console.log('ee', context)
    const onDelete = useCallback(() => {
      deleteBus({ variables: { bus_id: selected?.bus_id } });
      setDelete(false)
      navigation.navigate('List')
    }, [selected])
    const onEdit = useCallback(() => {
      navigation.navigate('Edit')
    }, [selected])
  return (
    <Container title="Bus Info" navTo="List" error={deleteItem}>
    <View style={{ padding: 15 }}>
          <View style={{ marginTop: 10, flexDirection: "row" }}>
            <View style={{ height: 60, width: 60, backgroundColor: "#FAFAFA", marginRight: 10}}>
              <Image source={{ uri: `http://${SERVER_ADDED}/images/bus-${selected?.id}.png?${selected?.updateAt}`}} style={{ height: 60, width: 60 }} />
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
              <Image source={{ uri: `http://${SERVER_ADDED}/images/driver-${selected?.id}.png?${selected?.updateAt}`}} style={{ height: 60, width: 60 }} />
            </View>
            <View>
              <ItemData label="Driver" value={selected?.driver_name} />
              <ItemData label="Contact Number" value={selected?.driver_contact} />
            </View>
          </View>

          <View style={{ marginTop: 10, flexDirection: "row", marginBottom: 30 }}>
            <View style={{ height: 60, width: 60, backgroundColor: "#FAFAFA", marginRight: 10}}>
              <Image source={{ uri: `http://${SERVER_ADDED}/images/conductor-${selected?.id}.png?${selected?.updateAt}`}} style={{ height: 60, width: 60 }} />
            </View>
            <View>
              <ItemData label="Conductor" value={selected?.conductor_name} />
              <ItemData label="Contact Number" value={selected?.conductor_contact} />
            </View>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-around", rowGap: 10, columnGap: 10, gap: 10}}>
            <TouchableOpacity onPress={onEdit} style={{ backgroundColor: "#29446b", padding: 10, flex: 1 }}>
              <Text style={{ color: "#fff", fontSize: 15, textAlign: "center" }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDelete({
              message: "Are you sure you want to delete this record?",
              buttons: [
                {
                  label: "Cancel",
                  onPress: () => setDelete(null),
                  color: "#29446b"
                },
                {
                  label: "Delete",
                  onPress: onDelete
                },
              ]
            })} style={{ backgroundColor: "rgb(234, 134, 143)", padding: 10, flex: 1 }}>
              <Text style={{ color: "#fff", fontSize: 15, textAlign: "center"  }}>Delete</Text>
            </TouchableOpacity>
          </View>
          
        </View>
    </Container>
  );
};
