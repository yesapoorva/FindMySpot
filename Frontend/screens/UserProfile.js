import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { getUserToken, deleteUserToken } from "../Components/secureStore";
import { useState, useEffect } from "react";
import axios from "axios";

export default function UserProfile({ navigation }) {
  const [authToken, setAuthToken] = useState(null);
  const [userData, setUserData] = useState(null);

  async function getTokenFromAsyncStorage() {
    try {
      const token = await getUserToken();
      setAuthToken(token);
    } catch (error) {
      console.error("Error getting user token:", error);
    }
  }

  async function handleLogout() {
    try {
      deleteUserToken();
      navigation.navigate("Login");
    } catch (error) {
      console.log(error);
    }
  }

  async function getUserDetails() {
    console.log(" function token===", authToken);
    if (authToken !== null && authToken !== undefined) {
      console.log("inside if token===", authToken);

      console.log("if block runned...");
      const URL = `https://findmyspot.onrender.com/api/user/getUserDetails`;

      await axios
        .get(URL, {
          headers: {
            Authorization: authToken,
          },
        })
        .then((res) => {
          console.log(res.data);
          setUserData(res.data);
        })
        .catch((e) => {
          console.log("APi call error===", e);
        });
    } else {
      console.log("else block runned...");
    }
  }

  useEffect(() => {
    getTokenFromAsyncStorage();
  }, []);

  useEffect(() => {
    getUserDetails();
  }, [authToken]);

  return (
    <View style={styles.container}>
      <Text style={styles.SectionHead}>User Information</Text>

      {userData !== null && userData !== undefined ? (
        <View style={styles.Card}>
          <Text style={styles.Content}>Name: {userData.username}</Text>
          <Text style={styles.Content}>Email: {userData.email}</Text>
          <Text style={styles.Content}>Car Type: {userData.carType}</Text>
          <Text style={styles.Content}>Car Number: {userData.carName}</Text>
          <Text style={styles.Content}>
            Vehicle Number: {userData.vehicleNumber}
          </Text>
        </View>
      ) : (
        <View style={styles.Card}>
          <ActivityIndicator />
        </View>
      )}

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
