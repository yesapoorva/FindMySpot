import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { getUserToken, deleteUserToken } from "../Components/secureStore";
import { useState } from "react";

export default function UserProfile({ navigation }) {
  async function handleLogout() {
    try {
      deleteUserToken();
      navigation.navigate("Login");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.SectionHead}>User Information</Text>

      <View style={styles.Card}>
        <Text style={styles.Content}>Name:----------</Text>
        <Text style={styles.Content}>Email:---------</Text>
        <Text style={styles.Content}>Car Type:------</Text>
        <Text style={styles.Content}>Car Number:-----</Text>
        <Text style={styles.Content}>Vehicle Number:--</Text>
        <Text style={styles.Content}>Contact:----------</Text>
      </View>

      <TouchableOpacity style={styles.logoutContainer} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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

  Card: {
    display: "flex",
    flexDirection: "column",
    padding: 15,
    margin: 10,
    backgroundColor: "#F1F2F6",
    borderRadius: 10,
    width: "95%",
    //height: 200,
    borderColor: "#0F81C7",
    borderWidth: 3,
  },
  SectionHead: {
    fontSize: 24,
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginBottom: 5,
    marginTop: 10,
  },
  Content: {
    fontSize: 18,
    marginBottom: 5,
    flexShrink: 1,
  },

  logoutContainer: {
    height: 48,
    width: "90%",

    position: "absolute",
    alignSelf: "center",
    bottom: 30,

    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    borderRadius: 10,
    backgroundColor: "#0F81C7",
  },
  logoutText: {
    fontSize: 20,
    color: "white",
  },
});
