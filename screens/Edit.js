import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Button,
} from "react-native";

import { useContext, useCallback, useState } from "react";
import { useMutation } from "@apollo/client";
import { NEW_BUS, UPDATE_BUS } from "../graphql/BUS_LIST_QUERY";
import { Formik } from "formik";
import Picker from "@ouroboros/react-native-picker";
import DocumentPicker, { types } from "react-native-document-picker";
import RNFS from "react-native-fs";
import { forEach } from "lodash";

import Container from "./Container";
import Context from "../Context";

const fields = {
  bus_id: "",
  bus_name: "",
  departure: "",
  departure_time: "",
  arrival: "",
  arrival_time: "",
  bus_image: "",
  driver_image: "",
  driver_contact: "",
  driver_name: "",
  conductor_image: "",
  conductor_name: "",
  conductor_contact: "",
};
const required = [
  "bus_id",
  "bus_name",
  "departure",
  "departure_time",
  "arrival",
  "arrival_time",
];
const Input = ({
  label,
  name,
  keyboardType,
  handleChange,
  handleBlur,
  values,
}) => (
  <View style={{ marginBottom: 10 }}>
    <Text style={{ color: "#333", marginBottom: 5 }}>{label}</Text>
    <TextInput
      name={name}
      style={{
        borderRadius: 5,
        color: "#333",
        borderColor: "rgba(50, 50, 50, 0.3)",
        backgroundColor: "#fff",
        borderWidth: 1,
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        width: "100%",
      }}
      onChangeText={handleChange(name)}
      onBlur={handleBlur(name)}
      value={values[name]}
      keyboardType={keyboardType}
    />
  </View>
);
export default Add = ({ navigation }) => {
  const { selected, setSelected } = useContext(Context);
  const [busImage, setBusImage] = useState();
  const [driverImage, setDriverImage] = useState();
  const [conductorImage, setConductorImage] = useState();
  const [error, setError] = useState();
  const [deleteItem, setDelete] = useState();
  const [createBus] = useMutation(
    NEW_BUS,
    {
      onCompleted: () => {
        navigation.navigate("List");
      },
    }
  );
  const [updateSelected] = useMutation(UPDATE_BUS, {
    onCompleted: () => {
      navigation.navigate("List");
    },
  });

  const busPhoto = useCallback(async (name) => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: "fullScreen",
        type: [types.images],
      });
      const blob = await RNFS.readFile(response[0].uri, "base64");
      switch (name) {
        case "bus":
          setBusImage({blob, info: response[0]});
          break;
        case "driver":
          setDriverImage({blob, info: response[0]});
          break;
        case "conductor":
          setConductorImage({blob, info: response[0]});
          break;
        default:
          break;
      }
    } catch (err) {
      console.warn(err);
    }
  }, []);
  return (
    <Container title="Entry" navTo="List" error={error}>
      <View style={{ padding: 15 }}>
        <Formik
          initialValues={selected?.bus_id ? selected : fields}
          onSubmit={(values) => {
            let e = false
            forEach(required, r => {
              if (values[r] === "") e = true
            })
            if (e) {
              setError({
                message: "All fields with (*) marks are required",
                buttons: [
                  {
                    label: 'Okay',
                    onPress: () => setError(null)
                  }
                ]
              })
              return
            }

            const variables = {
              ...values,
              bus_image: busImage?.blob,
              driver_image: driverImage?.blob,
              conductor_image: conductorImage?.blob,
            };
            if (selected?.bus_id) {
              updateSelected({ variables });
            } else {
              createBus({ variables });
            }
            setSelected(null)
            console.log(values);
          }}
        >
          {(prop) => (
            <>
              <Text style={{ color: "#333", marginBottom: 20 }}>
                All fields with (*) marks are required
              </Text>
              <Text
                style={{ fontWeight: "bold", color: "#333", marginBottom: 20 }}
              >
                Bus Info
              </Text>
              <Input label="Bus ID*" name="bus_id" {...prop} />
              <Input label="Bus Name*" name="bus_name" {...prop} />
              <View style={{ marginBottom: 10 }}>
                <Text style={{ color: "#333", marginBottom: 5 }}>Origin*</Text>
                <Picker
                  style={{
                    borderRadius: 5,
                    color: "#333",
                    borderColor: "rgba(50, 50, 50, 0.3)",
                    backgroundColor: "#fff",
                    borderWidth: 1,
                    padding: 5,
                    paddingLeft: 10,
                    paddingRight: 10,
                  }}
                  onChanged={(value) => prop.setFieldValue("arrival", value)}
                  options={[
                    {
                      value: "Sta. Cruz, Zambales",
                      text: "Sta. Cruz, Zambales",
                    },
                    {
                      value: "San Felipe, Zambales",
                      text: "San Felipe, Zambales",
                    },
                    { value: "Cabangan, Zambales", text: "Cabangan, Zambales" },
                    {
                      value: "Olongapo City, Zambales",
                      text: "Olongapo City, Zambales",
                    },
                  ]}
                  value={prop.values.arrival}
                />
              </View>
              <Input label="Time of departure*" name="arrival_time" {...prop} />
              <View style={{ marginBottom: 10 }}>
                <Text style={{ color: "#333", marginBottom: 5 }}>
                  Destination*
                </Text>
                <Picker
                  style={{
                    borderRadius: 5,
                    color: "#333",
                    borderColor: "rgba(50, 50, 50, 0.3)",
                    backgroundColor: "#fff",
                    borderWidth: 1,
                    padding: 5,
                    paddingLeft: 10,
                    paddingRight: 10,
                  }}
                  onChanged={(value) => prop.setFieldValue("departure", value)}
                  options={[
                    {
                      value: "Sta. Cruz, Zambales",
                      text: "Sta. Cruz, Zambales",
                    },
                    {
                      value: "San Felipe, Zambales",
                      text: "San Felipe, Zambales",
                    },
                    { value: "Cabangan, Zambales", text: "Cabangan, Zambales" },
                    {
                      value: "Olongapo City, Zambales",
                      text: "Olongapo City, Zambales",
                    },
                  ]}
                  value={prop.values.departure}
                />
              </View>

              <Input
                label="Estimate time of Arrival*"
                name="departure_time"
                {...prop}
              />
              <Button
                title={busImage?.info?.name ? busImage?.info?.name : "Upload Bus Photo"}
                onPress={() => busPhoto("bus")}
              />

              <Text
                style={{
                  fontWeight: "bold",
                  color: "#333",
                  marginBottom: 20,
                  marginTop: 20,
                }}
              >
                Driver's Info
              </Text>
              <Input label="Driver's Fullname" name="driver_name" {...prop} />
              <Input
                label="Driver's Contact Number"
                name="driver_contact"
                {...prop}
              />
              <Button
                title={driverImage?.info?.name ? driverImage?.info?.name : "Upload Driver's Photo"}
                onPress={() => busPhoto("driver")}
              />

              <Text
                style={{
                  fontWeight: "bold",
                  color: "#333",
                  marginBottom: 20,
                  marginTop: 20,
                }}
              >
                Conductor's Info
              </Text>
              <Input
                label="Conductor's Fullname"
                name="conductor_name"
                {...prop}
              />
              <Input
                label="Conductor's Contact Number"
                name="conductor_contact"
                {...prop}
              />
              <Button
                title={conductorImage?.info?.name ? conductorImage?.info?.name : "Upload Conductor's Photo"}  
                onPress={() => busPhoto("conductor")}
              />

              <View style={{ marginTop: 30 }}>
                <Button onPress={prop.handleSubmit} title="Submit" />
              </View>
            </>
          )}
        </Formik>
      </View>
      {deleteItem && (
        <View
          style={{
            flex: 1,
            position: "absolute",
            backgroundColor: "#fff",
            top: -10,
            width: "100%",
            height: "100%",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              position: "absolute",
              backgroundColor: "#29446b",
              padding: 20,
              width: "100%",
            }}
          >
            <View>
              <Text style={{ fontSize: 15, marginBottom: 15 }}>
                Are you sure you want to delete this record?
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  rowGap: 10,
                  columnGap: 10,
                  gap: 10,
                }}
              >
                <TouchableOpacity
                  onPress={onDelete}
                  style={{
                    backgroundColor: "rgb(234, 134, 143)",
                    padding: 10,
                    flex: 1,
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 15, textAlign: "center" }}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setDelete(false)}
                  style={{ backgroundColor: "#29446b", padding: 10, flex: 1 }}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 15, textAlign: "center" }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
    </Container>
  );
};
