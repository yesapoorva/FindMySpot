import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Colors } from "../Components/styles";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from "axios";
import { getUserToken } from "../Components/secureStore";
const { brand, darklight, primary } = Colors;

const ConfirmSpots = ({ route, navigation }) => {
  const [parkingData, getParkingData] = useState();
  const [asyncToken, getAsyncToken] = useState(null);

  async function getTokenFromAsyncStorage() {
    const token = await getUserToken();
    getAsyncToken(token);
  }

  async function handleBooking(data) {
    if (
      data.id !== null &&
      data.id !== undefined &&
      asyncToken !== null &&
      asyncToken !== undefined
    ) {
      const URL = `https://findmyspot.onrender.com/api/parkingspaces/reserve/${data.id}`;
      await axios
        .post(
          URL,
          {},
          {
            headers: {
              Authorization: asyncToken,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          Alert.alert(
            response.data.message,
            `place: ${response.data.parkingSpace.name}`
          );
          navigation.navigate("Home");
        })
        .catch((e) => {
          if (e.response) {
            console.log("status code==", e.response.status);

            if (e.response.status === 400) {
              console.log(e.response.data);
              Alert.alert(`${e.response.data.error}`);
            } else if (e.response.status === 404) {
              console.log(e.response.data);
              Alert.alert(`${e.response.data.error}`);
            } else if (e.response.status === 401) {
              console.log(e.response.data);
              Alert.alert(`${e.response.data.message}`, "Please re-login");
              navigation.navigate("Login");
            } else if (e.response.status === 500) {
              console.log(e.response.data);
              Alert.alert(`${e.response.data.message}`, "Please re-login");
              navigation.navigate("Login");
            }
            else{
              console.log(e);
              Alert.alert("Something went wrong , please try again");
            }
          } else {
            console.log(e);
            Alert.alert("Something went wrong , please try again");
          }
        });
    }
  }

  useEffect(() => {
    if (route.params !== null && route.params !== undefined) {
      getParkingData(route.params);
    }
    getTokenFromAsyncStorage();
  }, [route.params]);

  return (
    <View style={styles.container}>
      <Text style={styles.PageHeader}>Confirm MySpot</Text>
      <View style={styles.MySpot}>
        <View style={styles.Card}>
          <Text style={styles.Date}>MySpot:</Text>

          {parkingData === undefined ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.Content}>{parkingData.name}</Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => handleBooking(parkingData)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Book MySpot</Text>
        </TouchableOpacity>
      </View>
      <View></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 48,
    padding: 15,
    backgroundColor: "#FFFFFF",

    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "red",
  },
  PageHeader: {
    fontSize: 28,
    color: "#0F81C7",
    fontWeight: "bold",
    textAlign: "center",
  },
  MySpot: {
    flex: 1,
    padding: 10,
    // backgroundColor: "blue",
    alignItems: "center",
  },
  Card: {
    display: "flex",
    padding: 15,
    margin: 10,
    backgroundColor: "#F1F2F6",
    borderRadius: 10,
    width: "95%",
    height: 200,
    borderColor: "#0F81C7",
    borderWidth: 3,
  },
  Content: {
    fontSize: 20,
    paddingBottom: 10,
    textAlign: "left",
  },
  Date: {
    color: "#27187E",
    paddingTop: 20,
    fontSize: 20,
    paddingBottom: 10,
    textAlign: "left",
    fontWeight: "bold",
  },
  duration: {
    width: "100%",
  },
  fromCard: {
    width: "95%",
    backgroundColor: "#F1F2F6",
    borderRadius: 10,
    borderColor: "#0F81C7",
    borderWidth: 3,
    padding: 10,
    margin: 10,
    alignItems: "left",
    justifyContent: "center",
  },
  toCard: {
    width: "95%",
    backgroundColor: "blue",
    padding: 10,
    margin: 10,
    alignItems: "left",
    justifyContent: "center",
    backgroundColor: "#F1F2F6",
    borderRadius: 10,
    borderColor: "#0F81C7",
    borderWidth: 3,
  },
  button: {
    backgroundColor: "#0F81C7",
    padding: 15,
    borderRadius: 10,
    position: "absolute",
    bottom: 40,
    left: 15,
    right: 15,
  },
  buttonText: {
    fontSize: 24,
    textAlign: "center",
    color: "#F1F2F6",
  },
  reminderText: {
    fontSize: 16,
    textAlign: "justify",
    marginTop: 200,
    width: "90%",
  },
});

export default ConfirmSpots;
