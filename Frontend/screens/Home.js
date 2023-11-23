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
//navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//import api
import API_KEY from "../cred";
import { useState } from "react";
import axios from "axios";

export default function Home({ navigation }) {
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    async function getLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        console.log('location permission granted');
      } else {
        console.log("location permission denied");
      }
    }
    getLocation();
  }, []);


  function handleSearch() {
    const URL = `https://api.tomtom.com/search/2/search/${encodeURIComponent(
      searchInput
    )}.json?key=${API_KEY}`;
    axios
      .get(URL)
      .then((res) => {
        setSearchResult(res.data.results);
      })

      .catch((e) => console.log(e));
  }

  function handleNavigation(result){
    navigation.navigate('Destination' ,{result});
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
            <View>
              {searchResult.map((result, index) => (
                <TouchableOpacity  key={index} onPress={() => handleNavigation(result)}>
                  <View
                    key={index}
                    style={styles.list}
                    onPress={() => console.log("pressed")}
                  >
                    <Text>{result.address.freeformAddress}</Text>
                    {}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 48,

    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "red",
  },
  heading: {
    height: 60,

    marginVertical: 40,

    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    // borderWidth: 2,
    // borderStyle: "solid",
    // borderColor: "black",
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

    // borderWidth: 1,
    // backgroundColor: "#ffffff",
    // color: "black",
  },
  SearchIcon: {
    marginRight: 0,
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
});
