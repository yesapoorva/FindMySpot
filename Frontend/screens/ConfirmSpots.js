import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Colors } from "./../components/styles";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from "axios";

const { brand, darklight, primary } = Colors;

const ConfirmSpots = ({ route, navigation }) => {
  const [parkingData, getParkingData] = useState();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isFromTimePickerVisible, setFromTimePickerVisibility] =
    useState(false);
  const [isToTimePickerVisible, setToTimePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Select Date");
  const [fromTime, setFromTime] = useState("Select from Time");
  const [toTime, setToTime] = useState("Select To Time");

  // Added state to track date and time selection
  const [isDateSelected, setDateSelected] = useState(false);
  const [isFromTimeSelected, setFromTimeSelected] = useState(false);
  // State for Date selection validation
  const [dateError, setDateError] = useState(null);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    const selectedDate = new Date(date);
    const currentDate = new Date();

    // Validate that selected date is equal to or greater than today's date
    if (selectedDate >= currentDate) {
      const x = selectedDate.toISOString().split("T");
      const x1 = x[0].split("-");
      setSelectedDate(x1[2] + "/" + x1[1] + "/" + x1[0]);
      hideDatePicker();
      // Clearing the error message if date is valid
      setDateError(null);
    } else {
      console.log("Selected date must be equal to or greater than today");
      setDateError("Selected date must be equal to or greater than today");
    }
  };

  const showFromTimePicker = () => {
    setFromTimePickerVisibility(true);
  };

  const hideFromTimePicker = () => {
    setFromTimePickerVisibility(false);
  };

  const handleFromTimeConfirm = (date) => {
    const dt = new Date(date);
    const x = dt.toLocaleTimeString();

    setFromTime(x);
    hideFromTimePicker();

    // Enable ToTime selection when FromTime is selected
    setFromTimeSelected(true);
  };

  const showToTimePicker = () => {
    setToTimePickerVisibility(true);
  };

  const hideToTimePicker = () => {
    setToTimePickerVisibility(false);
  };

  const handleToTimeConfirm = (date) => {
    const dt = new Date(date);
    const selectedToTime = dt.toLocaleTimeString();

    // Validate that ToTime is greater than FromTime
    if (new Date(selectedToTime) > new Date(fromTime)) {
      setToTime(selectedToTime);
      hideToTimePicker();
    } else {
      console.log("To Time must be greater than From Time");
    }
  };

  async function handleBooking(data) {
    if (data.id !== null && data.id !== undefined) {
      const URL = `https://findmyspot.onrender.com/api/parkingspaces/reserve/${data.id}`;
      await axios
        .get(URL)
        .then((response) => {
          console.Console.log(response);
        })
        .catch((error) => {
          console.log("status code==", error.response.status);
          console.log(error);
        });
    }
  }

  useEffect(() => {
    getParkingData(route.params);
  }, [route.params]);

  console.log("data===", parkingData);
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
            {/* Disable FromTime selection if the date is not selected */}
            <TouchableOpacity
              onPress={() => isDateSelected && showFromTimePicker()}
            >
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
            {/* Disable ToTime selection if FromTime is not selected */}
            <TouchableOpacity
              onPress={() => isFromTimeSelected && showToTimePicker()}
            >
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
          // Disable the button if any of the required fields is not filled
          disabled={
            !isDateSelected ||
            fromTime === "Select from Time" ||
            toTime === "Select To Time"
          }
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
