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

const { brand, darklight, primary } = Colors;

const ConfirmSpots = ({ route, navigation }) => {
  const [parkingData, getParkingData] = useState();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isFromTimePickerVisible, setFromTimePickerVisibility] =
    useState(false);
  const [isToTimePickerVisible, setToTimePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Date");
  const [fromTime, setFromTime] = useState("Select from Time");
  const [toTime, setToTime] = useState("Select To Time");

  const [authToken, getAuthToken] = useState("");

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    // console.warn("A Date has been picked: ", date);
    console.log("A Date has been picked: ", date);
    const dt = new Date(date);
    const x = dt.toISOString().split("T");
    const x1 = x[0].split("-");
    setSelectedDate(x1[2] + "/" + x1[1] + "/" + x1[0]);
    hideDatePicker();
  };

  const showFromTimePicker = () => {
    setFromTimePickerVisibility(true);
  };

  const hideFromTimePicker = () => {
    setFromTimePickerVisibility(false);
  };

  const handleFromTimeConfirm = (date) => {
    //console.warn("A Time has been picked: ", date);
    console.log("A From Time has been picked: ", date);
    const dt = new Date(date);
    const x = dt.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: false,
    });

    setFromTime(x);
    hideFromTimePicker();
  };

  const showToTimePicker = () => {
    setToTimePickerVisibility(true);
  };

  const hideToTimePicker = () => {
    setToTimePickerVisibility(false);
  };

  const handleToTimeConfirm = (date) => {
    //console.warn("A Time has been picked: ", date);
    console.log("A TO Time has been picked: ", date);
    const dt = new Date(date);
    const x = dt.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: false,
    });

    setToTime(x);
    hideToTimePicker();
  };

  async function handleBooking(data) {
    console.log("data=", data.id);

    if (
      data.id !== null &&
      data.id !== undefined &&
      selectedDate !== "Date" &&
      fromTime !== "Select from Time" &&
      toTime !== "Select To Time"
    ) {
      const modifiedDate = selectedDate.split("/");
      const updatedDate = `${modifiedDate[2]}:${modifiedDate[1]}:${modifiedDate[0]}`;

      const timeDateData = {
        fromTime: `${updatedDate}T${fromTime}`,
        toTime: `${updatedDate}T${toTime}`,
      };

      console.log("id=", data.id);

      const URL = `https://findmyspot.onrender.com/api/parkingspaces/reserve/${data.id}`;

      await axios
        .post(URL,
          {
            ...timeDateData,
          },
          {
          headers: {
            Authorization: authToken,
          },
        })
        .then((response) => {
          console.log(response.data);
          Alert.alert(
            response.data.message,
            `place: ${response.data.parkingSpace.name}`
          )

          navigation.navigate("Home");
        })
        .catch((e) => {
          console.log("meesage=",e.message)
        });
    } else {
      Alert.alert(
        "All Mandatory Fields are not Selected",
        "Please select Date, From time and To time"
      );
    }
  }

  useEffect(() => {
    if (route.params !== null && route.params !== undefined) {
      getParkingData(route.params);
      getAuthToken(route.params.userData.token);
    }
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

          <TouchableOpacity onPress={() => showDatePicker()}>
            <Text style={styles.Date}>Date: {selectedDate} </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleDateConfirm}
            onCancel={hideDatePicker}
            style={{ backgroundColor: "black" }}
          />
        </View>
        <View style={styles.duration}>
          <View style={styles.fromCard}>
            <TouchableOpacity onPress={() => showFromTimePicker()}>
              <Text style={styles.Date}>From: {fromTime} </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isFromTimePickerVisible}
              mode="time"
              onConfirm={handleFromTimeConfirm}
              onCancel={hideFromTimePicker}
              style={{ backgroundColor: "black" }}
            />
          </View>
          <View style={styles.toCard}>
            <TouchableOpacity onPress={() => showToTimePicker()}>
              <Text style={styles.Date}>To: {toTime} </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isToTimePickerVisible}
              mode="time"
              onConfirm={handleToTimeConfirm}
              onCancel={hideToTimePicker}
              style={{ backgroundColor: "black" }}
            />
          </View>
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
