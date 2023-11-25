import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";

export default function Destination({ route, navigation }) {
  const [searchResult, getSearchResult] = useState({});
  const [userCoOrdinates, setUserCoOrdinates] = useState({
    lat: null,
    long: null,
  });
  const [parkingSpaces, setParkingSpaces] = useState([]);
  const [markerCoordinates, setMarkercoordinates] = useState([]);
  const [loading, setLoading] = useState(false);

  //initialise function to get user's location
  async function getUserLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      const location = await Location.getCurrentPositionAsync({});
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;

      setUserCoOrdinates({
        lat: latitude,
        long: longitude,
      });
    }
  }

  //initate get parkinglocations function
  async function getParkingLocations(initialLocation) {
    if (
      initialLocation &&
      initialLocation.result &&
      initialLocation.result.position
    ) {
      const lattitude = initialLocation.result.position.lat;
      const longitude = initialLocation.result.position.lon;
      const address = initialLocation.result.address.freeformAddress;
      console.log(`address : ${address}`);
      console.log(
        `data in axios : lattitude = ${lattitude} | longitude = ${longitude}`
      );
      const URL = `https://findmyspot.onrender.com/api/parkingspaces/nearest?destinationLongitude=${longitude}&destinationLatitude=${lattitude}`;
      setLoading(true);
      axios
        .get(URL)
        .then((response) => {
          setParkingSpaces(response.data);

          //make marker data from API
          const coordinates = response.data.map((element) => {
            {
              longitude: element.location.coordinates[0];
              lattitude: element.location.coordinates[1];
            }
          });
          setMarkercoordinates(coordinates);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setParkingSpaces([]);
          setLoading(false);
        });
    }
  }

  useEffect(() => {
    console.log("useEffect run");
    if (route.params !== undefined) {
      getSearchResult(route.params);
      getParkingLocations(route.params);
      getUserLocation()
    } else {
      console.log("direct navigation");
    }
  }, [route.params]);

console.log(`user location : longitude = ${userCoOrdinates.long} | lattitude = ${userCoOrdinates.lat}`)

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text>
          {searchResult && Object.keys(searchResult).length !== 0
            ? searchResult.result.address.freeformAddress
            : "title"}
        </Text>
      </View>
      <View style={styles.mapBox}>
        {searchResult && Object.keys(searchResult).length !== 0 ? (
          <MapView
            showsUserLocation
            key={searchResult.result.position.lat}
            style={styles.map}
            initialRegion={{
              latitude: searchResult.result.position.lat,
              longitude: searchResult.result.position.lon,
              latitudeDelta: 0.00922,
              longitudeDelta: 0.00421,
            }}
          >
            <Marker
              coordinate={{
                latitude: searchResult.result.position.lat,
                longitude: searchResult.result.position.lon,
              }}
              pinColor="red"
            ></Marker>

            {route.params !== undefined && parkingSpaces.length !== 0
              ? parkingSpaces.map((element) => (
                  <Marker
                    key={element.location.coordinates[1]}
                    coordinate={{
                      latitude: element.location.coordinates[1],
                      longitude: element.location.coordinates[0],
                    }}
                    pinColor="#0F81C7"
                  >
                    <CustomMarker/>
                  </Marker>
                ))
              : null}
          </MapView>
        ) : (
          <View>
            <Text style={{ alignSelf: "center" }}>
              please search location first
            </Text>
          </View>
        )}
      </View>
      <ScrollView style={styles.parkingLocationBox}>
        {loading ? (
          <ActivityIndicator
            size={"large"}
            color={"#0F81C7"}
            style={{ alignSelf: "center", marginVertical: "40%" }}
          />
        ) : (
          <View>
            {route.params !== undefined && parkingSpaces.length !== 0 ? (
              parkingSpaces.map((element) => (
                <View key={element.name} style={styles.bookBox}>
                  <View style={styles.textBox}>
                    <Ionicons name="compass" color="#0F81C7" size={36} />
                    <Text style={{ marginStart: 10, flexShrink: 1 }}>
                      {element.name}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => console.log("booked")}
                    style={styles.bookButton}
                  >
                    <Text>book</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={{ alignSelf: "center", marginVertical: "40%" }}>
                there are no parking spaces in this area
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}


function CustomMarker(){
    return(
        <Ionicons name="car" color="#0F81C7" size={30}></Ionicons>
    )
}

//styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 48,

    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "red",
  },
  title: {
    height: 60,
    width: "95%",
    alignSelf: "center",

    marginVertical: 40,

    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "black",
    borderRadius: 10,
  },

  mapBox: {
    height: "30%",
    width: "95%",

    alignSelf: "center",
  },
  map: {
    flex: 1,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "red",
  },
  parkingLocationBox: {
    maxHeight: 320,
    width: "95%",

    alignSelf: "center",
    marginVertical: 10,

    // borderWidth: 1,
    // borderStyle: "solid",
    // borderColor: "green",
  },
  textBox: {
    height: 60,
    width: "60%",

    // borderWidth: 1,
    // borderStyle: "solid",
    // borderColor: "black",

    paddingStart: 10,

    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  bookBox: {
    height: 80,
    width: "100%",

    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    borderRadius: 10,

    backgroundColor: "#ffffff",

    marginVertical: 15,

    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    // Box shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  bookButton: {
    height: 60,
    width: 130,
    borderRadius: 10,

    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#0F81C7",
    marginVertical: "auto",
    marginRight: 5,
  },
});
