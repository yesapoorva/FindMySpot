return (
  <View style={styles.container}>


      {searchResult && Object.keys(searchResult).length !== 0}
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
          ref={mapReference}
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

          {route.params !== undefined && markerCoordinates.length !== 0
            ? markerCoordinates.map((element) => (
                <Marker
                  key={element.id}
                  coordinate={{
                    latitude: element.latitude,
                    longitude: element.longitude,
                  }}
                  pinColor="#0F81C7"
                >
                  <CustomMarker />
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

    <TouchableOpacity
      onPress={() => {
        getDistance(userCoOrdinates, markerCoordinates[1], TOMTOM_API_KEY);
      }}
    >
      <Text>Get Distance</Text>
    </TouchableOpacity>

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
                  <Text style={{ color: "white", fontSize: 20 }}>book</Text>
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
);