import React, { useEffect, useState, useRef } from "react";
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

//import api KEY
import { TOMTOM_API_KEY } from "@env";

export default function Destination({ route, navigation }) {
  const [searchResult, getSearchResult] = useState({});
  const [userCoOrdinates, setUserCoOrdinates] = useState({
    longitude: null,
    latitude: null,
  });
  const [markerCoordinates, setMarkercoordinates] = useState([]);
  const [loading, setLoading] = useState(false);
  const mapReference = useRef(null); //for map referance

  //initialise function to get user's location
  async function getUserLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      const location = await Location.getCurrentPositionAsync({});
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;

      setUserCoOrdinates({
        latitude: latitude,
        longitude: longitude,
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
      const URL = `https://findmyspot.onrender.com/api/parkingspaces/nearest?destinationLongitude=${longitude}&destinationLatitude=${lattitude}`;
      setLoading(true);
      await axios
        .get(URL)
        .then((response) => {
          //make marker data from API
          const coordinates = response.data.map((element) => {
            return {
              id: element._id,
              name: element.name,
              status: element.status,
              reserved: element.reserved,
              longitude: element.location.coordinates[0],
              latitude: element.location.coordinates[1],
            };
          });

          setMarkercoordinates(coordinates);
          updateMarkers(userCoOrdinates, coordinates, TOMTOM_API_KEY);
          setMarkercoordinates(coordinates);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setMarkercoordinates([]);
          setLoading(false);
        });
    } else {
      console.log("error in data fetching");
    }
  }



// function to update markers with distance and time from user's location
  async function updateMarkers(origin, markerArray, key) {
    if (
      markerArray.length > 0 &&
      origin.latitude !== null &&
      origin.latitude !== undefined &&
      origin.longitude !== null &&
      origin.longitude !== undefined
    ) {
      const allData = await Promise.all(
        markerArray.map(async (element) => {
          setLoading(true);
          const URL = `https://api.tomtom.com/routing/1/calculateRoute/${origin.latitude},${origin.longitude}:${element.latitude},${element.longitude}/json?&traffic=true&travelMode=car&vehicleEngineType=combustion&key=${key}`;

          try {
            const response = await axios.get(URL);
            const data = {
              time: response.data.routes[0].summary.travelTimeInSeconds,
              distance: response.data.routes[0].summary.lengthInMeters,
              //points: response.data.routes[0].legs[0].points,
            };

            return { ...element, ...data };
          } catch (error) {
            console.log(error);
            return null;
          }
        })
      );

      setMarkercoordinates(allData);
      setLoading(false);
    }
  }


  // custom marker 
  function CustomMarker({ color }) {
    return <Ionicons name="car" color={color} size={30}></Ionicons>;
  }


  // function to re animate map to fit markers
  function fitToCoordinate() {
    if (mapReference.current && markerCoordinates.length > 0) {
      const searchedLocation = {
        id: "searchedResult",
        latitude: searchResult.result.position.lat,
        longitude: searchResult.result.position.lon,
      };

      const updatedData = [...markerCoordinates, searchedLocation];

      mapReference.current.fitToCoordinates(updatedData, {
        animated: true,
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      });
    }
  }


  // function to reanimate map to display user's location
  function showUserLocation() {
    if (userCoOrdinates.latitude !== null && userCoOrdinates !== null) {
      mapReference.current.animateToRegion({
        latitude: userCoOrdinates.latitude,
        longitude: userCoOrdinates.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  }


  // seconds to hour and minutes
  function convertTime(totalSeconds) {
    const totalMinutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours} hr ${minutes} min`;
  }

  //navigation function on book button
  function handleNavigation(result) {
   
    navigation.removeListener;
    navigation.navigate("ConfirmSpots", result);
  }

  useEffect(() => {
    (async () => {
      if (route.params !== undefined) {
        getSearchResult(route.params);
        await getParkingLocations(route.params);
      } else {
        console.log("direct navigation");
      }
    })();
  }, [route.params, userCoOrdinates]);

  useEffect(() => {
    (async () => {
      await getUserLocation();

      if (route.params !== undefined && markerCoordinates.length > 0) {
       // await getParkingLocations(route.params);
        await updateMarkers(userCoOrdinates, markerCoordinates, TOMTOM_API_KEY);
      }
    })();
  }, []);

  useEffect(() => {
    if (markerCoordinates.length > 0) {
      fitToCoordinate();
    }
  }, [markerCoordinates]);

  return (
    <View style={styles.container}>
      {userCoOrdinates.latitude !== null &&
      userCoOrdinates.latitude !== undefined ? (
        <View>
          {searchResult && Object.keys(searchResult).length !== 0 ? (
            <View>
              <View style={styles.title}>
                <Text>{searchResult.result.address.freeformAddress}</Text>
              </View>

              <View style={styles.mapBox}>
                {searchResult && Object.keys(searchResult).length !== 0 ? (
                  <MapView
                    showsUserLocation
                    ref={mapReference}
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

                    {route.params !== undefined &&
                    markerCoordinates.length !== 0
                      ? markerCoordinates.map((element) => (
                          <Marker
                            key={element.id}
                            coordinate={{
                              latitude: element.latitude,
                              longitude: element.longitude,
                            }}
                            pinColor="#0F81C7"
                          >
                            {element.reserved ? (
                              <CustomMarker color="#d70000" />
                            ) : (
                              <CustomMarker color="#0F81C7" />
                            )}
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
                <TouchableOpacity
                  style={styles.locationButtonBox}
                  onPress={showUserLocation}
                >
                  <Ionicons name="navigate-outline" size={36} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.parkingLocationBox}>
                {loading && userCoOrdinates.latitude !== null ? (
                  <ActivityIndicator
                    size={"large"}
                    color={"#0F81C7"}
                    style={{ alignSelf: "center", marginVertical: "40%" }}
                  />
                ) : (
                  <View>
                    {route.params !== undefined &&
                    markerCoordinates.length !== 0 ? (
                      markerCoordinates
                        .filter((element) => element.reserved !== true)
                        .map((element) => (
                          <View key={element.id} style={styles.bookBox}>
                            <View style={styles.textBox}>
                              <Ionicons
                                name="compass"
                                color="#0F81C7"
                                size={36}
                              />
                              <View>
                                <Text
                                  style={{ marginStart: 10, flexShrink: 1 }}
                                >
                                  {element.name}
                                </Text>

                                <View>
                                  {element.time ? (
                                    <Text
                                      style={{ marginStart: 10, flexShrink: 1 }}
                                    >
                                      {convertTime(element.time)} (
                                      {element.distance} m)
                                    </Text>
                                  ) : (
                                    <ActivityIndicator size={"small"} />
                                  )}
                                </View>
                              </View>
                            </View>

                            <TouchableOpacity
                              onPress={() => handleNavigation(element)}
                              style={styles.bookButton}
                            >
                              <Text style={{ color: "white", fontSize: 20 }}>
                                book
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ))
                    ) : (
                      <Text
                        style={{
                          alignSelf: "center",
                          marginVertical: "40%",
                          fontSize: 20,
                        }}
                      >
                        there are no parking spaces in this area
                      </Text>
                    )}
                  </View>
                )}
              </ScrollView>
            </View>
          ) : (
            <View>
              <Text style={{ fontSize: 24, alignSelf: "center" }}>
                Please search location first
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View>
          <ActivityIndicator size={"large"} color={"#0F81C7"} />
        </View>
      )}
    </View>
  );
}

//styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 48,

    justifyContent: "center",

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
    minHeight: "35%",
    width: "95%",

    alignSelf: "center",
  },
  map: {
    flex: 1,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
  },
  locationButtonBox: {
    position: "absolute",
    bottom: 15,
    right: 15,

    height: 60,
    width: 60,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderRadius: "50%",
    borderStyle: "solid",
    borderColor: "black",
  },
  parkingLocationBox: {
    minHeight: 320,
    maxHeight: 320,
    width: "95%",

    alignSelf: "center",
    marginVertical: 10,

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
