import { useContext } from "react";
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
import Context from "../Context";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";

export default Container = ({
  children,
  navTo = "Home",
  title = "",
  showAdd,
  error,
}) => {
  const { setSelected } = useContext(Context);
  const navigation = useNavigation();
  const backgroundStyle = {
    backgroundColor: "#29446b",
    height: "100%",
  };
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <TouchableOpacity
        style={{ marginLeft: 10 }}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ fontSize: 30, marginTop: 20, paddingLeft: 10 }}>
          <FontAwesomeIcon icon={faArrowLeft} color="#FFF" /> {title}
        </Text>
      </TouchableOpacity>
      {showAdd && (
        <TouchableOpacity
          onPress={() => {
            setSelected(null);
            navigation.navigate("Edit");
          }}
          style={{
            backgroundColor: "rgb(113, 44, 249)",
            height: 50,
            width: 50,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            borderRadius: 50,
            position: "absolute",
            right: 20,
            top: 25,
            zIndex: 999,
          }}
        >
          <FontAwesomeIcon
            icon={faPlus}
            color="#CCC"
            style={{ fontWeight: "bold" }}
            size={20}
          />
        </TouchableOpacity>
      )}

      <ScrollView
        style={{
          marginTop: 30,
          padding: 10,
          borderRadius: 10,
          borderColor: "rgba(255, 255, 255, 0.6)",
          backgroundColor: "#FFF",
          color: "#333",
          zIndex: 1000,
          height: "100%",
        }}
      >
        <View style={{ paddingBottom: 20 }}>{children}</View>
      </ScrollView>
      {error && (
        <View
          style={{
            flex: 1,
            position: "absolute",
            backgroundColor: "rgba(50,50,50,0.2)",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            zIndex: 9999,
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
                {error.message}
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
                {error.buttons.map((item) => <TouchableOpacity
                  key={`error-button-${item.label}`}
                  onPress={item.onPress}
                  style={{
                    backgroundColor: item.color || "rgb(234, 134, 143)",
                    padding: 10,
                    flex: 1,
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 15, textAlign: "center" }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>)}
              </View>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};
