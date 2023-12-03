import {
  Text,
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Location from "expo-location";
import { Line } from "./../Components/styles";

//import api
import { TOMTOM_API_KEY } from "@env";

import { useState } from "react";
import axios from "axios";

export default function Home({ navigation, route }) {
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    async function getLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        console.log("location permission granted");
      } else {
        console.log("location permission denied");
      }
    }
    getLocation();

  }, []);

  useEffect(()=>{
    console.log("moved to home screen , clearing searchresult array")
    setSearchResult([]);
  },[route.params])


  function handleSearch() {
    const URL = `https://api.tomtom.com/search/2/search/${encodeURIComponent(
      searchInput
    )}.json?key=${TOMTOM_API_KEY}`;
    axios
      .get(URL)
      .then((res) => {
        setSearchResult(res.data.results);
      })

      .catch((e) => console.log(e));
  }

  function handleNavigation(data) {
    const result = { ...data, ...route.params };
    navigation.navigate("DestinationStack", {
      screen: "Destination",
      params: { result },
    });
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.heading}>
            <Ionicons name="car" color="#0F81C7" size={48}></Ionicons>
            <Text style={{ fontSize: 36, marginHorizontal: 16 }}>
              FindMySpot
            </Text>
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

          <View>
            <View>
              <Text style={styles.SectionHead}>Upcoming Bookings</Text>
              <View style={styles.Card}>
                <Text style={styles.Content}>Date: 30th November, 2023</Text>
                <Text style={styles.Content}>YourSpot:</Text>
                <Text style={styles.Content}>
                  46, Richmond Rd, Victoria Layout, Bengaluru, Karnataka 560025
                </Text>
                <Text style={styles.Content}>From : 06: 00 PM</Text>
                <Text style={styles.Content}>From : 09: 00 PM</Text>
                <Text style={styles.Content}>Tariff : 60/-</Text>
              </View>
            </View>
            <Line />
            <View>
              <Text style={styles.SectionHead}>Previous Bookings</Text>
              <View style={styles.Card}>
                <Text style={styles.Content}>Date: 28th November, 2023</Text>
                <Text style={styles.Content}>YourSpot:</Text>
                <Text style={styles.Content}>
                  36, Infosys Campus, Electronic City, Bengaluru, Karnataka
                  560025
                </Text>
                <Text style={styles.Content}>From : 06: 00 PM</Text>
                <Text style={styles.Content}>From : 08: 00 PM</Text>
                <Text style={styles.Content}>Tariff : 40/-</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
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
  },
  Content: {
    fontSize: 18,
    marginBottom: 5,
  },
  ContentDate: {
    flexDirection: "row",
  },
});
