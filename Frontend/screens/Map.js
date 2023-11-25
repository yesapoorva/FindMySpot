import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";

export default function Map() {
  const [coordinates, setCoOrdinates] = useState({ lat: null, long: null });

  useEffect(() => {
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
  }, []);

  return coordinates.lat == null ? (
    <View>
      <ActivityIndicator size="large" color="#0F81C7"></ActivityIndicator>
    </View>
  ) : (
    <MapView
      showsUserLocation
      style={styles.map}
      initialRegion={{
        latitude: coordinates.lat,
        longitude: coordinates.long,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.00421,
      }}
    />
  );
}

const styles = StyleSheet.create({
  map: {
    height: "50%",
    width: "100%",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "red",
  },
});
