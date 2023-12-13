import {
  Text,
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Location from "expo-location";
import { Line } from "../Components/styles";
import moment from "moment-timezone";
import { getUserToken } from "../Components/secureStore";
//import api
import { TOMTOM_API_KEY } from "@env";

import { useState } from "react";
import axios from "axios";

export default function Home({ navigation, route }) {
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [bookingData, setBookingData] = useState(null);
  const [currentBookingData, setCurrentBookingData] = useState(null);
  const [asyncToken, getAsyncToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // to get token from expo secure store
  async function getTokenFromAsyncStorage() {
    const token = await getUserToken();
    getAsyncToken(token);
  }

  //to get user's location permission
  async function getLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      console.log("location permission granted");
    } else {
      console.log("location permission denied");
    }
  }

  // to call tomtom search API
  async function handleSearch() {
    const URL = `https://api.tomtom.com/search/2/search/${encodeURIComponent(
      searchInput
    )}.json?key=${TOMTOM_API_KEY}`;
    await axios
      .get(URL)
      .then((res) => {
        setSearchResult(res.data.results);
      })

      .catch((e) => console.log(e));
  }

  // pass selected data to destination screen
  function handleNavigation(data) {
    const result = { ...data, ...route.params };
    navigation.navigate("DestinationStack", {
      screen: "Destination",
      params: { result },
    });
  }

  // get prvious booking data from backend API
  async function getPreviousBookingData() {
    if (asyncToken !== null && asyncToken !== undefined) {
      const URL = `https://findmyspot.onrender.com/api/bookings`;
      await axios
        .get(URL, {
          headers: {
            Authorization: asyncToken,
          },
        })
        .then((res) => {
          setBookingData(res.data);
          // console.log("previous parking data===", res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  //get current booking data from backend API
  async function getCurrentBookingData() {
    if (asyncToken !== null && asyncToken !== undefined) {
      const URL = `https://findmyspot.onrender.com/api/currentBookings`;
      await axios
        .get(URL, {
          headers: {
            Authorization: asyncToken,
          },
        })
        .then((res) => {
          setCurrentBookingData(null);
          setCurrentBookingData(res.data);
        })
        .catch((e) => {
          if (e.responce) {
            console.log(e.responce.data);
          }
          console.log("current booking APi call error===", e);
        });
    }
  }

  // function to unbook parking space usngi backend API
  async function unBookParkingSpace(parkingSpace) {
    setLoading(true);

    if (asyncToken !== null && asyncToken !== undefined) {
      const URL = `https://findmyspot.onrender.com/api/parkingspaces/unreserve/${parkingSpace}`;
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
        .then((res) => {
          console.log("unbooked APi data==", res.data);
          Alert.alert(`${res.data.message}`);
          getCurrentBookingData();
          getPreviousBookingData();

          setLoading(false);
        })
        .catch((e) => {
          if (e.responce) {
            console.log(e.responce.data);
          }
          console.log("unbooked  APi call error===", e);
          setLoading(false);
        });
    }
  }

  //to convert UCT time to local 12 hour format time
  function convertTime(timeString) {
    try {
      const dateObj = moment.utc(timeString).tz("Asia/Kolkata");
      const localDate = dateObj.format("DD/MM/YYYY");
      const localTime = dateObj.format("HH:mm a");

      return { localDate, localTime };
    } catch (error) {
      console.error("error  in converting time:", error);
      return {
        localDate: "Error in retriving data",
        localTime: "Error in retriving data",
      };
    }
  }

  // first uesEffect to get user location permission and to get token from secure store
  useEffect(() => {
    getLocation();
    getTokenFromAsyncStorage();
  }, []);

  // second useEffect to call current data and previous data functions
  useEffect(() => {
    const handleAsync = async () => {
      await getTokenFromAsyncStorage();
      if (asyncToken !== null && asyncToken !== undefined) {
        await getPreviousBookingData();
        await getCurrentBookingData();
      }
    };
    handleAsync();

    //cleanup function
    return setSearchResult([]);
  }, [route.params, asyncToken]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.heading}>
          <Ionicons name="car" color="#0F81C7" size={48}></Ionicons>
          <Text style={{ fontSize: 36, marginHorizontal: 16 }}>FindMySpot</Text>
        </View>

        <View style={styles.searchBox}>
          <TextInput
            style={styles.input}
            placeholder="Enter Destination"
            onChangeText={(e) => setSearchInput(e)}
          ></TextInput>
          <Ionicons
            name="search"
            size={36}
            color="black"
            onPress={handleSearch}
          ></Ionicons>
        </View>

        {/* for lsiting */}
        {searchResult.length > 0 && (
          <View style={styles.listContainer}>
            {searchResult.map((result, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleNavigation(result)}
              >
                <View key={index} style={styles.list}>
                  <Text>{result.address.freeformAddress}</Text>
                  {}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.SectionHead}>Upcoming Bookings</Text>

        <View style={styles.BookingContainer}>
          {loading === true ? (
            <ActivityIndicator />
          ) : (
            <View>
              {currentBookingData !== null &&
              currentBookingData !== undefined ? (
                <View>
                  {currentBookingData.length > 0 ? (
                    <View>
                      <ScrollView style={styles.scrollStyle}>
                        {currentBookingData.map((element, index) => (
                          <View key={index} style={styles.Card}>
                            <Text style={styles.Content}>
                              Date: {convertTime(element.fromTime).localDate}
                            </Text>
                            <Text style={styles.Content}>YourSpot:</Text>
                            <Text style={styles.Content}>
                              {element.parkingSpaceName}
                            </Text>

                            <Text style={styles.Content}>
                              From : {convertTime(element.fromTime).localTime}
                            </Text>

                            {bookingData && bookingData.length > 0 && (
                              <TouchableOpacity
                                style={styles.logoutContainer}
                                onPress={() =>
                                  unBookParkingSpace(element.parkingSpaceId)
                                }
                              >
                                <Text style={styles.logoutText}>Unbook</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                  ) : (
                    <View>
                      <Text>no current booking found</Text>
                    </View>
                  )}
                </View>
              ) : (
                <ActivityIndicator size="large" color="#0F81C7" />
              )}
            </View>
          )}
        </View>

        <Text style={styles.SectionHead}>Previous Bookings</Text>

        <View style={styles.BookingContainer}>
          {loading === true ? (
            <ActivityIndicator />
          ) : (
            <View>
              {bookingData !== null && bookingData !== undefined ? (
                <View>
                  {bookingData.length > 0 ? (
                    <View>
                      <ScrollView style={styles.scrollStyle}>
                        {bookingData
                          .filter((element) => element.toTime !== null)
                          .map((element, index) => (
                            <View key={index} style={styles.Card}>
                              <Text style={styles.Content}>
                                Date: {convertTime(element.fromTime).localDate}
                              </Text>
                              <Text style={styles.Content}>YourSpot:</Text>
                              <Text style={styles.Content}>
                                {element.parkingSpaceName}
                              </Text>

                              <Text style={styles.Content}>
                                From : {convertTime(element.fromTime).localTime}
                              </Text>
                              <Text style={styles.Content}>
                                To : {convertTime(element.toTime).localTime}
                              </Text>
                              <Text style={styles.Content}>Tariff : 40/-</Text>
                            </View>
                          ))}
                      </ScrollView>
                    </View>
                  ) : (
                    <View>
                      <Text>no previous booking found</Text>
                    </View>
                  )}
                </View>
              ) : (
                <ActivityIndicator size="large" color="#0F81C7" />
              )}
            </View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 48,
    padding: 15,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "red",
  },
  heading: {
    height: 60,

    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  searchBox: {
    height: 48,
    marginHorizontal: "5%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 10,
    borderColor: "#0F81C7",
    backgroundColor: "#ffffff",
    color: "black",
    // Box shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  input: {
    paddingHorizontal: "5%",
    width: "85%",
  },
  SearchIcon: {
    marginRight: 0,
  },

  listContainer: {
    position: "absolute",
    top: 130,
    zIndex: 1,

    width: "100%",
    alignSelf: "center",
  },
  list: {
    height: 48,
    marginHorizontal: "5%",
    marginVertical: "1%",

    paddingStart: "5%",

    display: "flex",
    flexDirection: "row",
    alignItems: "center",

    borderRadius: 10,
    backgroundColor: "#ffffff",
    color: "black",

    // Box shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  Card: {
    display: "flex",
    flexDirection: "column",
    padding: 15,
    margin: 10,
    backgroundColor: "#F1F2F6",
    borderRadius: 10,
    width: "95%",
    height: 200,
    borderColor: "#0F81C7",
    borderWidth: 3,
  },
  SectionHead: {
    fontSize: 24,
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginBottom: 5,
    marginTop: 10,
  },
  Content: {
    fontSize: 18,
    marginBottom: 5,
    flexShrink: 1,
  },
  ContentDate: {
    flexDirection: "row",
  },
  BookingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    width: "100%",
    minHeight: 250,
  },
  scrollStyle: {
    minHeight: 210,
    maxHeight: 210,
    minWidth: "100%",
    width: "100%",
    alignSelf: "center",
  },
  logoutContainer: {
    height: 48,
    width: "80%",
    alignSelf: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#0F81C7",
  },
  logoutText: {
    fontSize: 20,
    color: "#F1F2F6",
  },
});
