// import React, { useEffect, useState, useRef } from "react";
// import {
//   ActivityIndicator,
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Button,
// } from "react-native";
// import MapView from "react-native-maps";
// import { Marker } from "react-native-maps";
// import * as Location from "expo-location";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import axios from "axios";

// //import api
// import { TOMTOM_API_KEY } from "@env";

// export default function Destination({ route, navigation }) {
//   const [searchResult, getSearchResult] = useState({});
//   const [userCoOrdinates, setUserCoOrdinates] = useState({
//     longitude: null,
//     latitude: null,
//   });
//   const [parkingSpaces, setParkingSpaces] = useState([]);
//   const [markerCoordinates, setMarkercoordinates] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [miniMloading, setMiniLoading] = useState(false);
//   const mapReference = useRef(null); //for map referance

//   //initialise function to get user's location
//   async function getUserLocation() {
//     const { status } = await Location.requestForegroundPermissionsAsync();
//     if (status === "granted") {
//       const location = await Location.getCurrentPositionAsync({});
//       const latitude = location.coords.latitude;
//       const longitude = location.coords.longitude;

//       setUserCoOrdinates({
//         latitude: latitude,
//         longitude: longitude,
//       });
//     }
//   }

//   //initate get parkinglocations function
//   async function getParkingLocations(initialLocation) {
//     if (
//       initialLocation &&
//       initialLocation.result &&
//       initialLocation.result.position
//     ) {
//       const lattitude = initialLocation.result.position.lat;
//       const longitude = initialLocation.result.position.lon;
//       const address = initialLocation.result.address.freeformAddress;
//       const URL = `https://findmyspot.onrender.com/api/parkingspaces/nearest?destinationLongitude=${longitude}&destinationLatitude=${lattitude}`;
//       setLoading(true);
//       await axios
//         .get(URL)
//         .then((response) => {
//           setParkingSpaces(response.data);

//           //make marker data from API
//           const coordinates = response.data.map((element) => {
//             return {
//               id: element.name,
//               name: element.name,
//               longitude: element.location.coordinates[0],
//               latitude: element.location.coordinates[1],
//             };
//           });


//           updateMarkers(userCoOrdinates,coordinates,TOMTOM_API_KEY);

//           setMarkercoordinates(coordinates);
//           setLoading(false);
//         })
//         .catch((error) => {
//           console.log(error);
//           setParkingSpaces([]);
//           setMarkercoordinates([]);
//           setLoading(false);
//         });
//     }
//   }

//   async function updateMarkers(origin, markerArray, key) {
//     if (
//       markerArray.length > 0 &&
//       origin.latitude !== null &&
//       origin.longitude !== 0
//     ) {
//       const allData = await Promise.all(
//         markerArray.map(async (element) => {
//           setLoading(true);
//           const URL = `https://api.tomtom.com/routing/1/calculateRoute/${origin.latitude},${origin.longitude}:${element.latitude},${element.longitude}/json?&traffic=true&travelMode=car&vehicleEngineType=combustion&key=${key}`;

//           try {
//             const response = await axios.get(URL);
//             const data = {
//               time: response.data.routes[0].summary.travelTimeInSeconds,
//               distance: response.data.routes[0].summary.lengthInMeters,
//               //points: response.data.routes[0].legs[0].points,
//             };

//             return { ...element, ...data };
//           } catch (error) {
//             console.log(error);
//             return null;
//           }
//         })
//       );

//       setMarkercoordinates(allData);
//       setLoading(false);
//     }
//   }

//   function CustomMarker() {
//     return <Ionicons name="car" color="#0F81C7" size={30}></Ionicons>;
//   }

//   function fitToCoordinate() {
//     if (mapReference.current && markerCoordinates.length > 0) {
//       const searchedLocation = {
//         id: "searchedResult",
//         latitude: searchResult.result.position.lat,
//         longitude: searchResult.result.position.lon,
//       };

//       const updatedData = [...markerCoordinates, searchedLocation];

//       mapReference.current.fitToCoordinates(updatedData, {
//         animated: true,
//         edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
//       });
//     }
//   }

//   function showUserLocation() {
//     if (userCoOrdinates.latitude !== null && userCoOrdinates !== null) {
//       mapReference.current.animateToRegion({
//         latitude: userCoOrdinates.latitude,
//         longitude: userCoOrdinates.longitude,
//         latitudeDelta: 0.005,
//         longitudeDelta: 0.005,
//       });
//     }
//   }

//   function convertTime(totalSeconds) {
//     const totalMinutes = Math.floor(totalSeconds / 60);
//     const seconds = totalSeconds % 60;
//     const hours = Math.floor(totalMinutes / 60);
//     const minutes = totalMinutes % 60;

//     return `${hours} hr ${minutes} min`;
//   }

//   useEffect(() => {
//     setMiniLoading(true);
//     getUserLocation();
//     console.log("firat useEfect runned");
//     if (route.params !== undefined) {
//       getSearchResult(route.params);
//       getUserLocation();
//       getParkingLocations(route.params);

//       if(markerCoordinates.length >0){

//         console.log(markerCoordinates.length)
//         //updateMarkers(userCoOrdinates,markerCoordinates,TOMTOM_API_KEY);
//       }
//       console.log("-----------------   1st    -----------------------");
//     } else {
//       console.log("direct navigation");
//     }
//   }, [route.params]);

//   useEffect(() => {
//     console.log("----2nd useEfect runned---");
//     if (markerCoordinates.length > 0) {
//       fitToCoordinate();
//     }
//   }, [markerCoordinates]);



//   return (
//     <View style={styles.container}>
//       {searchResult && Object.keys(searchResult).length !== 0 ? (
//         <View>
//           {userCoOrdinates.latitude !== 0 && userCoOrdinates.longitude !== 0 ? (







          
//           ) : (
//             <View>
//                 <ActivityIndicator/>
//             </View>
//           )}
//         </View>
//       ) : (
//         <View style={{ marginTop: 360 }}>
//           <Text style={{ fontSize: 36 }}>Please search location first</Text>
//         </View>
//       )}
//     </View>
//   );
// }

// //styling
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginTop: 48,

//     borderWidth: 2,
//     borderStyle: "solid",
//     borderColor: "red",
//   },
//   title: {
//     height: 60,
//     width: "95%",
//     alignSelf: "center",

//     marginVertical: 40,

//     display: "flex",
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",

//     borderWidth: 2,
//     borderStyle: "solid",
//     borderColor: "black",
//     borderRadius: 10,
//   },

//   mapBox: {
//     height: "30%",
//     width: "95%",

//     alignSelf: "center",
//   },
//   map: {
//     flex: 1,
//     borderWidth: 1,
//     borderStyle: "solid",
//     borderColor: "black",
//   },
//   locationButtonBox: {
//     position: "absolute",
//     bottom: 15,
//     right: 15,

//     height: 60,
//     width: 60,

//     alignItems: "center",
//     justifyContent: "center",

//     borderWidth: 1,
//     borderRadius: "50%",
//     borderStyle: "solid",
//     borderColor: "black",
//   },
//   parkingLocationBox: {
//     maxHeight: 320,
//     width: "95%",

//     alignSelf: "center",
//     marginVertical: 10,

//     // borderWidth: 1,
//     // borderStyle: "solid",
//     // borderColor: "green",
//   },
//   textBox: {
//     height: 60,
//     width: "60%",

//     // borderWidth: 1,
//     // borderStyle: "solid",
//     // borderColor: "black",

//     paddingStart: 10,

//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   bookBox: {
//     height: 80,
//     width: "100%",

//     borderWidth: 1,
//     borderStyle: "solid",
//     borderColor: "black",
//     borderRadius: 10,

//     backgroundColor: "#ffffff",

//     marginVertical: 15,

//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",

//     // Box shadow for iOS
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//   },
//   bookButton: {
//     height: 60,
//     width: 130,
//     borderRadius: 10,

//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",

//     backgroundColor: "#0F81C7",
//     marginVertical: "auto",
//     marginRight: 5,
//   },
// });
