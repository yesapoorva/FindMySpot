import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

export default function Destination({ route, navigation }) {
  const [searchResult, getSearchResult] = useState({});
  const [userCoOrdinates, setUserCoOrdinates] = useState({
    lat: null,
    long: null,
  });
  const [parkingSpaces, setParkingSpaces] = useState([]);
  route.params;

  //initialise function to get user's location
  async function getUserLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      const location = await Location.getCurrentPositionAsync({});
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } else {
      return null;
    }
  }

  //initate get parkinglocations function
  async function getParkingLocations(initialLocation) {
    if (initialLocation.result.position.lon !== null) {
      const URL = `https://findmyspot.onrender.com/api/parkingspaces/nearest?destinationLongitude=${initialLocation.result.position.lon}&destinationLatitude=${initialLocation.result.position.lat}`;

      try {
        const response = await axios.get(URL);
        //console.log(response);
        return response.data;
      } catch (error) {
        console.log("axios error : ", error);
        return null;
      }
    }
  }

  useEffect(() => {
    (async ()=> {
      getSearchResult(route.params);

      
      const parking = await getParkingLocations(searchResult);
      setParkingSpaces(parking);
    })()
  }, [route.params]);

  if (Object.keys(searchResult).length !== 0) {
    let locationname = searchResult.result.address.freeformAddress;
    let lattitude = searchResult.result.position.lat;
    let longitude = searchResult.result.position.lon;
    console.log(
      `location : ${locationname} | position : lat ${lattitude} long ${longitude}`
    );
  } else {
    console.log("direct navigation");
  }

  if (parkingSpaces.length > 0) {
    parkingSpaces.forEach((element)=>
    console.log(`${element.name} | long : ${element.location.coordinates[0]} | lat : ${element.location.coordinates[1]}`)
    )
  }

  console.log("search result==",searchResult);

  return(
    <View style={styles.container}>
        

    </View>
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
