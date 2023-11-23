import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";


const APIKey = 'pk.1e137f6f25c47f0ab0b6f4333abcf2b8';

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://us1.locationiq.com/v1/search.php?key=${APIKey}&q=${searchQuery}&format=json`
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const result = data[0];
          setSearchResult(result);
        } else {
          setSearchResult(null);
        }
      } else {
        setSearchResult(null);
      }
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter location"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <Button title="Search" onPress={handleSearch} />

      {searchResult && (
        <View style={styles.resultContainer}>
          <Text>{`Name: ${searchResult.display_name}`}</Text>
          <Text>{`Latitude: ${searchResult.lat}`}</Text>
          <Text>{`Longitude: ${searchResult.lon}`}</Text>

          <MapView
            style={styles.map}
            initialRegion={{
              latitude: parseFloat(searchResult.lat),
              longitude: parseFloat(searchResult.lon),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: parseFloat(searchResult.lat),
                longitude: parseFloat(searchResult.lon),
              }}
              title={searchResult.display_name}
            />
          </MapView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height:'50%',
    width:'100%',
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  resultContainer: {
    marginBottom: 20,
  },
  map: {
    width: "80%",
    height: 200,
  },
});

export default App;
