import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import * as Location from "expo-location";



// api call for nearby parking spaces  GET method
url = 'https://findmyspot.onrender.com/api/parkingspaces/nearest?destinationLongitude=78&destinationLatitude=14'


export default function Destination({ route, navigation }) {
  const [searchResult, getSearchResult] = useState({});
  const [coordinates, setCoOrdinates] = useState({ lat: null, long: null });

  const destination = route.params;

  useEffect(() => {
    getSearchResult(route.params);

    if (Object.keys(searchResult).length !== 0) {
      console.log(
        `location : ${searchResult.result.address.freeformAddress} | position : lat ${searchResult.result.position.lat} long ${searchResult.result.position.lon}`
      );
    }

    // get own location
    async function getLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setCoOrdinates({
          lat: location.coords.latitude,
          long: location.coords.longitude,
        });
        console.log(coordinates);
      } else {
        console.log("location permission denied");
      }
    }

    getLocation();
  }, [destination]);

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
          </MapView>
        ) : (
          <View>
            <Text style={{ alignSelf: "center" }}>
              please search location first
            </Text>
          </View>
        )}
      </View>
    </View>
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
    height: "50%",
    width: "95%",

    alignSelf: "center",
  },
  map: {
    flex: 1,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "red",
  },
});


